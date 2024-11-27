const { spawn } = require('node:child_process');
const { pipeline, Transform, Writable } = require('node:stream');
const split2 = require('split2');

/**
 * Create a stream reader to get the list of currently running processes.
 * This function runs on windows (using powershell 5.1) and on *nix systems.
 * @returns stream.Readable emitting the list of all running processes
 */
function createPsReader() {
  let processLister;
  if (process.platform === 'win32') {
    processLister = spawn('powershell.exe',['Get-WmiObject -Class Win32_Process | Select-Object -Property Name,ProcessId,ParentProcessId,Status | Format-Table']);
  } else {
    processLister = spawn('ps', ['-A', '-o', 'ppid,pid,stat,comm']);
  }

  processLister.stdout.setEncoding('utf8');
  return processLister.stdout;
}

/**
 * Convert incoming lines to an array of objects containing information
 * about the selected main process and all of its child processes.
 * Incoming chunks are expected to be lines of strings.
 * Outgoing chunks are also lines of strings.
 * Each chunk must be a single line of data.
 * Properties of the options object:
 * @param {number|string} pid - pid of the root process to inspect; defaults to
 *                              the root process of the os
 * @param {number} maxIterations - maximum number of levels inspected; defaults
 *                                 to 10
 * Structure of the resulting array:
 * @param {string} PPID - process id of the parent process
 * @param {string} PID - process id of the process
 * @param {string} COMMAND - name of the process
 * @param {string} STAT - status of the process
 */
class LinesToPsObjectsArrayTransform extends Transform {
  /**
   * Create a transform stream to extract information about a process and its
   * child processes as an array of objects from the incoming data (lines of
   * strings).
   * @param {Object} options - options of the selection with properties:
   *                 pid - pid of the root process to inspect; defaults to the
   *                       root process of the os
   *                 maxIterations - maximum number of levels inspected;
   *                       defaults to 10
   */
  constructor(options) {
    super({ readableObjectMode:true });
    const defaultMaxIterations = 10;
    
    let defaultPpid = (process.platform === 'win32') ? 0 : 1;
    this.parentProcessID = options?.['pid'] ?? defaultPpid;
    if (typeof this.parentProcessID === 'number') {
      this.parentProcessID = this.parentProcessID.toString();
    }
    
    this.maxIterations = options?.['maxIterations'] ?? defaultMaxIterations;

    this.headers = null;
    this.psObjects = [];
  }

  /**
   * Filter unnecessary lines from the input stream - remove empty lines and the line
   * that shows the dashes under the column titles.
   * @param {Node.Buffer} chunk - The data to be transformed.
   * @param {string} encoding - If the chunk is a string, then this is the encoding type. 
   *                            If chunk is a buffer, then this is the special value 'buffer';
   *                            ignore it in that case.
   * @param {Function} callback - A callback function (optionally with an error argument and data)
     *                            to be called after the supplied chunk has been processed.
   */
  _transform(chunk, encoding, callback) {
    let line = Buffer.isBuffer(chunk) ? chunk.toString(): chunk;
    line = line.trim();

    // Remove unnecessary lines created by powershell
    if ((line.length === 0) || line.includes('----')) {
      return callback();
    }

    /**
     * First line contains the column headers. All columns have a fixed width.
     * On windows COMMANDs may contain white spaces; therefore we cannot simply
     * split the lines using white spaces as separators.
     */
    if (this.headers === null) {
      this.headers = this._getColumnDefs(line);

      this.headers = this.headers.map(header => {
        header.header = this._normalizeHeader(header.header);
        return header;
      });
      return callback();
    }

    // Convert string lines to array of objects with process information
    const row = {};
    for (const headerDef of this.headers) {
      const columnValue = line.substring(headerDef.start, headerDef.end).trim();
      row[headerDef.header] = columnValue;
    }
    this.psObjects.push(row);

    callback();
  }

  /**
   * Select the list of child processes and emit it to the output stream.
   * @param {Function} callback - A callback function (optionally with an error
   *                   argument and data) to be called when remaining data has
   *                   been flushed.
   */
  _flush(callback) {
    // Select objects of main process and its child processes in an array
    const childProcesses = this._selectChildProcesses(this.psObjects, this.parentProcessID, this.maxIterations);
    this.push(childProcesses);

    callback();
  }

  /**
   * Extract the column definitions from the first line.
   * On Linux: the first column header is right aligned.
   * On Windows: the first column header is left aligned.
   * @param {string} line - Header of the list columns
   * @returns {Object[]} Array of objects containing the definition of 1 column
   */
  _getColumnDefs(line) {
    const columnDefinitions = [];
    let startOfColumnIncl = 0;
    let endOfColumnExcl = 0;
    let foundStartOfHeader = false;
    let foundEndOfHeader = false;
    for (let i = 0; i < line.length; i++) {
      const isWhitespace = line.substring(i, i + 1).trim() === '';
      if (!foundStartOfHeader && !isWhitespace) {
        // search for first header, if it is right aligned (on linux)
        foundStartOfHeader = true;
      } else if (foundStartOfHeader && isWhitespace) {
        // search for end of header text
        foundEndOfHeader = true;
      } else if (foundEndOfHeader && !isWhitespace) {
        endOfColumnExcl = i - 1;
        const header = line.substring(startOfColumnIncl, endOfColumnExcl).trim();
        columnDefinitions.push({start:startOfColumnIncl, end:endOfColumnExcl, header:header});
        startOfColumnIncl = i;
        foundStartOfHeader = true;
        foundEndOfHeader = false;
      }
    }

    // last column
    const header = line.substring(startOfColumnIncl, line.length).trim();
    columnDefinitions.push({start:startOfColumnIncl, end:line.length, header:header});
    return columnDefinitions;
  }

  /**
   * Normalizes the given header from the Windows title to the Linux title
   * of the processes list.
   * @param {string} header - Header string to normalize
   */
  _normalizeHeader(header) {
    switch (header) {
      case 'Name':  // for windows
      case 'COMM':  // for linux
        return 'COMMAND';
      case 'ParentProcessId':
        return 'PPID';
      case 'ProcessId':
        return 'PID';
      case 'Status':
        return 'STAT';
      default:
        return header
    }
  }

  /**
   * Get the list of the main process with the given pid and of all its child
   * processes down to 'maxIterations' levels.
   * @param {Object[]} allProcesses - array of objects for all processes
   * @param {string} pid - process id of the parent
   * @param {number} maxIterations - maximum number of levels inspected
   * @returns array containing objects describing all found processes
   */
  _selectChildProcesses(allProcesses, pid, maxIterations) {
    let remainingIterations = maxIterations;
    const childProcesses = [];
    const childProcessesIds = [];
    let parents = [ pid ];
    let nextParents = [];
    while ((remainingIterations > 0) && (parents.length > 0)) {
      for (const psObject of allProcesses) {
        if (parents.includes(psObject['PPID']) && !childProcessesIds.includes(psObject['PID'])) {
          childProcesses.push(psObject);
          childProcessesIds.push(psObject['PID']);
          nextParents.push(psObject['PID']);
        }
      }

      parents = nextParents;
      nextParents = [];
      remainingIterations--;
    }

    return childProcesses;
  }
}

/**
 * Emit incoming array of process information to a given callback.
 * The callback is given as a function in the options object.
 * Properties of the options object:
 * @param {Function} resultCallback - callback with selected processes list as
 *                                    parameter
 * Structure of the resulting array:
 * @param {string} PPID - process id of the parent process
 * @param {string} PID - process id of the process
 * @param {string} COMMAND - name of the process
 * @param {string} STAT - status of the process
 */
class ObjectToCallbackWritable extends Writable {
  /**
   * Create a writable stream to emit the array of information about a process
   * and its child processes by calling a given callback function.
   * @param {Object} options - options of the selection with properties:
   *                 resultCallback - callback with selected processes list
   */
  constructor(options) {
    super({ objectMode:true });

    this.resultCallback = options?.['resultCallback'];
    this.childProcesses = [];
  }

  /**
   * Collect the incoming processes list into an internal array.
   * @param {Node.Buffer} chunk - The data to be collected (array or single object).
   * @param {string} encoding - If the chunk is a string, then this is the encoding type. 
   *                            If chunk is a buffer, then this is the special value 'buffer';
   *                            ignore it in that case.
   * @param {Function} callback - A callback function (optionally with an error argument and data)
   *                             to be called after the supplied chunk has been processed.
   */
  _write(chunk, encode, callback) {
    if(Array.isArray(chunk)) {
      this.childProcesses.push(...chunk);
    } else {
      this.childProcesses.push(chunk);
    }

    callback();
  }

  /**
   * Emit the collected list of child processes with the callback given in options.
   *
   * @param {Function} callback - A callback function (optionally with an error
   *                   argument and data) to be called when remaining data has
   *                   been flushed.
   */
  _final(callback) {
    if ((this.resultCallback !== undefined) && (typeof this.resultCallback === 'function')) {
      this.resultCallback(this.childProcesses);
    }

    callback();
  }
}

/**
 * Get all processes of a child process with a given id.
 * This is a replacement for the 'indexzero/ps-tree' package without the
 * vulnerabilities.
 * @param {number | string | undefined} pid - ID of the process under inspection
 * @param {nodeCallback} callback - function(err, children) to return errors/children
 */
function psTree2(pid, callback) {
  pipeline(
    createPsReader(),
    split2({ maxLength: 200}),
    new LinesToPsObjectsArrayTransform({pid: pid, maxIterations: 5}),
    new ObjectToCallbackWritable({ resultCallback: (children) => callback(null, children) }),
    (err) => {
      if (err) {
        callback(err);
      }
    }
  );
}

exports.psTree2 = psTree2;
