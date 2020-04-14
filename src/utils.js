const la = require('lazy-ass')
const is = require('check-more-types')
const { join } = require('path')

/**
 * Returns parsed command line arguments.
 * If start command is NPM script name defined in the package.json
 * file in the current working directory, returns 'npm run start' command.
 */
const getArguments = cliArgs => {
  la(is.strings(cliArgs), 'expected list of strings', cliArgs)

  const service = {
    start: 'start',
    url: undefined
  }
  const services = [service]

  let test = 'test'

  if (cliArgs.length === 1 && isUrlOrPort(cliArgs[0])) {
    // passed just single url or port number, for example
    // "start": "http://localhost:8080"
    service.url = normalizeUrl(cliArgs[0])
  } else if (cliArgs.length === 2) {
    if (isUrlOrPort(cliArgs[0])) {
      // passed port and custom test command
      // like ":8080 test-ci"
      service.url = normalizeUrl(cliArgs[0])
      test = cliArgs[1]
    }
    if (isUrlOrPort(cliArgs[1])) {
      // passed start command and url/port
      // like "start-server 8080"
      service.start = cliArgs[0]
      service.url = normalizeUrl(cliArgs[1])
    }
  } else if (cliArgs.length === 5) {
    service.start = cliArgs[0]
    service.url = normalizeUrl(cliArgs[1])

    const secondService = {
      start: cliArgs[2],
      url: normalizeUrl(cliArgs[3])
    }
    services.push(secondService)

    test = cliArgs[4]
  } else {
    la(
      cliArgs.length === 3,
      'expected <NPM script name that starts server> <url or port> <NPM script name that runs tests>\n',
      'example: start-test start 8080 test\n',
      'see https://github.com/bahmutov/start-server-and-test#use\n'
    )
    service.start = cliArgs[0]
    service.url = normalizeUrl(cliArgs[1])
    test = cliArgs[2]
  }

  services.forEach(service => {
    service.start = normalizeCommand(service.start)
  })

  test = normalizeCommand(test)

  return {
    services,
    test
  }
}

function normalizeCommand (command) {
  return UTILS.isPackageScriptName(command) ? `npm run ${command}` : command
}

/**
 * Returns true if the given string is a name of a script in the package.json file
 * in the current working directory
 */
const isPackageScriptName = command => {
  la(is.unemptyString(command), 'expected command name string', command)

  const packageFilename = join(process.cwd(), 'package.json')
  const packageJson = require(packageFilename)
  if (!packageJson.scripts) {
    return false
  }
  return Boolean(packageJson.scripts[command])
}

const isWaitOnUrl = s => /^https?-(?:get|head|options)/.test(s)

const isUrlOrPort = input => {
  const str = is.string(input) ? input.split('|') : [input]

  return str.every(s => {
    if (is.url(s)) {
      return s
    }
    // wait-on allows specifying HTTP verb to use instead of default HEAD
    // and the format then is like "http-get://domain.com" to use GET
    if (isWaitOnUrl(s)) {
      return s
    }

    if (is.number(s)) {
      return is.port(s)
    }
    if (!is.string(s)) {
      return false
    }
    if (s[0] === ':') {
      const withoutColon = s.substr(1)
      return is.port(parseInt(withoutColon))
    }
    return is.port(parseInt(s))
  })
}

const normalizeUrl = input => {
  const str = is.string(input) ? input.split('|') : [input]

  return str.map(s => {
    if (is.url(s)) {
      return s
    }

    if (is.number(s) && is.port(s)) {
      return `http://localhost:${s}`
    }

    if (!is.string(s)) {
      return s
    }

    if (is.port(parseInt(s))) {
      return `http://localhost:${s}`
    }

    if (s[0] === ':') {
      return `http://localhost${s}`
    }
    // for anything else, return original argument
    return s
  })
}

function printArguments ({ services, test }) {
  services.forEach((service, k) => {
    console.log('%d: starting server using command "%s"', k + 1, service.start)
    console.log(
      'and when url "%s" is responding with HTTP status code 200',
      service.url
    )
  })

  console.log('running tests using command "%s"', test)
  console.log('')
}

// placing functions into a common object
// makes them methods for easy stubbing
const UTILS = {
  getArguments,
  isPackageScriptName,
  isUrlOrPort,
  normalizeUrl,
  printArguments
}

module.exports = UTILS
