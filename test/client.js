// little test client to ping server at a given port
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    port: 'p'
  }
})
const port = argv.port || 9000
const got = require('got')
const url = `http://localhost:${port}`
got(url)
  .then(() => {
    console.log('url %s has responded 👍', url)
  })
  .catch(e => {
    console.error(e.message)
    process.exit(1)
  })
