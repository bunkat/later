var later = require('../../index'),
    constraint = later.constraint.h,
    should = require('should');

describe('Constraint Hour', function() {
  later.option.UTC = true;

  describe('isInvalid', function() {
    var d = new Date('2012-03-28T05:00:05Z');

    describe('forward', function() {

      it('should return false with a valid value', function() {
        constraint([5]).isInvalid(d).should.equal(false);
      });

      it('should return next valid value with an invalid value', function() {
        constraint([10]).isInvalid(d).should.eql(new Date('2012-03-28T10:00:00Z'));
      });

      it('should wrap to find next valid value with an invalid value', function() {
        constraint([2]).isInvalid(d).should.eql(new Date('2012-03-29T02:00:00Z'));
      });

    });

    describe('reverse', function() {

      it('should return false with a valid value', function() {
        constraint([5]).isInvalid(d, true).should.equal(false);
      });

      it('should return prev valid value with an invalid value', function() {
        constraint([2]).isInvalid(d, true).should.eql(new Date('2012-03-28T02:59:59Z'));
      });

      it('should wrap to find prev valid value with an invalid value', function() {
        constraint([22]).isInvalid(d, true).should.eql(new Date('2012-03-27T22:59:59Z'));
      });

    });

  });

  describe('isValid', function() {

    describe('forward', function() {
      var d = new Date('2012-08-28T22:00:55Z');

      it('should return false with an invalid value', function() {
        constraint([10,15]).isValid(d).should.equal(false);
      });

      it('should return next invalid value with an valid value', function() {
        constraint([22]).isValid(d).should.eql(new Date('2012-08-28T23:00:00Z'));
      });

      it('should wrap to find next invalid value with an valid value', function() {
        constraint([22,23]).isValid(d).should.eql(new Date('2012-08-29T00:00:00Z'));
      });
    });

    describe('reverse', function() {
      var d = new Date('2012-08-28T05:00:05Z');

      it('should return false with an invalid value', function() {
        constraint([9,10]).isValid(d, true).should.equal(false);
      });

      it('should return prev invalid value with an valid value', function() {
        constraint([4,5]).isValid(d, true).should.eql(new Date('2012-08-28T03:59:59Z'));
      });

      it('should wrap to find prev invalid value with an valid value', function() {
        constraint([0,1,2,3,4,5]).isValid(d, true).should.eql(new Date('2012-08-27T23:59:59Z'));
      });
    });

  });
});