#!/usr/bin/env node

const args = process.argv.slice(2)
const la = require('lazy-ass')
const is = require('check-more-types')
const startAndTest = require('..')

let start = 'start'
let test = 'test'
let url

if (args.length === 1 && is.url(args[0])) {
  // passed just single url for example
  // "start": "http://localhost:8080"
  url = args[0]
} else {
  la(args.length === 3, 'expect: <start script name> <url> <test script name>')
  start = args[0]
  url = args[1]
  test = args[2]
}

console.log(`starting server using command "npm run ${start}"`)
console.log(`and when url "${url}" is responding`)
console.log(`running tests using command "${test}"`)

startAndTest({ start, url, test }).catch(e => {
  console.error(e)
  process.exit(1)
})
