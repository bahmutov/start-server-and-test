'use strict'

/* eslint-env mocha */
const startServerAndTest = require('.')
const la = require('lazy-ass')

describe('start-server-and-test', () => {
  it('write this test', () => {
    console.assert(startServerAndTest, 'should export something')
  })
})

describe('utils', () => {
  const utils = require('./utils')

  context('isUrlOrPort', () => {
    const isUrlOrPort = utils.isUrlOrPort

    it('allows url', () => {
      la(isUrlOrPort('http://localhost'))
      la(isUrlOrPort('http://foo.com'))
      la(isUrlOrPort('http://foo.com/bar/baz.html'))
      la(isUrlOrPort('http://localhost:6000'))
    })

    it('allows port number or string', () => {
      la(isUrlOrPort('6006'))
      la(isUrlOrPort(8080))
    })
  })

  context('normalizeUrl', () => {
    const normalizeUrl = utils.normalizeUrl

    it('passes url', () => {
      la(normalizeUrl('http://localhost') === 'http://localhost')
      la(normalizeUrl('http://localhost:6000') === 'http://localhost:6000')
    })

    it('changes port to localhost', () => {
      la(normalizeUrl('6006') === 'http://localhost:6006')
      la(normalizeUrl(8080) === 'http://localhost:8080')
    })

    it('returns original argument if does not know what to do', () => {
      la(normalizeUrl('foo') === 'foo')
      la(normalizeUrl(808000) === 808000)
    })
  })
})
