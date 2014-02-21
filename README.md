# Knockout skeleton [Brunch](http://brunch.io/)

Uses latest brunch (1.7.13) with bower to manage packages (no "vendor" folder).

JavaScript based skeleton:
- Knockout.js
- Font-awesome
- html5-boilerplate [cherry-picked from 4.3.0]
- Autoreload

Testing: (headless browser, code-coverage)
- mocha-phantomjs
- mocha, chai, sinon
- blanket.js

## Installation

- Install [node](http://nodejs.org/).
- Install Brunch: `npm install -g brunch`.
- Install mocha-phantomjs (to run tests): `npm install -g mocha-phantomjs`.
- Run `brunch new https://github.com/julienaubert/brunch_knockout <app name>`.
- cd into your new app folder.
- verify can run tests: `npm test` (2 example tests should run and pass).
- verify can run brunch server: `brunch w -s` and `open http://localhost:3333/` you should see a [thumb-up](http://fortawesome.github.io/Font-Awesome/icon/thumbs-up/) icon, and a [knockout example](http://knockoutjs.com/examples/helloWorld.html).
- verify can run tests in browser: `brunch build` and `python -m http.server &` (or `python -m SimpleHTTPServer &`) and `open http://localhost:8000/test/index.html` **unfortunately, the code-coverage is not correct (todo)**

## Running
- Note, must copy font-awesome/fonts yourself ([issue-633](https://github.com/brunch/brunch/issues/633)), run `./bower_assets.sh` to symlink them into public
- To build your project run `brunch build`.
- To continually watch your project folder changes and auto-compile, use `brunch w`.
- To see it in browser (start a simple server), run `brunch w -s`, run `./bower_assets.sh` ([issue-633](https://github.com/brunch/brunch/issues/633))

## Testing model-views

Put tests in test/tests/<name>_test.js and run: `npm test;` (or if want to see in browser `open test/index.html`).

`npm test` will issue brunch build and then run mocha-phantomjs (see scripts in package.json).

To make life simple (not manually include each new test files in the test runner), brunch is used to gather *_tests.js
into test/build/all_tests.js

Instead of building all each time you run tests, you can do:

- `brunch w &` (will build once, then watch for changes)
- `mocha-phantomjs test/index.html` (will run the tests)

To see in browser: must serve up the test directory, e.g. (as blanket.js reads files):
- `cd test`
- `python -m http.server` (or if use python 2.x: `python -m SimpleHTTPServer`)

## Functional tests

Not in place (should be phantomjs/selenium)

## Todo

Issues:
- Tests: code-coverage with blanket does not work (coverage% is incorrect, not sure why?), I cannot get the mocha-adaptor.js from the blanket-package to work. used instead:
https://github.com/ModelN/grunt-blanket-mocha/blob/master/support/mocha-blanket.js)

Nice-if:
- Font-awesome fonts: nice if this was not symlinked. [issue-633](https://github.com/brunch/brunch/issues/633)
- Tests: nice if was possible run specific tests (where is e.g., mocha grep in mocha-phantomjs?)
- Tests: nice if not have to serve up the test dir for blanket.js (could e.g. have Makefile and open chrome with --arg --allow-access-from-files)

