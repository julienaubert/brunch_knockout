/*
Copyright (c) 2012 Kelly Miyashiro
Copyright (c) 2012 "Cowboy" Ben Alman

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
*/

require.register("test/mocha-blanket", function(exports, require, module) {

    exports.Adaptor = function() {

        if(!mocha) {
            throw new Exception("mocha library does not exist in global namespace!");
        }


        /*
        * Mocha Events:
        *
        * - `start` execution started
        * - `end` execution complete
        * - `suite` (suite) test suite execution started
        * - `suite end` (suite) all tests (and sub-suites) have finished
        * - `test` (test) test execution started
        * - `test end` (test) test completed
        * - `hook` (hook) hook execution started
        * - `hook end` (hook) hook complete
        * - `pass` (test) test passed
        * - `fail` (test, err) test failed
        *
        */

        var originalReporter = mocha._reporter;

        var blanketReporter = function(runner) {
                runner.on('start', function() {
                    blanket.setupCoverage();
                });

                runner.on('end', function() {
                    blanket.onTestsDone();
                });

                runner.on('suite', function() {
                    blanket.onModuleStart();
                });

                runner.on('test', function() {
                    blanket.onTestStart();
                });

                runner.on('test end', function(test) {
                    blanket.onTestDone(test.parent.tests.length, test.state === 'passed');
                });

                //I dont know why these became global leaks
                runner.globals(['stats', 'failures', 'runner', '_$blanket']);

                originalReporter.apply(this, [runner]);
            };

        // From mocha.js HTML reporter
        blanketReporter.prototype.suiteURL = function(suite){
          return '?grep=' + encodeURIComponent(suite.fullTitle());
        };

        blanketReporter.prototype.testURL = function(test){
          return '?grep=' + encodeURIComponent(test.fullTitle());
        };

        mocha.reporter(blanketReporter);
        var oldRun = mocha.run,
            oldCallback = null;

        mocha.run = function (finishCallback) {
          oldCallback = finishCallback;
          console.log("waiting for blanket...");
        };
        blanket.beforeStartTestRunner({
            callback: function(){
                if (!blanket.options("existingRequireJS")){
                    oldRun(oldCallback);
                }
                mocha.run = oldRun;
            }
        });

    };


});
