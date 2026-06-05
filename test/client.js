// little test client to ping server at a given port
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    port: 'p'
  }
})
const port = argv.port || 9000
const http = require('node:http')
const url = `http://localhost:${port}`
http
  .get(url, { timeout: 10_000 }, (res) => {
    res.resume()

    if (res.statusCode < 200 || res.statusCode >= 300) {
      console.error(
        'url %s responded with status %d',
        url,
        res.statusCode,
      )
      process.exit(1)
    }

    console.log('url %s has responded 👍', url)
  })
  .on('timeout', function () {
    this.destroy(new Error(`timed out waiting for ${url}`))
  })
  .on('error', e => {
    console.error(e.message)
    process.exit(1)
  })
