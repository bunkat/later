var recur = require('../lib/recur').recur;
var cron = require('../lib/cron.parser').cronParser;
var text = require('../lib/en.parser').enParser;
var later = require('../lib/later').later;
var should = require('should');

describe('Later', function() {

	describe('getNext', function() {

		describe('seconds', function() {

			it('should return null if no valid second is found', function() {
				this.timeout(1);
				var r = recur().on(67).second().on(1).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to next valid second after every constraint', function() {
				this.timeout(1);
				var r = recur().every(5).second();
				var start = new Date('2012-02-28T00:00:06Z');
				var expected = new Date('2012-02-28T00:00:10Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to next valid second after except constraint', function() {
				this.timeout(1);
				var r = recur().every(5).second().except().on(10).second();
				var start = new Date('2012-02-28T00:00:06Z');
				var expected = new Date('2012-02-28T00:00:15Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid second after specified seconds', function() {
				this.timeout(1);
				var r = recur().after(45).second();
				var start = new Date('2012-02-28T23:59:20Z');
				var expected = new Date('2012-02-29T00:00:05Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid second within the same minute', function() {
				this.timeout(1);
				var r = recur().on(45).second();
				var start = new Date('2012-02-28T23:59:00Z');
				var expected = new Date('2012-02-28T23:59:45Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last second within the same minute', function() {
				this.timeout(1);
				var r = recur().last().second();
				var start = new Date('2012-02-28T23:07:00Z');
				var expected = new Date('2012-02-28T23:07:59Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first second within the next minute', function() {
				this.timeout(1);
				var r = recur().first().second();
				var start = new Date('2012-02-28T23:07:01Z');
				var expected = new Date('2012-02-28T23:08:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid second within the next minute', function() {
				this.timeout(1);
				var r = recur().on(12).second();
				var start = new Date('2012-02-28T22:00:15');
				var expected = new Date('2012-02-28T22:01:12');

				var l = later(1, true).getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid second within the next hour', function() {
				this.timeout(1);
				var r = recur().on(7).second();
				var start = new Date('2012-02-28T22:59:15Z');
				var expected = new Date('2012-02-28T23:00:07Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid second within the next day', function() {
				this.timeout(1);
				var r = recur().on(7).second();
				var start = new Date('2012-02-28T23:59:15Z');
				var expected = new Date('2012-02-29T00:00:07Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid second within the next month', function() {
				this.timeout(1);
				var r = recur().on(5).second();
				var start = new Date('2012-01-31T23:59:15Z');
				var expected = new Date('2012-02-01T00:00:05Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid second within the next year', function() {
				this.timeout(1);
				var r = recur().on(5).second();
				var start = new Date('2012-12-31T23:59:15');
				var expected = new Date('2013-01-01T00:00:05');

				var l = later(1, true).getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid second within the next day on a leap year', function() {
				this.timeout(1);
				var r = recur().on(5).second();
				var start = new Date('2012-02-28T23:59:15Z');
				var expected = new Date('2012-02-29T00:00:05Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('minutes', function() {

			it('should return null if no valid minute is found', function() {
				this.timeout(1);
				var r = recur().on(67).minute().on(1).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid minute after specified minutes', function() {
				this.timeout(1);
				var r = recur().after(45).minute();
				var start = new Date('2012-02-28T23:59:20Z');
				var expected = new Date('2012-02-29T00:44:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid minute within the same hour', function() {
				this.timeout(1);
				var r = recur().on(12).minute();
				var start = new Date('2012-02-28T22:07:15Z');
				var expected = new Date('2012-02-28T22:12:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last minute within the same hour', function() {
				this.timeout(1);
				var r = recur().last().minute();
				var start = new Date('2012-02-28T23:07:00Z');
				var expected = new Date('2012-02-28T23:59:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first minute within the next hour', function() {
				this.timeout(1);
				var r = recur().first().minute();
				var start = new Date('2012-02-28T22:07:01Z');
				var expected = new Date('2012-02-28T23:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid minute within the next hour', function() {
				this.timeout(1);
				var r = recur().on(7).minute();
				var start = new Date('2012-02-28T22:34:15Z');
				var expected = new Date('2012-02-28T23:07:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid minute within the next day', function() {
				this.timeout(1);
				var r = recur().on(7).minute();
				var start = new Date('2012-02-28T23:28:15Z');
				var expected = new Date('2012-02-29T00:07:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid minute within the next month', function() {
				this.timeout(1);
				var r = recur().on(34).minute();
				var start = new Date('2012-01-31T23:42:15Z');
				var expected = new Date('2012-02-01T00:34:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid minute within the next year', function() {
				this.timeout(1);
				var r = recur().on(52).minute();
				var start = new Date('2012-12-31T23:59:15Z');
				var expected = new Date('2013-01-01T00:52:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid minute within the next day on a leap year', function() {
				this.timeout(1);
				var r = recur().on(5).minute();
				var start = new Date('2012-02-28T23:59:15Z');
				var expected = new Date('2012-02-29T00:05:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('hours', function() {

			it('should return null if no valid hour is found', function() {
				this.timeout(1);
				var r = recur().on(3).hour().on(3).month();
				var start = new Date('2012-02-01T00:00:05Z');
				var end = new Date('2012-02-29T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start, end);
				should.not.exist(l);
			});

			it('should skip forward to the next valid hour after specified hours', function() {
				this.timeout(1);
				var r = recur().after(3).hour();
				var start = new Date('2012-02-28T23:59:20Z');
				var expected = new Date('2012-02-29T02:59:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid hour within the same day', function() {
				this.timeout(1);
				var r = recur().on(14).hour();
				var start = new Date('2012-02-28T12:07:15Z');
				var expected = new Date('2012-02-28T14:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last hour within the same day', function() {
				this.timeout(1);
				var r = recur().last().hour();
				var start = new Date('2012-02-28T21:07:00Z');
				var expected = new Date('2012-02-28T23:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first hour within the next day', function() {
				this.timeout(1);
				var r = recur().first().hour();
				var start = new Date('2012-02-28T22:07:01Z');
				var expected = new Date('2012-02-29T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
						
			it('should skip forward to the next valid hour within the next day', function() {
				this.timeout(1);
				var r = recur().on(7).hour();
				var start = new Date('2012-02-28T22:34:15Z');
				var expected = new Date('2012-02-29T07:00:00Z');

				var l = later().getNext(r, start);
			});
			
			it('should skip forward to the next valid hour within the next month', function() {
				this.timeout(1);
				var r = recur().on(7).hour();
				var start = new Date('2012-05-31T17:28:15Z');
				var expected = new Date('2012-06-01T07:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
			
			it('should skip forward to the next valid hour within the next year', function() {
				this.timeout(1);
				var r = recur().on(6).hour();
				var start = new Date(2012, 11, 31, 23, 42, 15);
				var expected = new Date(2013,0,1,6,0,0);

				var l = later(1,true).getNext(r, start);
				
				l.getTime().should.eql(expected.getTime());
			});
						
			it('should skip forward to the next valid hour within the next day on a leap year', function() {
				this.timeout(1);
				var r = recur().on(22).hour();
				var start = new Date('2012-02-28T23:59:15Z');
				var expected = new Date('2012-02-29T22:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('times', function() {

			it('should return null if no valid time is found', function() {
				this.timeout(1);
				var r = recur().at('08:00:00').on(1).month().on(2012).year();
				var start = new Date('2012-02-29T12:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid time within the same day', function() {
				this.timeout(1);
				var r = recur().at('15:06:30');
				var start = new Date('2012-02-28T12:07:15Z');
				var expected = new Date('2012-02-28T15:06:30Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid time within the next day', function() {
				this.timeout(1);
				var r = recur().at('00:06:11');
				var start = new Date('2012-02-28T22:34:15Z');
				var expected = new Date('2012-02-29T00:06:11Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid time within the next month', function() {
				this.timeout(1);
				var r = recur().at('12:12:12');
				var start = new Date('2012-05-31T17:28:15Z');
				var expected = new Date('2012-06-01T12:12:12Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid time within the next year', function() {
				this.timeout(1);
				var r = recur().at('09:14:21');
				var start = new Date(2012, 11, 31, 23, 42, 15);
				var expected = new Date(2013,0,1,9,14,21);

				var l = later(1, true).getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid time within the next day on a leap year', function() {
				this.timeout(1);
				var r = recur().at('22:15:00');
				var start = new Date('2012-02-28T23:59:15Z');
				var expected = new Date('2012-02-29T22:15:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('days of week', function() {

			it('should return null if no valid week day is found', function() {
				this.timeout(1);
				var r = recur().on(6).dayOfWeek().on(1).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid day after specified days of week', function() {
				this.timeout(1);
				var r = recur().after(4).dayOfWeek();
				var start = new Date('2012-02-28T13:59:20Z');
				var expected = new Date('2012-03-03T13:59:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
									
			it('should skip forward to the next valid week day within the same week', function() {
				this.timeout(1);
				var r = recur().on(4).dayOfWeek();
				var start = new Date('2012-02-13T12:07:15Z');
				var expected = new Date('2012-02-15T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last week day within the same week', function() {
				this.timeout(1);
				var r = recur().last().dayOfWeek();
				var start = new Date('2012-02-13T21:07:00Z');
				var expected = new Date('2012-02-18T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first week day within the next week', function() {
				this.timeout(1);
				var r = recur().first().dayOfWeek();
				var start = new Date('2012-02-14T22:07:01Z');
				var expected = new Date('2012-02-19T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
						
			it('should skip forward to the next valid week day within the next month', function() {
				this.timeout(1);
				var r = recur().on(6).dayOfWeek();
				var start = new Date('2012-02-28T22:34:15Z');
				var expected = new Date('2012-03-02T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
			
			it('should skip forward to the next valid week day within the next year', function() {
				this.timeout(1);
				var r = recur().on(4).dayOfWeek();
				var start = new Date('2012-12-31T23:42:15Z');
				var expected = new Date('2013-01-02T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('day instance count', function() {

			it('should return null if no valid day instance is found', function() {
				this.timeout(1);
				var r = recur().on(1).dayOfWeekCount().on(1).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});
						
			it('should skip forward to the next valid day instance within the same month', function() {
				this.timeout(1);
				var r = recur().on(3).dayOfWeekCount();
				var start = new Date('2012-02-13T12:07:15Z');
				var expected = new Date('2012-02-15T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last day instance within the same month', function() {
				this.timeout(1);
				var r = recur().last().dayOfWeekCount();
				var start = new Date('2012-02-13T21:07:00Z');
				var expected = new Date('2012-02-23T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first day instance within the next month', function() {
				this.timeout(1);
				var r = recur().first().dayOfWeekCount();
				var start = new Date('2012-02-14T22:07:01Z');
				var expected = new Date('2012-03-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid week day within the next year', function() {
				this.timeout(1);
				var r = recur().on(4).dayOfWeekCount();
				var start = new Date('2012-12-31T23:42:15Z');
				var expected = new Date('2013-01-22T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('days of month', function() {

			it('should return null if no valid day is found', function() {
				this.timeout(1);
				var r = recur().on(67).dayOfMonth().on(1).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid day after specified days', function() {
				this.timeout(1);
				var r = recur().after(7).dayOfMonth();
				var start = new Date('2012-02-28T13:59:20Z');
				var expected = new Date('2012-03-06T13:59:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
									
			it('should skip forward to the next valid day within the same month', function() {
				this.timeout(1);
				var r = recur().on(14).dayOfMonth();
				var start = new Date('2012-02-02T12:07:15Z');
				var expected = new Date('2012-02-14T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last day within the same month', function() {
				this.timeout(1);
				var r = recur().last().dayOfMonth();
				var start = new Date('2012-02-07T21:07:00Z');
				var expected = new Date('2012-02-29T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first day within the next month', function() {
				this.timeout(1);
				var r = recur().first().dayOfMonth();
				var start = new Date('2012-02-07T22:07:01Z');
				var expected = new Date('2012-03-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
						
			it('should skip forward to the next valid day within the next month', function() {
				this.timeout(1);
				var r = recur().on(25).dayOfMonth();
				var start = new Date('2012-02-28T22:34:15Z');
				var expected = new Date('2012-03-25T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
			
			it('should skip forward to the next valid day within the next year', function() {
				this.timeout(1);
				var r = recur().on(6).dayOfMonth();
				var start = new Date('2012-12-31T23:42:15Z');
				var expected = new Date('2013-01-06T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('weeks of month', function() {

			it('should return null if no valid week is found', function() {
				this.timeout(1);
				var r = recur().on(67).weekOfMonth().on(1).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid week after specified weeks of year', function() {
				this.timeout(1);
				var r = recur().after(2).weekOfMonth();
				var start = new Date('2012-03-06T13:59:20Z');
				var expected = new Date('2012-03-20T13:59:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
					
			it('should skip forward to the next valid week within the same month', function() {
				this.timeout(1);
				var r = recur().on(2).weekOfMonth();
				var start = new Date('2012-02-02T02:02:00Z');
				var expected = new Date('2012-02-05T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last week within the same month', function() {
				this.timeout(1);
				var r = recur().last().weekOfMonth();
				var start = new Date('2012-02-04T02:02:00Z');
				var expected = new Date('2012-02-26T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first week within the next month', function() {
				this.timeout(1);
				var r = recur().first().weekOfMonth();
				var start = new Date('2012-02-07T22:07:01Z');
				var expected = new Date('2012-03-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
						
			it('should skip forward to the next valid week within the next month', function() {
				this.timeout(1);
				var r = recur().on(2).weekOfMonth();
				var start = new Date('2012-01-28T11:34:15Z');
				var expected = new Date('2012-02-05T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
			
			it('should skip forward to the next valid week within the next year', function() {
				this.timeout(1);
				var r = recur().on(2).weekOfMonth();
				var start = new Date('2011-12-29T12:14:15Z');
				var expected = new Date('2012-01-08T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
										
		});

		describe('months', function() {

			it('should return null if no valid month is found', function() {
				this.timeout(1);
				var r = recur().on(1).month().on(2012).year();
				var start = new Date('2012-04-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid month after specified months', function() {
				this.timeout(1);
				var r = recur().after(7).month();
				var start = new Date('2012-08-28T13:59:20Z');
				var expected = new Date('2013-03-28T13:59:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
									
			it('should skip forward to the next valid month within the same year', function() {
				this.timeout(1);
				var r = recur().on(11).month();
				var start = new Date('2012-02-02T12:07:15Z');
				var expected = new Date('2012-11-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last month within the same year', function() {
				this.timeout(1);
				var r = recur().last().month();
				var start = new Date('2012-02-07T21:07:00Z');
				var expected = new Date('2012-12-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first month within the next year', function() {
				this.timeout(1);
				var r = recur().first().month();
				var start = new Date('2012-02-07T22:07:01Z');
				var expected = new Date('2013-01-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
			
			it('should skip forward to the next valid month within the next year', function() {
				this.timeout(1);
				var r = recur().on(7).month();
				var start = new Date('2012-12-31T23:42:15Z');
				var expected = new Date('2013-07-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
										
		});

		describe('days of year', function() {

			it('should return null if no valid day is found', function() {
				this.timeout(1);
				var r = recur().on(25).dayOfYear().on(2012).year();
				var start = new Date('2012-04-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid day after specified days of year', function() {
				this.timeout(1);
				var r = recur().after(17).dayOfYear();
				var start = new Date('2012-08-28T13:59:20Z');
				var expected = new Date('2012-09-14T13:59:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
									
			it('should skip forward to the next valid day within the same year', function() {
				this.timeout(1);
				var r = recur().on(65).dayOfYear();
				var start = new Date('2012-02-02T12:07:15Z');
				var expected = new Date('2012-03-05T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last day within the same year', function() {
				this.timeout(1);
				var r = recur().last().dayOfYear();
				var start = new Date('2012-02-07T21:07:00Z');
				var expected = new Date('2012-12-31T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first day within the next year', function() {
				this.timeout(1);
				var r = recur().first().dayOfYear();
				var start = new Date('2012-02-07T22:07:01Z');
				var expected = new Date('2013-01-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the next valid day within the next year', function() {
				this.timeout(1);
				var r = recur().on(12).dayOfYear();
				var start = new Date('2012-12-31T23:42:15Z');
				var expected = new Date('2013-01-12T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('weeks of year', function() {

			it('should return null if no valid week is found', function() {
				this.timeout(1);
				var r = recur().on(3).weekOfYear().on(2012).year();
				var start = new Date('2012-04-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid week after specified weeks of year', function() {
				this.timeout(1);
				var r = recur().after(2).weekOfYear();
				var start = new Date('2012-03-06T13:59:20Z');
				var expected = new Date('2012-03-20T13:59:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
									
			it('should skip forward to the next valid week within the same year', function() {
				this.timeout(1);
				var r = recur().on(3).weekOfYear();
				var start = new Date('2012-01-10T23:59:00Z');
				var expected = new Date('2012-01-16T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the last week within the same year', function() {
				this.timeout(1);
				var r = recur().last().weekOfYear();
				var start = new Date('2012-04-06T00:05:05Z');
				var expected = new Date('2012-12-24T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward to the first week within the next month', function() {
				this.timeout(1);
				var r = recur().on(6).weekOfYear();
				var start = new Date('2012-01-10T23:59:00Z');
				var expected = new Date('2012-02-06T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
			
			it('should skip forward over a 52 week year to next year', function() {
				this.timeout(1);
				var r = recur().on(4).weekOfYear();
				var start = new Date('2007-02-07T23:59:00Z');
				var expected = new Date('2008-01-21T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip forward over a 53 week year to next year', function() {
				this.timeout(1);
				var r = recur().on(4).weekOfYear();
				var start = new Date('2005-02-07T23:59:00Z');
				var expected = new Date('2006-01-23T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
										
		});

		describe('years', function() {

			it('should return null if no valid year is found', function() {
				this.timeout(1);
				var r = recur().on(67).on(1).month().on(2012).year();
				var start = new Date('2012-04-28T00:00:05Z');
				var expected = null;

				var l = later().getNext(r, start);
				should.not.exist(l);
			});

			it('should skip forward to the next valid year after specified years', function() {
				this.timeout(1);
				var r = recur().after(2).year();
				var start = new Date('2012-08-28T13:59:20Z');
				var expected = new Date('2014-08-28T13:59:20Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
						
			it('should skip forward to the next valid year', function() {
				this.timeout(1);
				var r = recur().on(2017).year();
				var start = new Date('2012-02-02T12:07:15Z');
				var expected = new Date('2017-01-01T00:00:00Z');

				var l = later().getNext(r, start);
				l.getTime().should.eql(expected.getTime());
			});
										
		});
	});

	describe('getPrevious', function() {

		describe('seconds', function() {

			it('should return null if no valid second is found', function() {
				this.timeout(1);
				var r = recur().on(15).second().on(4).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to prev valid second after every constraint', function() {
				this.timeout(1);
				var r = recur().every(5).second();
				var start = new Date('2012-02-28T00:00:06Z');
				var expected = new Date('2012-02-28T00:00:05Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to prev valid second after except constraint', function() {
				this.timeout(1);
				var r = recur().every(5).second().except().on(10).second();
				var start = new Date('2012-02-28T00:00:12Z');
				var expected = new Date('2012-02-28T00:00:05Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid second within the same minute', function() {
				this.timeout(1);
				var r = recur().on(45).second();
				var start = new Date('2012-02-28T23:59:52Z');
				var expected = new Date('2012-02-28T23:59:45Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last second within the prev minute', function() {
				this.timeout(1);
				var r = recur().last().second();
				var start = new Date('2012-02-28T23:08:00Z');
				var expected = new Date('2012-02-28T23:07:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first second within the same minute', function() {
				this.timeout(1);
				var r = recur().first().second();
				var start = new Date('2012-02-28T23:07:01Z');
				var expected = new Date('2012-02-28T23:07:00Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid second within the prev minute', function() {
				this.timeout(1);
				var r = recur().on(12).second();
				var start = new Date('2012-02-28T22:01:04');
				var expected = new Date('2012-02-28T22:00:12');

				var l = later(1, true).getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid second within the prev hour', function() {
				this.timeout(1);
				var r = recur().on(7).second();
				var start = new Date('2012-02-28T22:00:05Z');
				var expected = new Date('2012-02-28T21:59:07Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid second within the prev day', function() {
				this.timeout(1);
				var r = recur().on(7).second();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = new Date('2012-02-27T23:59:07Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid second within the prev month', function() {
				this.timeout(1);
				var r = recur().on(5).second();
				var start = new Date('2012-02-01T00:00:02Z');
				var expected = new Date('2012-01-31T23:59:05Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid second within the prev year', function() {
				this.timeout(1);
				var r = recur().on(5).second();
				var start = new Date('2013-01-01T00:00:02');
				var expected = new Date('2012-12-31T23:59:05');

				var l = later(1, true).getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid second within the prev day on a leap year', function() {
				this.timeout(1);
				var r = recur().on(5).second();
				var start = new Date('2012-03-01T00:00:02Z');
				var expected = new Date('2012-02-29T23:59:05Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('minutes', function() {

			it('should return null if no valid minute is found', function() {
				this.timeout(1);
				var r = recur().on(10).minute().on(4).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid minute within the same hour', function() {
				this.timeout(1);
				var r = recur().on(12).minute();
				var start = new Date('2012-02-28T22:18:15Z');
				var expected = new Date('2012-02-28T22:12:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last minute within the prev hour', function() {
				this.timeout(1);
				var r = recur().last().minute();
				var start = new Date('2012-02-28T23:07:00Z');
				var expected = new Date('2012-02-28T22:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first minute within the same hour', function() {
				this.timeout(1);
				var r = recur().first().minute();
				var start = new Date('2012-02-28T22:07:01Z');
				var expected = new Date('2012-02-28T22:00:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid minute within the prev hour', function() {
				this.timeout(1);
				var r = recur().on(7).minute();
				var start = new Date('2012-02-28T22:04:15Z');
				var expected = new Date('2012-02-28T21:07:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid minute within the prev day', function() {
				this.timeout(1);
				var r = recur().on(7).minute();
				var start = new Date('2012-02-28T00:04:15Z');
				var expected = new Date('2012-02-27T23:07:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid minute within the prev month', function() {
				this.timeout(1);
				var r = recur().on(34).minute();
				var start = new Date('2012-02-01T00:27:15Z');
				var expected = new Date('2012-01-31T23:34:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid minute within the prev year', function() {
				this.timeout(1);
				var r = recur().on(52).minute();
				var start = new Date('2013-01-01T00:51:15Z');
				var expected = new Date('2012-12-31T23:52:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('hours', function() {

			it('should return null if no valid hour is found', function() {
				this.timeout(1);
				var r = recur().on(22).hour().on(5).month().on(2012).year;
				var start = new Date('2012-02-01T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid hour within the same day', function() {
				this.timeout(1);
				var r = recur().on(14).hour();
				var start = new Date('2012-02-28T16:07:15Z');
				var expected = new Date('2012-02-28T14:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last hour within the prev day', function() {
				this.timeout(1);
				var r = recur().last().hour();
				var start = new Date('2012-02-29T21:07:00Z');
				var expected = new Date('2012-02-28T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first hour within the same day', function() {
				this.timeout(1);
				var r = recur().first().hour();
				var start = new Date('2012-02-29T22:07:01Z');
				var expected = new Date('2012-02-29T00:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid hour within the prev day', function() {
				this.timeout(1);
				var r = recur().on(7).hour();
				var start = new Date('2012-02-28T05:34:15Z');
				var expected = new Date('2012-02-27T07:59:59Z');

				var l = later().getPrevious(r, start);
			});

			it('should skip back to the prev valid hour within the prev month', function() {
				this.timeout(1);
				var r = recur().on(7).hour();
				var start = new Date('2012-06-01T05:28:15Z');
				var expected = new Date('2012-05-31T07:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid hour within the prev year', function() {
				this.timeout(1);
				var r = recur().on(6).hour();
				var start = new Date('2013-01-01T05:28:15Z');
				var expected = new Date('2012-12-31T06:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('times', function() {

			it('should return null if no valid time is found', function() {
				this.timeout(1);
				var r = recur().at('14:00:00').on(3).month().on(2012).year();
				var start = new Date('2012-02-29T12:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid time within the same day', function() {
				this.timeout(1);
				var r = recur().at('15:06:30');
				var start = new Date('2012-02-28T17:07:15Z');
				var expected = new Date('2012-02-28T15:06:30Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid time within the same day with multiple', function() {
				this.timeout(1);
				var r = recur().at('15:06:30', '16:05:00');
				var start = new Date('2012-02-28T17:07:15Z');
				var expected = new Date('2012-02-28T16:05:00Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid time within the prev day', function() {
				this.timeout(1);
				var r = recur().at('00:06:11');
				var start = new Date('2012-02-29T00:04:15Z');
				var expected = new Date('2012-02-28T00:06:11Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid time within the prev month', function() {
				this.timeout(1);
				var r = recur().at('12:12:12');
				var start = new Date('2012-06-01T06:28:15Z');
				var expected = new Date('2012-05-31T12:12:12Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid time within the prev year', function() {
				this.timeout(1);
				var r = recur().at('09:14:21');
				var start = new Date('2013-01-01T06:28:15Z');
				var expected = new Date('2012-12-31T09:14:21Z');

				var l = later(1).getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid time within the prev day on a leap year', function() {
				this.timeout(1);
				var r = recur().at('22:15:00');
				var start = new Date('2012-03-01T13:59:15Z');
				var expected = new Date('2012-02-29T22:15:00Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('days of week', function() {

			it('should return null if no valid week day is found', function() {
				this.timeout(1);
				var r = recur().on(6).dayOfWeek().on(3).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid week day within the same week', function() {
				this.timeout(1);
				var r = recur().on(4).dayOfWeek();
				var start = new Date('2012-02-17T12:07:15Z');
				var expected = new Date('2012-02-15T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last week day within the prev week', function() {
				this.timeout(1);
				var r = recur().last().dayOfWeek();
				var start = new Date('2012-02-20T21:07:00Z');
				var expected = new Date('2012-02-18T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first week day within the same week', function() {
				this.timeout(1);
				var r = recur().first().dayOfWeek();
				var start = new Date('2012-02-20T22:07:01Z');
				var expected = new Date('2012-02-19T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid week day within the prev month', function() {
				this.timeout(1);
				var r = recur().on(6).dayOfWeek();
				var start = new Date('2012-03-01T22:34:15Z');
				var expected = new Date('2012-02-24T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid week day within the prev year', function() {
				this.timeout(1);
				var r = recur().on(4).dayOfWeek();
				var start = new Date('2013-01-01T23:42:15Z');
				var expected = new Date('2012-12-26T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('day instance count', function() {

			it('should return null if no valid day instance is found', function() {
				this.timeout(1);
				var r = recur().on(1).dayOfWeekCount().on(3).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid day instance within the same month', function() {
				this.timeout(1);
				var r = recur().on(3).dayOfWeekCount();
				var start = new Date('2013-02-24T12:07:15Z');
				var expected = new Date('2013-02-21T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last day instance within the prev month', function() {
				this.timeout(1);
				var r = recur().last().dayOfWeekCount();
				var start = new Date('2013-03-04T21:07:00Z');
				var expected = new Date('2013-02-28T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first day instance within the same month', function() {
				this.timeout(1);
				var r = recur().first().dayOfWeekCount();
				var start = new Date('2012-03-14T22:07:01Z');
				var expected = new Date('2012-03-07T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid week day within the prev year', function() {
				this.timeout(1);
				var r = recur().on(4).dayOfWeekCount();
				var start = new Date('2013-01-12T23:42:15Z');
				var expected = new Date('2012-12-28T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('days of month', function() {

			it('should return null if no valid day is found', function() {
				this.timeout(1);
				var r = recur().on(67).dayOfMonth().on(1).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid day within the same month', function() {
				this.timeout(1);
				var r = recur().on(14).dayOfMonth();
				var start = new Date('2012-02-18T12:07:15Z');
				var expected = new Date('2012-02-14T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last day within the prev month', function() {
				this.timeout(1);
				var r = recur().last().dayOfMonth();
				var start = new Date('2012-03-07T21:07:00Z');
				var expected = new Date('2012-02-29T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first day within the same month', function() {
				this.timeout(1);
				var r = recur().first().dayOfMonth();
				var start = new Date('2012-03-07T22:07:01Z');
				var expected = new Date('2012-03-01T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid day within the prev month', function() {
				this.timeout(1);
				var r = recur().on(25).dayOfMonth();
				var start = new Date('2012-04-14T22:34:15Z');
				var expected = new Date('2012-03-25T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid day within the prev year', function() {
				this.timeout(1);
				var r = recur().on(6).dayOfMonth();
				var start = new Date('2014-01-04T23:42:15Z');
				var expected = new Date('2013-12-06T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('weeks of month', function() {

			it('should return null if no valid week is found', function() {
				this.timeout(1);
				var r = recur().on(67).weekOfMonth().on(1).month().on(2012).year();
				var start = new Date('2012-02-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid week within the same month', function() {
				this.timeout(1);
				var r = recur().on(2).weekOfMonth();
				var start = new Date('2013-02-19T02:02:00Z');
				var expected = new Date('2013-02-09T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last week within the prev month', function() {
				this.timeout(1);
				var r = recur().last().weekOfMonth();
				var start = new Date('2013-03-04T02:02:00Z');
				var expected = new Date('2013-02-28T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first week within the same month', function() {
				this.timeout(1);
				var r = recur().first().weekOfMonth();
				var start = new Date('2013-03-07T22:07:01Z');
				var expected = new Date('2013-03-02T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid week within the prev month', function() {
				this.timeout(1);
				var r = recur().on(2).weekOfMonth();
				var start = new Date('2013-03-01T11:34:15Z');
				var expected = new Date('2013-02-09T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid week within the prev year', function() {
				this.timeout(1);
				var r = recur().on(2).weekOfMonth();
				var start = new Date('2013-01-03T12:14:15Z');
				var expected = new Date('2012-12-08T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('months', function() {

			it('should return null if no valid month is found', function() {
				this.timeout(1);
				var r = recur().on(5).month().on(2012).year();
				var start = new Date('2012-04-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid month within the same year', function() {
				this.timeout(1);
				var r = recur().on(11).month();
				var start = new Date('2012-12-02T12:07:15Z');
				var expected = new Date('2012-11-30T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last month within the prev year', function() {
				this.timeout(1);
				var r = recur().last().month();
				var start = new Date('2013-02-07T21:07:00Z');
				var expected = new Date('2012-12-31T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first month within the same year', function() {
				this.timeout(1);
				var r = recur().first().month();
				var start = new Date('2013-02-07T22:07:01Z');
				var expected = new Date('2013-01-31T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid month within the prev year', function() {
				this.timeout(1);
				var r = recur().on(7).month();
				var start = new Date('2014-05-31T23:42:15Z');
				var expected = new Date('2013-07-31T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('days of year', function() {

			it('should return null if no valid day is found', function() {
				this.timeout(1);
				var r = recur().on(25).dayOfYear().on(2013).year();
				var start = new Date('2012-04-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid day within the same year', function() {
				this.timeout(1);
				var r = recur().on(65).dayOfYear();
				var start = new Date('2012-04-02T12:07:15Z');
				var expected = new Date('2012-03-05T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last day within the prev year', function() {
				this.timeout(1);
				var r = recur().last().dayOfYear();
				var start = new Date('2013-02-07T21:07:00Z');
				var expected = new Date('2012-12-31T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first day within the same year', function() {
				this.timeout(1);
				var r = recur().first().dayOfYear();
				var start = new Date('2013-02-07T22:07:01Z');
				var expected = new Date('2013-01-01T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the prev valid day within the prev year', function() {
				this.timeout(1);
				var r = recur().on(12).dayOfYear();
				var start = new Date('2013-01-10T23:42:15Z');
				var expected = new Date('2012-01-12T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('weeks of year', function() {

			it('should return null if no valid week is found', function() {
				this.timeout(1);
				var r = recur().on(3).weekOfYear().on(2013).year();
				var start = new Date('2012-04-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid week within the same year', function() {
				this.timeout(1);
				var r = recur().on(3).weekOfYear();
				var start = new Date('2012-01-29T23:59:00Z');
				var expected = new Date('2012-01-22T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the last week within the same year', function() {
				this.timeout(1);
				var r = recur().last().weekOfYear();
				var start = new Date('2013-04-06T00:05:05Z');
				var expected = new Date('2012-12-30T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back to the first week within the prev month', function() {
				this.timeout(1);
				var r = recur().on(6).weekOfYear();
				var start = new Date('2012-03-10T23:59:00Z');
				var expected = new Date('2012-02-12T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back over a 52 week year to prev year', function() {
				this.timeout(1);
				var r = recur().on(4).weekOfYear();
				var start = new Date('2009-01-07T23:59:00Z');
				var expected = new Date('2008-01-27T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

			it('should skip back over a 53 week year to prev year', function() {
				this.timeout(1);
				var r = recur().on(4).weekOfYear();
				var start = new Date('2007-01-07T23:59:00Z');
				var expected = new Date('2006-01-29T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});

		describe('years', function() {

			it('should return null if no valid year is found', function() {
				this.timeout(1);
				var r = recur().on(1).month().on(2013).year();
				var start = new Date('2012-04-28T00:00:05Z');
				var expected = null;

				var l = later().getPrevious(r, start);
				should.not.exist(l);
			});

			it('should skip back to the prev valid year', function() {
				this.timeout(1);
				var r = recur().on(2017).year();
				var start = new Date('2019-02-02T12:07:15Z');
				var expected = new Date('2017-12-31T23:59:59Z');

				var l = later().getPrevious(r, start);
				l.getTime().should.eql(expected.getTime());
			});

		});
	});

	describe('isValid', function() {

		it('should return true if seconds is valid', function() {
			this.timeout(1);
			var r = recur().on(5).second();
			var start = new Date('2012-02-28T00:00:05Z');
			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should return true if minutes is valid', function() {
			this.timeout(1);
			var r = recur().on(5).minute();
			var start = new Date('2012-02-28T00:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should return true if hours is valid', function() {
			this.timeout(1);
			var r = recur().on(5).hour();
			var start = new Date('2012-02-28T05:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should return true if time is valid', function() {
			this.timeout(1);
			var r = recur().at('05:05:05');
			var start = new Date('2012-02-28T05:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should return true if week day is valid', function() {
			this.timeout(1);
			var r = recur().on(2).dayOfWeek();
			var start = new Date('2012-02-13T05:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should return true if week day instance is valid', function() {
			this.timeout(2);
			var r = recur().on(2).dayOfWeekCount();
			var start = new Date('2012-02-13T05:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should return true if day of month is valid', function() {
			this.timeout(1);
			var r = recur().on(5).dayOfMonth();
			var start = new Date('2012-02-05T00:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should return true if week of month is valid', function() {
			this.timeout(1);
			var r = recur().on(2).weekOfMonth();
			var start = new Date('2012-01-11T05:05:00Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});
				
		it('should return true if month is valid', function() {
			this.timeout(1);
			var r = recur().on(5).month();
			var start = new Date('2012-05-05T00:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should return true if day of year is valid', function() {
			this.timeout(1);
			var r = recur().on(5).dayOfYear();
			var start = new Date('2012-01-05T00:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		describe('should return true if week of year is valid', function() {
			
			it('test 1', function() {
				this.timeout(1);
				var r = recur().on(53).weekOfYear();
				var start = new Date('2005-01-01T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 2', function() {
				this.timeout(1);
				var r = recur().on(53).weekOfYear();
				var start = new Date('2005-01-02T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 3', function() {
				this.timeout(1);
				var r = recur().on(52).weekOfYear();
				var start = new Date('2005-12-31T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 4', function() {
				this.timeout(1);
				var r = recur().on(1).weekOfYear();
				var start = new Date('2007-01-01T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 5', function() {
				this.timeout(1);
				var r = recur().on(52).weekOfYear();
				var start = new Date('2007-12-30T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 6', function() {
				this.timeout(1);
				var r = recur().on(1).weekOfYear();
				var start = new Date('2007-12-31T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 7', function() {
				this.timeout(1);
				var r = recur().on(1).weekOfYear();
				var start = new Date('2008-01-01T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 8', function() {
				this.timeout(1);
				var r = recur().on(52).weekOfYear();
				var start = new Date('2008-12-28T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 9', function() {
				this.timeout(1);
				var r = recur().on(1).weekOfYear();
				var start = new Date('2008-12-29T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 10', function() {
				this.timeout(1);
				var r = recur().on(53).weekOfYear();
				var start = new Date('2009-12-31T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});

			it('test 11', function() {
				this.timeout(1);
				var r = recur().on(53).weekOfYear();
				var start = new Date('2010-01-03T00:00:00Z');

				var l = later().isValid(r, start);
				l.should.be.true;
			});
		});

		it('should return true if year is valid', function() {
			this.timeout(1);
			var r = recur().on(2012).year();
			var start = new Date('2012-06-05T00:05:05Z');

			var l = later().isValid(r, start);
			l.should.be.true;
		});

		it('should ignore milliseconds of passed in date', function() {
			this.timeout(1);
			var r = recur().on(5).second();
			var start = new Date('2012-02-28T00:00:05Z');
			start.setMilliseconds(15);
			var l = later().isValid(r, start);
			l.should.be.true;
		});	
	});


	describe('local time', function() {
		
		it('should match the hour in local time', function() {
			this.timeout(1);
			var r = recur().on(6).hour();
			var start = new Date(2012, 5, 5);
			var expected = new Date(2012,5,5,6,0,0);

			var l = later(1, true).getNext(r, start);
			l.getTime().should.eql(expected.getTime());
		});

	});

	describe('composite afters', function() {
		
		it('should add composite after constraints together', function() {
			this.timeout(1);
			var r = recur().after(2).month().after(3).dayOfMonth();
			var start = new Date('2012-03-06T13:59:20Z');
			var expected = new Date('2012-05-09T13:59:20Z');

			var l = later().getNext(r, start);
			l.getTime().should.eql(expected.getTime());
		});

	});


	describe('get', function() {
	
		describe('interesting schedules using cron', function() {

			it('should find the next 5 every last day of month at 10am and 10pm', function() {
				this.timeout(1);
				var r = cron().parse('0 10,22 L * ? *');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-31T10:00:00Z'),
					new Date('2012-01-31T22:00:00Z'),
					new Date('2012-02-29T10:00:00Z'),
					new Date('2012-02-29T22:00:00Z'),
					new Date('2012-03-31T10:00:00Z')
				];
				
				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}

			});

			it('should find the prev 5 every last day of month at 10am and 10pm', function() {
				this.timeout(1);
				var r = cron().parse('0 10,22 L * ? *');
				var start = new Date('2012-03-31T12:00:00Z');
				var expected = [
					new Date('2012-01-31T10:00:00Z'),
					new Date('2012-01-31T22:00:00Z'),
					new Date('2012-02-29T10:00:00Z'),
					new Date('2012-02-29T22:00:00Z'),
					new Date('2012-03-31T10:00:00Z')
				].reverse();
				
				var l = later().get(r, 5, start, null, true);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}

			});

			it('should find the next 5 Friday the 13ths', function() {
				this.timeout(1);
				var r = cron().parse('0 0 13 * 5');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-13T00:00:00Z'),
					new Date('2012-04-13T00:00:00Z'),
					new Date('2012-07-13T00:00:00Z'),
					new Date('2013-09-13T00:00:00Z'),
					new Date('2013-12-13T00:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the prev 5 Friday the 13ths', function() {
				this.timeout(1);
				var r = cron().parse('0 0 13 * 5');
				var start = new Date('2013-12-25T00:00:00Z');
				var expected = [
					new Date('2012-01-13T00:00:00Z'),
					new Date('2012-04-13T00:00:00Z'),
					new Date('2012-07-13T00:00:00Z'),
					new Date('2013-09-13T00:00:00Z'),
					new Date('2013-12-13T00:00:00Z')
				].reverse();

				var l = later().get(r, 5, start, null, true);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the next 5 patch tuesdays (2nd tuesday of the month)', function() {
				this.timeout(1);
				var r = cron().parse('0 0 ? * 2#2');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-10T00:00:00Z'),
					new Date('2012-02-14T00:00:00Z'),
					new Date('2012-03-13T00:00:00Z'),
					new Date('2012-04-10T00:00:00Z'),
					new Date('2012-05-08T00:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the prev 5 patch tuesdays (2nd tuesday of the month)', function() {
				this.timeout(1);
				var r = cron().parse('0 0 ? * 2#2');
				var start = new Date('2012-05-12T00:00:00Z');
				var expected = [
					new Date('2012-01-10T00:00:00Z'),
					new Date('2012-02-14T00:00:00Z'),
					new Date('2012-03-13T00:00:00Z'),
					new Date('2012-04-10T00:00:00Z'),
					new Date('2012-05-08T00:00:00Z')
				].reverse();

				var l = later().get(r, 5, start, null, true);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the next 5 dates closest to the 15 that falls on a weekday', function() {
				this.timeout(1);
				var r = cron().parse('0 5 15W * ?');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-16T05:00:00Z'),
					new Date('2012-02-15T05:00:00Z'),
					new Date('2012-03-15T05:00:00Z'),
					new Date('2012-04-16T05:00:00Z'),
					new Date('2012-05-15T05:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the prev 5 dates closest to the 15 that falls on a weekday', function() {
				this.timeout(1);
				var r = cron().parse('0 5 15W * ?');
				var start = new Date('2012-05-18T00:00:00Z');
				var expected = [
					new Date('2012-01-16T05:00:00Z'),
					new Date('2012-02-15T05:00:00Z'),
					new Date('2012-03-15T05:00:00Z'),
					new Date('2012-04-16T05:00:00Z'),
					new Date('2012-05-15T05:00:00Z')
				].reverse();

				var l = later().get(r, 5, start, null, true);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the last second of every month', function() {
				this.timeout(1);
				var r = cron().parse('L L L L * ?', true);
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-31T23:59:59Z'),
					new Date('2012-02-29T23:59:59Z'),
					new Date('2012-03-31T23:59:59Z'),
					new Date('2012-04-30T23:59:59Z'),
					new Date('2012-05-31T23:59:59Z'),
					new Date('2012-06-30T23:59:59Z'),
					new Date('2012-07-31T23:59:59Z'),
					new Date('2012-08-31T23:59:59Z'),
					new Date('2012-09-30T23:59:59Z'),
					new Date('2012-10-31T23:59:59Z'),
					new Date('2012-11-30T23:59:59Z'),
					new Date('2012-12-31T23:59:59Z')
				];

				var l = later().get(r, 12, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the prev last second of every month', function() {
				this.timeout(1);
				var r = cron().parse('L L L L * ?', true);
				var start = new Date('2013-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-31T23:59:59Z'),
					new Date('2012-02-29T23:59:59Z'),
					new Date('2012-03-31T23:59:59Z'),
					new Date('2012-04-30T23:59:59Z'),
					new Date('2012-05-31T23:59:59Z'),
					new Date('2012-06-30T23:59:59Z'),
					new Date('2012-07-31T23:59:59Z'),
					new Date('2012-08-31T23:59:59Z'),
					new Date('2012-09-30T23:59:59Z'),
					new Date('2012-10-31T23:59:59Z'),
					new Date('2012-11-30T23:59:59Z'),
					new Date('2012-12-31T23:59:59Z')
				].reverse();

				var l = later().get(r, 12, start, null, true);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});
		});
	
		describe('interesting schedules using text', function() {

			it('should find the next 5 every last day of month at 10am and 10pm', function() {
				this.timeout(1);
				var r = text().parse('on the last day of the month at 10:00 am,10:00 pm');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-31T10:00:00Z'),
					new Date('2012-01-31T22:00:00Z'),
					new Date('2012-02-29T10:00:00Z'),
					new Date('2012-02-29T22:00:00Z'),
					new Date('2012-03-31T10:00:00Z')
				];
				
				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the next 5 Friday the 13ths', function() {
				this.timeout(1);
				var r = text().parse('on the 13th day of the month on Fri at 00:00');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-13T00:00:00Z'),
					new Date('2012-04-13T00:00:00Z'),
					new Date('2012-07-13T00:00:00Z'),
					new Date('2013-09-13T00:00:00Z'),
					new Date('2013-12-13T00:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the next 5 patch tuesdays (2nd tuesday of the month)', function() {
				this.timeout(1);
				var r = text().parse('on the 2nd day instance on tues at 00:00');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-10T00:00:00Z'),
					new Date('2012-02-14T00:00:00Z'),
					new Date('2012-03-13T00:00:00Z'),
					new Date('2012-04-10T00:00:00Z'),
					new Date('2012-05-08T00:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the next 5 dates closest to the 15 that falls on a weekday', function() {
				this.timeout(1);
				var str = 'every weekday on the 14-16th day of the month at 5:00 am ';
				str += 'except on the 14th day of the month on mon-thu ';
				str += 'also on the 16th day of the month on tue-fri';

				var r = text().parse(str);
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-16T05:00:00Z'),
					new Date('2012-02-15T05:00:00Z'),
					new Date('2012-03-15T05:00:00Z'),
					new Date('2012-04-16T05:00:00Z'),
					new Date('2012-05-15T05:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the last second of every month', function() {
				this.timeout(1);
				var r = text().parse('on the last second on the last minute on the last hour on the last day of the month');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-31T23:59:59Z'),
					new Date('2012-02-29T23:59:59Z'),
					new Date('2012-03-31T23:59:59Z'),
					new Date('2012-04-30T23:59:59Z'),
					new Date('2012-05-31T23:59:59Z'),
					new Date('2012-06-30T23:59:59Z'),
					new Date('2012-07-31T23:59:59Z'),
					new Date('2012-08-31T23:59:59Z'),
					new Date('2012-09-30T23:59:59Z'),
					new Date('2012-10-31T23:59:59Z'),
					new Date('2012-11-30T23:59:59Z'),
					new Date('2012-12-31T23:59:59Z')
				];

				var l = later().get(r, 12, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});
		});
			
		describe('interesting schedules using recur', function() {
			
			it('should find the next 5 Friday the 13ths', function() {
				this.timeout(1);
				var r = recur().on(6).dayOfWeek().on(13).dayOfMonth().at('00:00:00');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-13T00:00:00Z'),
					new Date('2012-04-13T00:00:00Z'),
					new Date('2012-07-13T00:00:00Z'),
					new Date('2013-09-13T00:00:00Z'),
					new Date('2013-12-13T00:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the next 5 patch tuesdays (2nd tuesday of the month)', function() {
				this.timeout(1);
				var r = recur().on(3).dayOfWeek().on(2).dayOfWeekCount().at('00:00:00');
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-10T00:00:00Z'),
					new Date('2012-02-14T00:00:00Z'),
					new Date('2012-03-13T00:00:00Z'),
					new Date('2012-04-10T00:00:00Z'),
					new Date('2012-05-08T00:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the next 5 dates closest to the 15 that falls on a weekday', function() {
				this.timeout(1);
				var r = recur().at('00:00:00').on(15).dayOfMonth().onWeekday();
					r.and().at('00:00:00').on(14).dayOfMonth().on(6).dayOfWeek();
					r.and().at('00:00:00').on(16).dayOfMonth().on(2).dayOfWeek();
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-16T00:00:00Z'),
					new Date('2012-02-15T00:00:00Z'),
					new Date('2012-03-15T00:00:00Z'),
					new Date('2012-04-16T00:00:00Z'),
					new Date('2012-05-15T00:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should recur everyday except on weekends', function() {
				this.timeout(1);
				var r = recur().at('08:00:00').except().on(1,7).dayOfWeek();
				var start = new Date('2012-01-05T00:00:00Z');
				var expected = [
					new Date('2012-01-05T08:00:00Z'),
					new Date('2012-01-06T08:00:00Z'),
					new Date('2012-01-09T08:00:00Z'),
					new Date('2012-01-10T08:00:00Z'),
					new Date('2012-01-11T08:00:00Z')
				];

				var l = later().get(r, 5, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should recur Wednesday every 4 weeks at 8am starting on the 5th week', function() {
				this.timeout(1);
				var r = recur().every(4).weekOfYear().startingOn(5).on(4).dayOfWeek().at('08:00:00');
				var start = new Date('2012-01-01T23:59:15Z');
				var expected = [
					new Date('2012-02-01T08:00:00Z'),
					new Date('2012-02-29T08:00:00Z'),
					new Date('2012-03-28T08:00:00Z'),
					new Date('2012-04-25T08:00:00Z'),
					new Date('2012-05-23T08:00:00Z'),
					new Date('2012-06-20T08:00:00Z')
				];

				var l = later().get(r, 6, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the first second of every month', function() {
				this.timeout(1);
				var r = recur().first().dayOfMonth().first().hour().first().minute().first().second();
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-01T00:00:00Z'),
					new Date('2012-02-01T00:00:00Z'),
					new Date('2012-03-01T00:00:00Z'),
					new Date('2012-04-01T00:00:00Z'),
					new Date('2012-05-01T00:00:00Z'),
					new Date('2012-06-01T00:00:00Z'),
					new Date('2012-07-01T00:00:00Z'),
					new Date('2012-08-01T00:00:00Z'),
					new Date('2012-09-01T00:00:00Z'),
					new Date('2012-10-01T00:00:00Z'),
					new Date('2012-11-01T00:00:00Z'),
					new Date('2012-12-01T00:00:00Z')
				];

				var l = later().get(r, 12, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

			it('should find the last second of every month', function() {
				this.timeout(1);
				var r = recur().last().dayOfMonth().last().hour().last().minute().last().second();
				var start = new Date('2012-01-01T00:00:00Z');
				var expected = [
					new Date('2012-01-31T23:59:59Z'),
					new Date('2012-02-29T23:59:59Z'),
					new Date('2012-03-31T23:59:59Z'),
					new Date('2012-04-30T23:59:59Z'),
					new Date('2012-05-31T23:59:59Z'),
					new Date('2012-06-30T23:59:59Z'),
					new Date('2012-07-31T23:59:59Z'),
					new Date('2012-08-31T23:59:59Z'),
					new Date('2012-09-30T23:59:59Z'),
					new Date('2012-10-31T23:59:59Z'),
					new Date('2012-11-30T23:59:59Z'),
					new Date('2012-12-31T23:59:59Z')
				];

				var l = later().get(r, 12, start);
				for (var i = 0, len = l.length; i < len; i++) {
					l[i].getTime().should.eql(expected[i].getTime());
				}
			});

		});


	});
});