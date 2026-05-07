'use strict'

/**
 * A server that starts listening immediately, then exits on its own after a short delay.
 * Used by the alreadyExited E2E test: the server is gone before stopServer() is called, which should NOT cause startAndTest to reject.
 */
const http = require('http')

const PORT = process.env.SERVER_EXITS_EARLY_PORT || 19877

const server = http.createServer((_req, res) => {
  res.end('ok')
})

server.listen(PORT, () => {
  console.log('server-exits-early listening on port %s', PORT)
  // Stay up for 4s so that waitOn (default interval 2s + window 1s) can resolve and remove the 'close' listener before we exit.
  // The test command runs for 6s, so stopServer() is called ~2s after we are already gone, exercising the alreadyExited path on every platform.
  setTimeout(() => {
    console.log('server-exits-early shutting down intentionally')
    server.close()
    process.exit(0)
  }, 4000)
})
