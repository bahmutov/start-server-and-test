#!/usr/bin/env node

const args = process.argv.slice(2)
const startAndTest = require('..')
const utils = require('../utils')

const { start, test, url } = utils.getArguments(args)

console.log('starting server using command "%s"', start)
console.log('and when url "%s" is responding', url)
console.log('running tests using command "%s"', test)

startAndTest({ start, url, test }).catch(e => {
  console.error(e)
  process.exit(1)
})
