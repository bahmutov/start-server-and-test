const https = require('https');

var fs = require('fs');
var path = require('path');

var options = {
  key: fs.readFileSync(path.resolve(__dirname, 'testkey.txt')),
  cert: fs.readFileSync(path.resolve(__dirname, 'test.cert')),
};

const server = https.createServer(options, (req, res) => res.end('HTTPS is good!\n\n'));

server.listen(9000);
