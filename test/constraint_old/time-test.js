var later = require('../../index'),
    constraint = later.constraint.t,
    should = require('should');

describe('Constraint Time', function() {
  later.option.UTC = true;

  describe('isInvalid', function() {
    var d = new Date('2012-03-28T08:15:00Z');

    describe('forward', function() {

      it('should return false with a valid value', function() {
        constraint(["08:15:00"]).isInvalid(d).should.equal(false);
      });

      it('should return next valid value with an invalid value', function() {
        constraint(["18:15:00"]).isInvalid(d).should.eql(new Date('2012-03-28T18:15:00Z'));
      });

      it('should wrap to find next valid value with an invalid value', function() {
        constraint(["04:15:00"]).isInvalid(d).should.eql(new Date('2012-03-29T04:15:00Z'));
      });

    });

    describe('reverse', function() {

      it('should return false with a valid value', function() {
        constraint(["08:15:00"]).isInvalid(d, true).should.equal(false);
      });

      it('should return prev valid value with an invalid value', function() {
        constraint(["04:15:00"]).isInvalid(d, true).should.eql(new Date('2012-03-28T04:15:00Z'));
      });

      it('should wrap to find prev valid value with an invalid value', function() {
        constraint(["18:15:00"]).isInvalid(d, true).should.eql(new Date('2012-03-27T18:15:00Z'));
      });

    });

  });

  describe('isValid', function() {

    describe('forward', function() {
      var d = new Date('2012-08-28T08:59:58Z');

      it('should return false with an invalid value', function() {
        constraint(["18:15:00"]).isValid(d).should.equal(false);
      });

      it('should return next invalid value with an valid value', function() {
        constraint(["08:59:58", "08:59:59"]).isValid(d).should.eql(new Date('2012-08-28T09:00:00Z'));
      });

    });

    describe('reverse', function() {
      var d = new Date('2012-08-28T18:59:58Z');

      it('should return false with an invalid value', function() {
        constraint(["18:15:00"]).isValid(d, true).should.equal(false);
      });

      it('should return prev invalid value with an valid value', function() {
        constraint(["18:59:58", "18:59:57"]).isValid(d, true).should.eql(new Date('2012-08-28T18:59:56Z'));
      });

    });

  });
});