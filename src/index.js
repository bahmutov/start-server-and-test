'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const execa = require('execa')
const waitOn = require('wait-on')
const Promise = require('bluebird')
const psTree = require('ps-tree')
const debug = require('debug')('start-server-and-test')

function startAndTest ({ start, url, test }) {
  la(is.unemptyString(start), 'missing start script name', start)
  la(is.unemptyString(test), 'missing test script name', test)
  la(is.unemptyString(url), 'missing url to wait on', url)

  debug('starting server')
  const server = execa('npm', ['run', start], { stdio: 'inherit' })
  let serverStopped

  function stopServer () {
    debug('getting child processes')
    if (!serverStopped) {
      serverStopped = true
      return Promise.fromNode(cb => psTree(server.pid, cb))
        .then(children => {
          debug('stopping child processes')
          children.forEach(child => {
            process.kill(child.PID)
          })
        })
        .then(() => {
          debug('stopping server')
          server.kill()
        })
    }
  }

  const waited = new Promise((resolve, reject) => {
    waitOn(
      {
        resources: [url],
        interval: 1000,
        window: 100,
        verbose: false
      },
      err => {
        if (err) {
          debug('error waiting for url', url)
          debug(err.message)
          return reject(err)
        }
        resolve()
      }
    )
  })

  function runTests () {
    debug('running test script command', test)
    return execa('npm', ['run', test], { stdio: 'inherit' })
  }

  return waited
    .tapCatch(stopServer)
    .then(runTests)
    .finally(stopServer)
}

module.exports = startAndTest
