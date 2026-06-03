const childProcess = require('node:child_process')

console.log('Starting server as child process')

const result = childProcess.spawnSync(
  'node',
  []
    .concat(require.resolve('./server'))
    .concat(process.argv.slice(2)),
  { stdio: 'inherit' },
)

console.log('Done')
