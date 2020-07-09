# start-server-and-test

> Starts server, waits for URL, then runs test command; when the tests end, shuts down server

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]
[![renovate-app badge][renovate-badge]][renovate-app]

## Install

Requires [Node](https://nodejs.org/en/) version 8.9 or above.

```sh
npm install --save-dev start-server-and-test
```

## Use

This command is meant to be used with NPM script commands. If you have a "start server", and "test" script names for example, you can start the server, wait for a url to respond, then run tests. When the test process exits, the server is shut down.

```json
{
    "scripts": {
        "start-server": "npm start",
        "test": "mocha e2e-spec.js",
        "ci": "start-server-and-test start-server http://localhost:8080 test"
    }
}
```

To execute all tests simply run `npm run ci`.

### Commands

In addition to using NPM script names, you can pass entire commands (surround them with quotes so it is still a single string) that will be executed "as is". For example, to start globally installed `http-server` before running and recording [Cypress.io](https://www.cypress.io) tests you can use

```shell
# run http-server, then when port 8000 responds run Cypress tests
start-server-and-test 'http-server -c-1 --silent' 8000 './node_modules/.bin/cypress run --record'
```

Because `npm` scripts execute with `./node_modules/.bin` in the `$PATH`, you can mix global and locally installed tools when using commands inside `package.json` file. For example, if you want to run a single spec file:

```json
{
  "scripts": {
    "ci": "start-server-and-test 'http-server -c-1 --silent' 8080 'cypress run --spec cypress/integration/location.spec.js'"
  }
}
```

Or you can move `http-server` part into its own `start` script, which is used by default and have the equivalent JSON

```json
{
  "scripts": {
    "start": "http-server -c-1 --silent",
    "ci": "start-server-and-test 8080 'cypress run --spec cypress/integration/location.spec.js'"
  }
}
```

Here is another example that uses Mocha

```json
{
  "scripts": {
    "ci": "start-server-and-test 'http-server -c-1 --silent' 8080 'mocha e2e-spec.js'"
  }
}
```

### Alias

You can use either `start-server-and-test`, `server-test` or `start-test` commands in your scripts.

You can use `:` in front of port number like `server-test :8080`, so all these are equivalent

```
start-server-and-test start http://localhost:8080 test
server-test start http://localhost:8080 test
server-test http://localhost:8080 test
start-test :8080 test
start-test 8080 test
start-test 8080
```

### Options

If you use convention and name your scripts "start" and "test" you can simply provide URL

```json
{
    "scripts": {
        "start": "npm start",
        "test": "mocha e2e-spec.js",
        "ci": "start-server-and-test http://localhost:8080"
    }
}
```

You can also shorten local url to just port, the code below is equivalent to checking `http://localhost:8080`.

```json
{
    "scripts": {
        "start": "npm start",
        "test": "mocha e2e-spec.js",
        "ci": "server-test 8080"
    }
}
```

You can provide first start command, port (or url) and implicit `test` command

```json
{
    "scripts": {
        "start-it": "npm start",
        "test": "mocha e2e-spec.js",
        "ci": "server-test start-it 8080"
    }
}
```

You can provide port number and custom test command, in that case `npm start` is assumed to start the server.

```json
{
    "scripts": {
        "start": "npm start",
        "test-it": "mocha e2e-spec.js",
        "ci": "server-test :9000 test-it"
    }
}
```

You can provide multiple resources to wait on, separated by a pipe `|`. _(be sure to wrap in quotes)_

```json
{
  "scripts": {
    "start": "npm start",
    "test-it": "mocha e2e-spec.js",
    "ci": "server-test \"8080|http://foo.com\""
  }
}
```

or for multiple ports simply: `server-test '8000|9000' test`.

## `npx` and `yarn`

If you have [npx](https://www.npmjs.com/package/npx) available, you can execute locally installed tools from the shell. For example, if the `package.json` has the following local tools:

```json
{
  "devDependencies": {
    "cypress": "3.2.0",
    "http-server": "0.11.1",
    "start-server-and-test": "1.9.0"
  }
}
```

Then you can execute tests simply:

```text
$ npx start-test 'http-server -c-1 .' 8080 'cypress run'
starting server using command "http-server -c-1 ."
and when url "http://localhost:8080" is responding
running tests using command "cypress run"
Starting up http-server, serving .
...
```

Similarly, you can use [yarn](https://yarnpkg.com/en/) to call locally installed tools

```text
$ yarn start-test 'http-server -c-1 .' 8080 'cypress run'
yarn run v1.13.0
$ /private/tmp/test-t/node_modules/.bin/start-test 'http-server -c-1 .' 8080 'cypress run'
starting server using command "http-server -c-1 ."
and when url "http://localhost:8080" is responding
running tests using command "cypress run"
Starting up http-server, serving .
...
```

## Note for yarn users

By default, npm is used to run scripts, however you can specify that yarn is used as follows:

```json
"scripts": {
    "start-server": "yarn start",
    "test": "mocha e2e-spec.js",
    "ci": "start-server-and-test 'yarn start-server' http://localhost:8080 'yarn test'"
}
```

## Note for webpack-dev-server users

If you are using [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) (directly or via `angular/cli` or other boilerplates) then please use the following URL form to check

```
start-server-and-test http-get://localhost:8080
```

This is because under the hood this module uses [wait-on](https://github.com/jeffbski/wait-on) to ping the server. Wait-on uses `HEAD` by default, but `webpack-dev-server` does not respond to `HEAD` only to `GET` requests. Thus you need to use `http-get://` URL format to force `wait-on` to use `GET` probe.

You can even wait on the bundle JavaScript url instead of the page url, see discussion in this [issue #4](https://github.com/bahmutov/start-server-and-test/issues/4)

### Debugging

To see diagnostic messages, run with environment variable `DEBUG=start-server-and-test`

### Disable HTTPS certificate checks

To see disable HTTPS checks for `wait-on`, run with environment variable `START_SERVER_AND_TEST_INSECURE=1`.

### Timeout

This utility will wait for maximum of 5 minutes while checking for the server to respond (default). Setting an environment variable `WAIT_ON_TIMEOUT=600000` (milliseconds) sets the timeout for example to 10 minutes.

### Starting two servers

Sometimes you need to start one API server and one webserver in order to test the application. Use the syntax:

```
start-test <first command> <first resource> <second command> <second resource> <test command>
```

For example if API runs at port 3000 and server runs at port 8080:

```json
{
  "scripts": {
    "test": "node src/test",
    "start:api": "node src/api",
    "start:server": "node src/server",
    "test:all": "start-test start:api 3000 start:server 8080 test"
  }
}
```

In the above example you would run `npm run test:all` to start the API first, then when it responds, start the server, and when the server is responding, it would run the tests. After the tests finish, it will shut down both servers. See the repo [start-two-servers-example](https://github.com/bahmutov/start-two-servers-example) for full example

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/start-server-and-test/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/start-server-and-test.svg?downloads=true
[npm-url]: https://npmjs.org/package/start-server-and-test
[ci-image]: https://github.com/bahmutov/start-server-and-test/workflows/ci/badge.svg?branch=master
[ci-url]: https://github.com/bahmutov/start-server-and-test/actions
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
