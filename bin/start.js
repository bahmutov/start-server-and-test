#!/usr/bin/env node

const args = process.argv.slice(2)
const startAndTest = require('..')
const utils = require('../src/utils')

let start = 'start'
let test = 'test'
let url

if (args.length === 1 && utils.isUrlOrPort(args[0])) {
  // passed just single url or port number, for example
  // "start": "http://localhost:8080"
  url = utils.normalizeUrl(args[0])
} else if (args.length === 2) {
  if (utils.isUrlOrPort(args[0])) {
    // passed port and custom test command
    // like ":8080 test-ci"
    url = utils.normalizeUrl(args[0])
    test = args[1]
  }
  if (utils.isUrlOrPort(args[1])) {
    // passed start command and url/port
    // like "start-server 8080"
    start = args[0]
    url = utils.normalizeUrl(args[1])
  }
} else {
  start = args[0]
  url = utils.normalizeUrl(args[1])
  test = utils.parseExtraArgs(args)
}

test = [].concat(test)

console.log(`starting server using command "npm run ${start}"`)
console.log(`and when url "${url}" is responding`)
console.log(`running tests using command "${test.join(' ')}"`)

startAndTest({ start, url, test }).catch(e => {
  console.error(e)
  process.exit(1)
})
