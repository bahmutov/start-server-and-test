const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    port: 'p'
  }
})
const http = require('http')
const server = http.createServer((req, res) => {
  if (req.method === 'GET' || req.method === 'HEAD') {
    console.log('%s returning 403', req.method)
    res.writeHead(403).end('Unauthorized\n\n')
  } else {
    res.end()
  }
})
const port = argv.port || 9000
setTimeout(() => {
  server.listen(port)
  console.log('listening at port %d, responding with 403', port)
}, 5000)
console.log('sleeping for 5 seconds before starting')
