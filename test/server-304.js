const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    port: 'p'
  }
})
const http = require('http')
const server = http.createServer((req, res) => {
  console.log(req.method)
  if (req.method === 'GET') {
    res.writeHead(304).end('All good\n\n')
  } else {
    res.end()
  }
})
const port = argv.port || 9000
setTimeout(() => {
  server.listen(port)
  console.log('listening at port %d', port)
}, 5000)
console.log('sleeping for 5 seconds before starting')
