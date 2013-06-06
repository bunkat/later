var recur = require('../lib/recur').recur;
var cron = require('../lib/cron.parser').cronParser;
var text = require('../lib/en.parser').enParser;
var later = require('../lib/later').later;
var should = require('should');

describe('Later getNextInvalid', function() {


    describe('with no schedule', function() {

      it('should return undefined if schedule is null', function() {
        this.timeout(1);
        var r = null;
        var start = new Date('2013-03-15T09:00:00Z');

        var l = later().getNextInvalid(r, start);
        should.not.exist(l);
      });

    });

    describe('with schedule and exceptions', function() {

      it('should return next invalid time', function() {
        this.timeout(1);
        var r = recur()
                  .afterTime('09:00').beforeTime('21:00')
                .except()
                  .afterTime('12:00').beforeTime('13:00');
        var start = new Date('2013-03-15T09:01:00Z');
        var expected = new Date('2013-03-15T12:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with only exceptions', function() {

      it('should return start time if exception is valid', function() {
        this.timeout(1);
        var r = recur().except().onWeekday();
        var start = new Date('2013-03-15T09:00:00Z');
        var expected = new Date('2013-03-15T09:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

      it('should return next valid exception time', function() {
        this.timeout(1);
        var r = recur().except().afterTime('12:00:00').beforeTime('1:00:00');
        var start = new Date('2013-03-15T09:00:00Z');
        var expected = new Date('2013-03-15T12:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with year', function() {

      it('should return next invalid year', function() {
        this.timeout(1);
        var r = recur().on(2013,2014).year();
        var start = new Date('2013-02-05T09:40:00Z');
        var expected = new Date('2015-01-01T00:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with month', function() {

      it('should return next invalid month in the same year', function() {
        this.timeout(1);
        var r = recur().on(1,2,3).month();
        var start = new Date('2013-02-05T09:40:00Z');
        var expected = new Date('2013-04-01T00:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with date of month', function() {

      it('should return next invalid date in same month', function() {
        this.timeout(1);
        var r = recur().every(4).dayOfMonth();
        var start = new Date('2013-03-05T09:40:00Z');
        var expected = new Date('2013-03-06T00:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with day of week', function() {

      it('should return next invalid day in same month', function() {
        this.timeout(1);
        var r = recur().onWeekend();
        var start = new Date('2013-03-16T09:40:00Z');
        var expected = new Date('2013-03-18T00:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with after constraint', function() {

      it('should return next invalid time on next day', function() {
        this.timeout(1);
        var r = recur().afterTime('12:00:00');
        var start = new Date('2013-03-15T13:00:00Z');
        var expected = new Date('2013-03-16T00:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with before constraint', function() {

      it('should return next invalid time on same day', function() {
        this.timeout(1);
        var r = recur().beforeTime('12:00:00');
        var start = new Date('2013-03-15T09:00:00Z');
        var expected = new Date('2013-03-15T12:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with hour constraint', function() {

      it('should return next invalid hour on same day', function() {
        this.timeout(1);
        var r = recur().on(4,5,6).hour();
        var start = new Date('2013-03-15T04:00:00Z');
        var expected = new Date('2013-03-15T07:00:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with minute constraint', function() {

      it('should return next invalid minute on same day', function() {
        this.timeout(1);
        var r = recur().on(4,5,6).minute();
        var start = new Date('2013-03-15T04:04:00Z');
        var expected = new Date('2013-03-15T04:07:00Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with second constraint', function() {

      it('should return next invalid second on same day', function() {
        this.timeout(1);
        var r = recur().on(4,5,6).second();
        var start = new Date('2013-03-15T04:00:04Z');
        var expected = new Date('2013-03-15T04:00:07Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });

    describe('with time constraint', function() {

      it('should return next invalid second on same day', function() {
        this.timeout(1);
        var r = recur().at('09:40:00');
        var start = new Date('2013-03-15T09:40:00Z');
        var expected = new Date('2013-03-15T09:40:01Z');

        var l = later().getNextInvalid(r, start);
        l.getTime().should.eql(expected.getTime());
      });

    });
});