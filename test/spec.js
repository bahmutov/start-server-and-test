/* eslint-env mocha */
const la = require('lazy-ass')
const execaWrap = require('execa-wrap')
const path = require('path')

describe('test-node-env', () => {
  // for https://github.com/bahmutov/start-server-and-test/issues/184
  it('passes NODE_ENV to the server process', () => {
    const cwd = path.join(__dirname, 'test-node-env')
    return execaWrap('npm', ['run', 'demo'], {
      env: {
        NODE_ENV: 'test'
      },
      cwd,
      filter: ['stdout']
    }).then(result => {
      la(
        result.includes('server has NODE_ENV=test'),
        'result does not pass the right NODE_ENV to the server process',
        result
      )
    })
  })
})
