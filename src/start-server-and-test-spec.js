'use strict'

/* eslint-env mocha */
const { startAndTest } = require('.')

describe('start-server-and-test', () => {
  it('write this test', () => {
    console.assert(startAndTest, 'should export something')
  })

  // Tests the case where the server process exits on its own before stopServer() is called.
  // On Unix tree-kill returns ESRCH; on Windows taskkill returns an error with a message indicating the process was not found.
  // This should NOT cause startAndTest to reject.
  it('resolves when the server exits before stopServer() is called', function () {
    this.timeout(20000)

    const port = 19877
    return startAndTest({
      services: [
        {
          start: 'node test/server-exits-early.js',
          url: `http://127.0.0.1:${port}`,
        },
      ],
      // Keep the test command running longer than the server lives (4s) so that stopServer() is called after the process has already exited.
      test: 'node -e "setTimeout(()=>{},6000)"',
      namedArguments: { expect: 200 },
    })
  })
})
