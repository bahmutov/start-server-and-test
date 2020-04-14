const sinon = require('sinon')
before(() => {
  global.sandbox = sinon.createSandbox()
})
beforeEach(() => {
  global.sandbox.restore()
})
