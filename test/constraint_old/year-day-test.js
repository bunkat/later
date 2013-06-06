var later = require('../../index'),
    constraint = later.constraint.dy,
    should = require('should');

describe('Constraint Day of Year', function() {
  later.option.UTC = true;

  describe('value', function() {

    function compare(d, expected) {
      it('should be correct for ' + d, function() {
        constraint([]).value(d).should.equal(expected);
      });
    }

    // exhaustive test of all days between 2008 and 2012
    for(var i = 0; i < 2; i++) { // years to check
      for(var j = 1; j < 367; j++) { // days to check
        var d = new Date(Date.UTC(2012+i, 0, j));
        var expected = d.getUTCFullYear()-2012 === i ? j : d.getUTCDate();
        compare(d, expected);
      }
    }

  });

  describe('isInvalid', function() {
    var d = new Date('2013-03-28T00:00:05Z');

    describe('forward', function() {

      it('should return false with a valid value', function() {
        constraint([87]).isInvalid(d).should.equal(false);
      });

      it('should return next valid value with an invalid value', function() {
        constraint([89]).isInvalid(d).should.eql(new Date('2013-03-30T00:00:00Z'));
      });

      it('should wrap to find next valid value with an invalid value', function() {
        constraint([28]).isInvalid(d).should.eql(new Date('2014-01-28T00:00:00Z'));
      });

    });

    describe('reverse', function() {

      it('should return false with a valid value', function() {
        constraint([87]).isInvalid(d, true).should.equal(false);
      });

      it('should return prev valid value with an invalid value', function() {
        constraint([28]).isInvalid(d, true).should.eql(new Date('2013-01-28T23:59:59Z'));
      });

      it('should wrap to find prev valid value with an invalid value', function() {
        constraint([302]).isInvalid(d, true).should.eql(new Date('2012-10-28T23:59:59Z'));
      });

    });

  });

  describe('isValid', function() {

    describe('forward', function() {
      var d = new Date('2013-03-28T00:00:05Z');

      it('should return false with an invalid value', function() {
        constraint([50]).isValid(d).should.equal(false);
      });

      it('should return next invalid value with an valid value', function() {
        constraint([87,88]).isValid(d).should.eql(new Date('2013-03-30T00:00:00Z'));
      });

    });

    describe('reverse', function() {
      var d = new Date('2013-03-28T00:00:05Z');

      it('should return false with an invalid value', function() {
        constraint([9,10]).isValid(d, true).should.equal(false);
      });

      it('should return prev invalid value with an valid value', function() {
        constraint([86,87]).isValid(d, true).should.eql(new Date('2013-03-26T23:59:59Z'));
      });

    });

  });
});