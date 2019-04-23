const la = require('lazy-ass')
const is = require('check-more-types')

/**
 * Returns parsed command line arguments.
 */
const getArguments = cliArgs => {
  la(is.strings(cliArgs), 'expected list of strings', cliArgs)

  let start = 'start'
  let test = 'test'
  let url

  if (cliArgs.length === 1 && isUrlOrPort(cliArgs[0])) {
    // passed just single url or port number, for example
    // "start": "http://localhost:8080"
    url = normalizeUrl(cliArgs[0])
  } else if (cliArgs.length === 2) {
    if (isUrlOrPort(cliArgs[0])) {
      // passed port and custom test command
      // like ":8080 test-ci"
      url = normalizeUrl(cliArgs[0])
      test = cliArgs[1]
    }
    if (isUrlOrPort(cliArgs[1])) {
      // passed start command and url/port
      // like "start-server 8080"
      start = cliArgs[0]
      url = normalizeUrl(cliArgs[1])
    }
  } else {
    la(
      cliArgs.length === 3,
      'expected <NPM script name that starts server> <url or port> <NPM script name that runs tests>\n',
      'example: start-test start 8080 test\n',
      'see https://github.com/bahmutov/start-server-and-test#use\n'
    )
    start = cliArgs[0]
    url = normalizeUrl(cliArgs[1])
    test = cliArgs[2]
  }

  return {
    start,
    url,
    test
  }
}

const isUrlOrPort = input => {
  const str = is.string(input) ? input.split('|') : [input]

  return str.every(s => {
    if (is.url(s)) {
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

module.exports = {
  getArguments,
  isUrlOrPort: isUrlOrPort,
  normalizeUrl: normalizeUrl
}
