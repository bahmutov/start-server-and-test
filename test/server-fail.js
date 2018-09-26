const http = require('http');
const server = http.createServer((req, res) => {
  console.log(req.method)
  if (req.method === 'GET') {
    res.end('All good\n\n')
  } else {
    res.end();
  }
});
setTimeout(() => {
  process.exit(1)
}, 5000)
console.log('sleeping for 5 seconds before starting')
