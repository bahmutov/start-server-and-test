const http = require('node:http')
const { parseArgs } = require('node:util')

const { values } = parseArgs({
  options: {
    port: {
      type: 'string',
      short: 'p',
    },
  },
})
const port = Number(values.port) || 9000

const server = http.createServer((req, res) => {
  console.log(req.method)
  if (req.method === 'GET') {
    res.end('All good\n\n')
  } else {
    res.end()
  }
})

setTimeout(() => {
  server.listen(port)
  console.log('listening at port %d', port)
}, 5000)

console.log('sleeping for 5 seconds before starting')
