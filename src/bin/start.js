#!/usr/bin/env node

const debug = require('debug')('start-server-and-test')

const args = process.argv.slice(2)
const startAndTest = require('..')
const utils = require('../utils')

debug('parsing CLI arguments: %o', args)
const parsed = utils.getArguments(args)
debug('parsed args: %o', parsed)
const { start, test, url } = parsed

console.log('starting server using command "%s"', start)
console.log('and when url "%s" is responding', url)
console.log('running tests using command "%s"', test)

startAndTest({ start, url, test }).catch(e => {
  console.error(e)
  process.exit(1)
})
