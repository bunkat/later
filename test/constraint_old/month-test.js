var later = require('../../index'),
    constraint = later.constraint.M,
    should = require('should');

describe('Constraint Month', function() {
  later.option.UTC = true;

  describe('isInvalid', function() {
    var d = new Date('2012-03-28T00:00:05Z');

    describe('forward', function() {

      it('should return false with a valid value', function() {
        constraint([3]).isInvalid(d).should.equal(false);
      });

      it('should return next valid value with an invalid value', function() {
        constraint([4, 6]).isInvalid(d).should.eql(new Date('2012-04-01T00:00:00Z'));
      });

      it('should wrap to find next valid value with an invalid value', function() {
        constraint([1, 2]).isInvalid(d).should.eql(new Date('2013-01-01T00:00:00Z'));
      });

    });

    describe('reverse', function() {

      it('should return false with a valid value', function() {
        constraint([3]).isInvalid(d, true).should.equal(false);
      });

      it('should return prev valid value with an invalid value', function() {
        constraint([2]).isInvalid(d, true).should.eql(new Date('2012-02-29T23:59:59Z'));
      });

      it('should wrap to find prev valid value with an invalid value', function() {
        constraint([7, 8]).isInvalid(d, true).should.eql(new Date('2011-08-31T23:59:59Z'));
      });

    });

  });

  describe('isValid', function() {
    var d = new Date('2012-08-28T00:00:05Z');

    describe('forward', function() {

      it('should return false with an invalid value', function() {
        constraint([4,5]).isValid(d).should.equal(false);
      });

      it('should return next invalid value with an valid value', function() {
        constraint([8,9]).isValid(d).should.eql(new Date('2012-10-01T00:00:00Z'));
      });

      it('should wrap to find next invalid value with an valid value', function() {
        constraint([8,9,10,11,12]).isValid(d).should.eql(new Date('2013-01-01T00:00:00Z'));
      });
    });

    describe('reverse', function() {

      it('should return false with an invalid value', function() {
        constraint([9,10]).isValid(d, true).should.equal(false);
      });

      it('should return prev invalid value with an valid value', function() {
        constraint([7,8,9]).isValid(d, true).should.eql(new Date('2012-06-30T23:59:59Z'));
      });

      it('should wrap to find prev invalid value with an valid value', function() {
        constraint([1,2,3,4,5,6,7,8]).isValid(d, true).should.eql(new Date('2011-12-31T23:59:59Z'));
      });
    });

  });
});