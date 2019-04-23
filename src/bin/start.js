#!/usr/bin/env node

const args = process.argv.slice(2)
const startAndTest = require('..')
const utils = require('../utils')

const { start, test, url } = utils.getArguments(args)

console.log(`starting server using command "npm run ${start}"`)
console.log(`and when url "${url}" is responding`)
console.log(`running tests using command "npm run ${test}"`)

startAndTest({ start, url, test }).catch(e => {
  console.error(e)
  process.exit(1)
})
