// little test client to ping server at a given port
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
const url = `http://localhost:${port}`

fetch(url, { signal: AbortSignal.timeout(10_000) })
  .then((res) => {
    if (!res.ok) {
      console.error(
        'url %s responded with status %d',
        url,
        res.status,
      )
      process.exit(1)
    }
    console.log('url %s has responded 👍', url)
    process.exit(0)
  })
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
