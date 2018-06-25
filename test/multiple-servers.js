const http = require('http');
const server = http.createServer((req, res) => {
  console.log(req.method)
  if (req.method === 'GET') {
    res.end('Server 1 is good!\n\n')
  } else {
    res.end();
  }
});
setTimeout(() => {
  server.listen(9000)
  console.log('listening at port 9000')
}, 1000)

const server2 = http.createServer((req, res) => {
  console.log(req.method)
  if (req.method === 'GET') {
    res.end('Server 2 is good!\n\n')
  } else {
    res.end();
  }
});
setTimeout(() => {
  server2.listen(9001)
  console.log('listening at port 9001')
}, 5000)

console.log('sleeping for 5 seconds before starting')
