const is = require('check-more-types')

const isUrlOrPort = s => is.url(s) || is.port(parseInt(s))

const normalizeUrl = s => {
  if (is.url(s)) {
    return s
  }
  if (is.port(parseInt(s))) {
    return `http://localhost:${s}`
  }
  // for anything else, return original argument
  return s
}

module.exports = {
  isUrlOrPort: isUrlOrPort,
  normalizeUrl: normalizeUrl
}
