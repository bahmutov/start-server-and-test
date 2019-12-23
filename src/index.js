'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const execa = require('execa')
const got = require('got')
const waitOn = require('wait-on')
const Promise = require('bluebird')
const psTree = require('ps-tree')
const debug = require('debug')('start-server-and-test')

/**
 * A small utility for checking when an URL responds, kind of
 * a poor man's https://www.npmjs.com/package/wait-on
 *
 * @param {number} timeout - Timeout in milliseconds
 */
const ping = (url, timeout) => {
  const start = +new Date()
  return got(url, {
    retry: {
      calculateDelay ({ attemptCount, retryOptions, error }) {
        const now = +new Date()
        const elapsed = now - start
        console.error('%d %dms', attemptCount, elapsed, error.message)
        if (elapsed > timeout) {
          console.error('%s timed out', url)
          return 0
        }
        return 1000
      }
    }
  })
}

/**
 * Used for timeout (ms)
 */
const fiveMinutes = 5 * 60 * 1000
const waitOnTimeout = process.env.WAIT_ON_TIMEOUT
  ? Number(process.env.WAIT_ON_TIMEOUT)
  : fiveMinutes

const isDebug = () =>
  process.env.DEBUG && process.env.DEBUG.indexOf('start-server-and-test') !== -1

const isInsecure = () => process.env.START_SERVER_AND_TEST_INSECURE

function startAndTest ({ start, url, test }) {
  la(is.unemptyString(start), 'missing start script name', start)
  la(is.unemptyString(test), 'missing test script name', test)
  la(
    is.unemptyString(url) || is.unemptyArray(url),
    'missing url to wait on',
    url
  )

  debug('starting server with command "%s", verbose mode?', start, isDebug())

  const server = execa(start, { shell: true, stdio: 'inherit' })
  let serverStopped

  function stopServer () {
    debug('getting child processes')
    if (!serverStopped) {
      serverStopped = true
      return Promise.fromNode(cb => psTree(server.pid, cb))
        .then(children => {
          debug('stopping child processes')
          children.forEach(child => {
            try {
              process.kill(child.PID, 'SIGINT')
            } catch (e) {
              if (e.code === 'ESRCH') {
                console.log(
                  `Child process ${child.PID} exited before trying to stop it`
                )
              } else {
                throw e
              }
            }
          })
        })
        .then(() => {
          debug('stopping server')
          server.kill()
        })
    }
  }

  let waited

  const isSinglePingUrl = url =>
    typeof url === 'string' && url.startsWith('ping-')

  const isSingleArrayPingUrl = url =>
    Array.isArray(url) && url.length === 1 && isSinglePingUrl(url[0])

  if (isSingleArrayPingUrl(url)) {
    debug('using own ping', url[0])
    const pingUrl = url[0].replace(/^ping-/, '')
    debug('pinging url "%s"', pingUrl)
    waited = new Promise((resolve, reject) => {
      const onClose = () => {
        reject(new Error('server closed unexpectedly'))
      }

      server.on('close', onClose)

      ping(pingUrl, waitOnTimeout).then(() => {
        server.removeListener('close', onClose)
        resolve()
      })
    })
  } else {
    debug('using wait-on')

    waited = new Promise((resolve, reject) => {
      const onClose = () => {
        reject(new Error('server closed unexpectedly'))
      }

      server.on('close', onClose)

      debug('starting waitOn %s', url)
      const options = {
        resources: Array.isArray(url) ? url : [url],
        interval: 2000,
        window: 1000,
        timeout: waitOnTimeout,
        verbose: isDebug(),
        strictSSL: !isInsecure(),
        log: isDebug()
      }
      debug('wait-on options %o', options)

      waitOn(options, err => {
        if (err) {
          debug('error waiting for url', url)
          debug(err.message)
          return reject(err)
        }
        debug('waitOn finished successfully')
        server.removeListener('close', onClose)
        resolve()
      })
    })
  }

  function runTests () {
    debug('running test script command: %s', test)
    return execa(test, { shell: true, stdio: 'inherit' })
  }

  return waited
    .tapCatch(stopServer)
    .then(runTests)
    .finally(stopServer)
}

module.exports = startAndTest
