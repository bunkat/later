var later = require('../../index'),
    constraint = later.constraint.dw,
    should = require('should');

describe('Constraint Weekday', function() {
  later.option.UTC = true;

  describe('isInvalid', function() {
    var d = new Date('2013-03-28T00:00:05Z');

    describe('forward', function() {

      it('should return false with a valid value', function() {
        constraint([5]).isInvalid(d).should.equal(false);
      });

      it('should return next valid value with an invalid value using last', function() {
        constraint([0]).isInvalid(d).should.eql(new Date('2013-03-30T00:00:00Z'));
      });

      it('should return next valid value with an invalid value', function() {
        constraint([7]).isInvalid(d).should.eql(new Date('2013-03-30T00:00:00Z'));
      });

      it('should wrap to find next valid value with an invalid value', function() {
        constraint([3]).isInvalid(d).should.eql(new Date('2013-04-02T00:00:00Z'));
      });

    });

    describe('reverse', function() {

      it('should return false with a valid value', function() {
        constraint([5]).isInvalid(d, true).should.equal(false);
      });

      it('should return prev valid value with an invalid value', function() {
        constraint([3]).isInvalid(d, true).should.eql(new Date('2013-03-26T23:59:59Z'));
      });

      it('should wrap to find prev valid value with an invalid value', function() {
        constraint([7]).isInvalid(d, true).should.eql(new Date('2013-03-23T23:59:59Z'));
      });

    });

  });

  describe('isValid', function() {

    describe('forward', function() {
      var d = new Date('2013-03-28T00:00:05Z');

      it('should return false with an invalid value', function() {
        constraint([7]).isValid(d).should.equal(false);
      });

      it('should return next invalid value with an valid value', function() {
        constraint([5,6]).isValid(d).should.eql(new Date('2013-03-30T00:00:00Z'));
      });

      it('should wrap to find next invalid value with an valid value', function() {
        constraint([1,5,6,7]).isValid(d).should.eql(new Date('2013-04-01T00:00:00Z'));
      });
    });

    describe('reverse', function() {
      var d = new Date('2013-03-28T00:00:05Z');

      it('should return false with an invalid value', function() {
        constraint([7]).isValid(d, true).should.equal(false);
      });

      it('should return prev invalid value with an valid value', function() {
        constraint([1,5,6,7]).isValid(d, true).should.eql(new Date('2013-03-27T23:59:59Z'));
      });

      it('should wrap to find prev invalid value with an valid value', function() {
        constraint([1,2,3,4,5]).isValid(d, true).should.eql(new Date('2013-03-23T23:59:59Z'));
      });
    });

  });
});