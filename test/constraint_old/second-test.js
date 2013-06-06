var later = require('../../index'),
    constraint = later.constraint.s,
    should = require('should');

describe('Constraint Second', function() {
  later.option.UTC = true;

  describe('isInvalid', function() {
    var d = new Date('2012-03-28T00:00:05Z');

    describe('forward', function() {

      it('should return false with a valid value', function() {
        constraint([5]).isInvalid(d).should.equal(false);
      });

      it('should return next valid value with an invalid value', function() {
        constraint([10]).isInvalid(d).should.eql(new Date('2012-03-28T00:00:10Z'));
      });

      it('should wrap to find next valid value with an invalid value', function() {
        constraint([2]).isInvalid(d).should.eql(new Date('2012-03-28T00:01:02Z'));
      });

    });

    describe('reverse', function() {

      it('should return false with a valid value', function() {
        constraint([5]).isInvalid(d, true).should.equal(false);
      });

      it('should return prev valid value with an invalid value', function() {
        constraint([2]).isInvalid(d, true).should.eql(new Date('2012-03-28T00:00:02Z'));
      });

      it('should wrap to find prev valid value with an invalid value', function() {
        constraint([55]).isInvalid(d, true).should.eql(new Date('2012-03-27T23:59:55Z'));
      });

    });

  });

  describe('isValid', function() {

    describe('forward', function() {
      var d = new Date('2012-08-28T00:00:55Z');

      it('should return false with an invalid value', function() {
        constraint([10,15]).isValid(d).should.equal(false);
      });

      it('should return next invalid value with an valid value', function() {
        constraint([55,59]).isValid(d).should.eql(new Date('2012-08-28T00:00:56Z'));
      });

      it('should wrap to find next invalid value with an valid value', function() {
        constraint([55,56,57,58,59]).isValid(d).should.eql(new Date('2012-08-28T00:01:00Z'));
      });
    });

    describe('reverse', function() {
      var d = new Date('2012-08-28T00:00:05Z');

      it('should return false with an invalid value', function() {
        constraint([9,10]).isValid(d, true).should.equal(false);
      });

      it('should return prev invalid value with an valid value', function() {
        constraint([4,5]).isValid(d, true).should.eql(new Date('2012-08-28T00:00:03Z'));
      });

      it('should wrap to find prev invalid value with an valid value', function() {
        constraint([0,1,2,3,4,5]).isValid(d, true).should.eql(new Date('2012-08-27T23:59:59Z'));
      });
    });

  });
});