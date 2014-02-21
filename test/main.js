require.register("test/main", function(exports, require, module) {

    mocha.ui('bdd');
    expect = chai.expect;
    assert = chai.assert;


    // require test-modules (i.e., the files in test/tests)
    window.require.list()
          .filter(function(name) {return /-test$.test(name)/;})
          .forEach(require);

    mocha.reporter('html');


    $(function() {
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        } else {
            mocha_blanket = require('test/mocha-blanket');
            mocha_blanket.Adaptor();
            mocha.run();
        }
    });

});
