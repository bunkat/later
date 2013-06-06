var later = require('../../index'),
    compile = later.compile,
    should = require('should');

describe('Compile', function() {
  later.option.UTC = true;

  describe('getValid', function() {
    var d = new Date('2013-03-21T00:00:05Z');

    describe('forward', function() {

      it('should return start date if start is valid', function() {
        compile({Y:[2013]}).getValid(d).should.eql(d);
      });

      it('should return next valid occurrence if invalid', function() {
        compile({Y:[2014]}).getValid(d).should.eql(new Date('2014-01-01T00:00:00Z'));
      });

    });

    describe('reverse', function() {

      it('should return start date if start is valid', function() {
        compile({Y:[2013]}).getValid(d, true).should.eql(d);
      });

      it('should return previous valid occurrence if invalid', function() {
        compile({Y:[2012]}).getValid(d, true).should.eql(new Date('2012-12-31T23:59:59Z'));
      });

    });

  });

  describe('getInvalid', function() {
    var d = new Date('2013-03-21T00:00:05Z');

    describe('forward', function() {

      it('should return start date if start is invalid', function() {
        compile({Y:[2014]}).getInvalid(d).should.eql(d);
      });

      it('should return next invalid occurrence if valid', function() {
        compile({Y:[2013,2014]}).getInvalid(d).should.eql(new Date('2015-01-01T00:00:00Z'));
      });

    });

    describe('reverse', function() {

      it('should return start date if start is valid', function() {
        compile({Y:[2014]}).getInvalid(d, true).should.eql(d);
      });

      it('should return previous invalid occurrence if valid', function() {
        compile({Y:[2012,2013]}).getInvalid(d, true).should.eql(new Date('2011-12-31T23:59:59Z'));
      });

    });

  });
});