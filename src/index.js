'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

function startAndTest ({ start, url, test }) {
  la(is.unemptyString(start), 'missing start script name', start)
  la(is.unemptyString(test), 'missing test script name', test)
  la(is.url(url), 'missing url to wait on', url)
  return Promise.resolve()
}

module.exports = startAndTest
