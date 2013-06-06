var later = require('../../index'),
    constraint = later.constraint.Y,
    should = require('should');

describe('Constraint Year', function() {
  later.option.UTC = true;

  describe('isInvalid', function() {
    var d = new Date('2012-02-28T00:00:05Z');

    describe('forward', function() {

      it('should return false with a valid value', function() {
        constraint([2012]).isInvalid(d).should.equal(false);
      });

      it('should return next valid value with an invalid value', function() {
        constraint([2014, 2015]).isInvalid(d).should.eql(new Date('2014-01-01T00:00:00Z'));
      });

      it('should return undefined if there is no next valid value', function() {
        should.equal(constraint([2010]).isInvalid(d), undefined);
      });

    });

    describe('reverse', function() {

      it('should return false with a valid value', function() {
        constraint([2012], true).isInvalid(d).should.equal(false);
      });

      it('should return prev valid value with an invalid value', function() {
        constraint([2009, 2010], true).isInvalid(d).should.eql(new Date('2010-12-31T23:59:59Z'));
      });

      it('should return undefined if there is no prev valid value', function() {
        should.equal(constraint([2014], true).isInvalid(d), undefined);
      });

    });

  });

  describe('isValid', function() {
    var d = new Date('2012-02-28T00:00:05Z');

    describe('forward', function() {

      it('should return false with an invalid value', function() {
        constraint([2013]).isValid(d).should.equal(false);
      });

      it('should return next invalid value with an valid value', function() {
        constraint([2012, 2013]).isValid(d).should.eql(new Date('2014-01-01T00:00:00Z'));
      });

    });

    describe('reverse', function() {

      it('should return false with an invalid value', function() {
        constraint([2013], true).isValid(d).should.equal(false);
      });

      it('should return next invalid value with an valid value', function() {
        constraint([2011, 2012], true).isValid(d).should.eql(new Date('2010-12-31T23:59:59Z'));
      });

    });

  });
});