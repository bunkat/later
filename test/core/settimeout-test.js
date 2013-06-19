var later = require('../../index'),
    should = require('should');

describe('Set timeout', function() {

  it('should execute a callback after the specified amount of time', function(done) {
    this.timeout(0);

    var s = later.parse.recur().every(2).second();

    function test() {
      later.schedule(s).isValid(new Date()).should.eql(true);
      done();
    }

    later.setTimeout(test, s);
  });

  it('should allow clearing of the timeout', function(done) {
    this.timeout(0);

    var s = later.parse.recur().every(1).second();

    function test() {
      should.not.exist(true);
    }

    var t = later.setTimeout(test, s);
    t.clear();

    setTimeout(done, 2000);
  });


  it('should not execute a far out schedule immediately', function(done) {
    this.timeout(0);

    var s = later.parse.recur().on(2017).year();

    function test() {
      should.not.exist(true);
    }

    var t = later.setTimeout(test, s);

    setTimeout(function() { t.clear(); done(); }, 2000);
  });

});