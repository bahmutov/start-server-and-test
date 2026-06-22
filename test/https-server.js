const fs = require('node:fs')
const https = require('node:https')
const path = require('node:path')

const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'testkey.txt')),
  cert: fs.readFileSync(path.resolve(__dirname, 'test.cert')),
}

const server = https.createServer(options, (req, res) => {
  res.end('HTTPS is good!\n\n')
})

server.listen(9000)
