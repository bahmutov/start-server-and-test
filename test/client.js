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
  .get(url, () => {
    console.log('url %s has responded 👍', url)
  })
  .on('error', e => {
    console.error(e.message)
    process.exit(1)
  })
