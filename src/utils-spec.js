'use strict'

/* eslint-env mocha */
const la = require('lazy-ass')
const snapshot = require('snap-shot-it')
const debug = require('debug')('test')

function arrayEq (a, b) {
  return a.length === b.length && a.every((el, index) => el === b[index])
}

describe('utils', () => {
  const utils = require('./utils')

  context('isPackageScriptName', () => {
    const isPackageScriptName = utils.isPackageScriptName

    it('returns true for script names', () => {
      la(isPackageScriptName('start'))
      la(isPackageScriptName('test'))
      la(isPackageScriptName('unit'))
    })

    it('returns false for non scripts', () => {
      la(!isPackageScriptName('does-not-exist'))
    })
  })

  context('crossArguments', () => {
    const crossArguments = utils.crossArguments
    ;['"', "'", '`'].forEach(char => {
      it(`concates arguments if wrapped by ${char}`, () => {
        snapshot(
          crossArguments([
            'start',
            '8080',
            `${char}test`,
            'argument',
            `--option${char}`
          ])
        )
      })
      it(`ignores end char (${char}) if not at the end of an argument`, () => {
        snapshot(
          crossArguments([
            'start',
            '8080',
            `${char}test`,
            `argu${char}ment`,
            `--option${char}`
          ])
        )
      })
    })
    it(`ignores end chars that are != the startChar of an argument`, () => {
      snapshot(
        crossArguments(['start', '8080', `"test`, `argument'`, `--option"`])
      )
    })
  })

  context('getArguments', () => {
    const getArguments = utils.getArguments

    it('allows 5 arguments', () => {
      const args = ['start', '6000', 'start:web', '6010', 'test']
      const parsed = getArguments(args)
      debug('from %o', args)
      debug('parsed %o', parsed)
      debug('services %o', parsed.services)
      snapshot({ args, parsed })
    })

    it('determines NPM script for each command', () => {
      sandbox.stub(utils, 'isPackageScriptName').returns(true)
      const args = ['startA', '6000', 'startB', '6010', 'testC']
      const parsed = getArguments(args)
      debug('from %o', args)
      debug('parsed %o', parsed)
      debug('services %o', parsed.services)
      snapshot({ args, parsed })
    })

    it('returns 3 arguments', () => {
      const args = ['start', '8080', 'test']
      const parsed = getArguments(args)
      snapshot({ args, parsed })
    })

    it('returns 3 arguments with url', () => {
      snapshot(getArguments(['start', 'http://localhost:8080', 'test']))
    })

    it('handles 3 arguments with http-get url', () => {
      snapshot(getArguments(['start', 'http-get://localhost:8080', 'test']))
    })

    it('understands url plus test', () => {
      snapshot(getArguments(['6000', 'test']))
    })

    it('understands start plus url', () => {
      // note that this script "start-server" does not exist
      // thus it is left as is - without "npm run" part
      snapshot(getArguments(['start-server', '6000']))
    })

    it('understands single :port', () => {
      snapshot(getArguments([':3000']))
    })

    it('understands single port', () => {
      snapshot(getArguments(['3000']))
    })

    it('understands several ports', () => {
      snapshot(getArguments(['3000|4000|5000']))
    })

    it('asks if command is a script name', () => {
      const args = ['custom-command-name', '3000', 'some-test-command']
      const isPackageScriptName = sandbox
        .stub(utils, 'isPackageScriptName')
        .returns(false)
      const parsed = getArguments(args)
      debug('from %o', args)
      debug('parsed %o', parsed)
      /* eslint-disable-next-line no-unused-expressions */
      expect(isPackageScriptName).to.have.been.calledTwice
      expect(isPackageScriptName).to.have.been.calledWith('custom-command-name')
      expect(isPackageScriptName).to.have.been.calledWith('some-test-command')
    })

    it('understands custom commands', () => {
      // these commands are NOT script names in the package.json
      // thus they will be run as is
      snapshot(
        getArguments([
          'custom-command --with argument',
          '3000',
          'test-command --x=1'
        ])
      )
    })
  })

  context('isUrlOrPort', () => {
    const isUrlOrPort = utils.isUrlOrPort

    it('allows url', () => {
      la(isUrlOrPort('http://localhost'))
      la(isUrlOrPort('http://foo.com'))
      la(isUrlOrPort('http://foo.com/bar/baz.html'))
      la(isUrlOrPort('http://localhost:6000'))
      la(isUrlOrPort('https://google.com'))
    })

    it('allows url with http-get', () => {
      la(isUrlOrPort('http-get://localhost'))
      la(isUrlOrPort('http-get://foo.com'))
      la(isUrlOrPort('http-get://foo.com/bar/baz.html'))
      la(isUrlOrPort('http-get://localhost:6000'))
    })

    it('allows url with https-head', () => {
      la(isUrlOrPort('https-head://localhost:6000'))
    })

    it('allows url with https-options', () => {
      la(isUrlOrPort('https-head://foo'))
    })

    it('allows port number or string', () => {
      la(isUrlOrPort('6006'))
      la(isUrlOrPort(8080))
    })

    it('allows :port string', () => {
      la(isUrlOrPort(':6006'))
    })

    it('allows multiple resources', () => {
      la(isUrlOrPort('http://localhost|http://foo.com'))
    })

    it('detects invalid resource when using multiple', () => {
      la(!isUrlOrPort('http://localhost|http://foo.com|_+9'))
    })
  })

  context('normalizeUrl', () => {
    const normalizeUrl = utils.normalizeUrl

    it('passes url', () => {
      la(arrayEq(normalizeUrl('http://localhost'), ['http://localhost']))
      la(
        arrayEq(normalizeUrl('http://localhost:6000'), [
          'http://localhost:6000'
        ])
      )
    })

    it('changes port to localhost', () => {
      la(arrayEq(normalizeUrl('6006'), ['http://localhost:6006']))
      la(arrayEq(normalizeUrl(8080), ['http://localhost:8080']))
    })

    it('changes :port to localhost', () => {
      la(arrayEq(normalizeUrl(':6006'), ['http://localhost:6006']))
    })

    it('returns original argument if does not know what to do', () => {
      la(arrayEq(normalizeUrl('foo'), ['foo']), normalizeUrl('foo'))
      la(arrayEq(normalizeUrl(808000), [808000]), normalizeUrl(808000))
    })

    it('parses multiple resources', () => {
      la(
        arrayEq(normalizeUrl(':6006|http://foo.com'), [
          'http://localhost:6006',
          'http://foo.com'
        ])
      )
    })
  })
})
