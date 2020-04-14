#!/usr/bin/env node

const debug = require('debug')('start-server-and-test')

const args = process.argv.slice(2)
const startAndTest = require('..').startAndTest
const utils = require('../utils')

debug('parsing CLI arguments: %o', args)
const parsed = utils.getArguments(args)
debug('parsed args: %o', parsed)

const { services, test } = parsed
if (!Array.isArray(services)) {
  throw new Error(`Could not parse arguments %o, got %o`, args, parsed)
}

utils.printArguments({ services, test })

startAndTest({ services, test }).catch(e => {
  console.error(e)
  process.exit(1)
})
