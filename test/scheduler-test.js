var scheduler = require('../lib/later');
//var schedule = require('../lib/schedule');
var recur = require('../lib/recur');
var should = require('should');

describe('Scheduler', function() {

	it('it should be based on the offset', function () {
		
		var r = recur().on(8).hour();
		scheduler().getNext(r);

	});



/*
	it('on should schedule a single minute constraint', function() {
		
		var s1 = recur().on(2).minute();
		s1.schedules[0].m.should.eql([2]);

		var s2 = recur().on(5).minute();
		s1.schedules[0].m.should.eql([2]);
		s2.schedules[0].m.should.eql([5]);
	});

	it('on first should schedule a single minute constraint', function() {
		
		var s = recur().first().minute();
		s.schedules[0].m.should.eql([0]);
	});

	it('and should create a composite schedule', function() {
		
		var s = recur().first().minute().and().on(2).minute();
		s.schedules[0].m.should.eql([0]);
		s.schedules[1].m.should.eql([2]);
	});

	it('except should create an exception schedule', function() {
		
		var s = recur().every(15).minute().except().on(30).minute();
		s.schedules[0].m.should.eql([0, 15, 30, 45]);
		s.exceptions[0].m.should.eql([30]);
	});

	it('on last should schedule a single minute constraint', function() {
		
		var s = recur().last().minute();
		s.schedules[0].m.should.eql([59]);
	});

	it('on should schedule multiple minute constraints', function() {
		
		var s = recur().on(2, 5, 7).minute();
		s.schedules[0].m.should.eql([2,5,7]);
	});

	it('every should schedule multiple minute range constraints', function() {
		
		var s = recur().every(15).minute();
		s.schedules[0].m.should.eql([0,15,30,45]);
	});

	it('between should modify an every constraint', function() {
		
		var s = recur().every(15).minute().between(5, 40);
		s.schedules[0].m.should.eql([5,20,35]);
	});

	it('through should schedule a minute range constraint', function() {
		
		var s = recur().every().minute().between(2, 7);
		s.schedules[0].m.should.eql([2,3,4,5,6,7]);
	});

	it('from and to should apply constraints', function() {
		
		var s = recur().every().minute().between(2, 7).on(2).hour().from('05:00').to('09:00');
		s.schedules[0].m.should.eql([2,3,4,5,6,7]);
		s.schedules[0].h.should.eql([2]);
		s.schedules[0].from.should.eql(['05:00']);
		s.schedules[0].to.should.eql(['09:00']);
	});

	it('at should apply constraints', function() {
		
		var s = recur().every().minute().between(2, 7).on(2).hour().at('05:00');
		s.schedules[0].m.should.eql([2,3,4,5,6,7]);
		s.schedules[0].h.should.eql([2]);
		s.schedules[0].from.should.eql(['05:00']);
		s.schedules[0].to.should.eql(['05:00']);
	});


	it('from and to should apply constraints', function() {
		
		var s = recur().every().minute().between(2, 7).every(2).hour().from('05:00').to('09:00');
	});

	it('getNext should pass all of the tests', function () {
		var s, i = 0;
		console.log('\nRunning scheduler tests...\n');

		for(var key in tests) {
			var test = tests[key];
			s = scheduler(test.res);
			var actual = s.get(test.sched, test.count, test.start);
			
			console.log('Test ' + i++ + ': ' + test.name);
			actual.should.eql(test.expected);
		}

	});

	var tests = [
		
		// start of years tests
		{ 
		  name: 	'years is valid',
		  sched:    recur().on(2012).year(),
		  start:    new Date('2012-02-28T00:00:05Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T00:00:05Z')]
		},{ 
		  name: 	'years in future',
		  sched:    recur().on(2013).year(),
		  start:    new Date('2012-02-28T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2013-01-01T00:00:00Z')]
		},

		// start of week of year tests (ISO Week Number)
		{ 
		  name: 	'weeks of year is valid 1',
		  sched:    recur().on(53).weekOfYear(),
		  start:    new Date('2005-01-01T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2005-01-01T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 2',
		  sched:    recur().on(53).weekOfYear(),
		  start:    new Date('2005-01-02T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2005-01-02T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 3',
		  sched:    recur().on(52).weekOfYear(),
		  start:    new Date('2005-12-31T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2005-12-31T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 4',
		  sched:    recur().on(1).weekOfYear(),
		  start:    new Date('2007-01-01T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2007-01-01T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 5',
		  sched:    recur().on(52).weekOfYear(),
		  start:    new Date('2007-12-30T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2007-12-30T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 6',
		  sched:    recur().on(1).weekOfYear(),
		  start:    new Date('2007-12-31T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2007-12-31T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 7',
		  sched:    recur().on(1).weekOfYear(),
		  start:    new Date('2008-01-01T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2008-01-01T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 8',
		  sched:    recur().on(52).weekOfYear(),
		  start:    new Date('2008-12-28T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2008-12-28T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 9',
		  sched:    recur().on(1).weekOfYear(),
		  start:    new Date('2008-12-29T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2008-12-29T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 10',
		  sched:    recur().on(53).weekOfYear(),
		  start:    new Date('2009-12-31T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2009-12-31T00:00:00Z')]
		},{ 
		  name: 	'weeks of year is valid 11',
		  sched:    recur().on(53).weekOfYear(),
		  start:    new Date('2010-01-03T00:00:00Z'),
		  count: 	1,
		  expected: [new Date('2010-01-03T00:00:00Z')]
		},{ 
		  name: 	'last week of year',
		  sched:    recur().last().weekOfYear(),
		  start:    new Date('2012-04-06T00:05:05Z'),
		  count: 	1,
		  expected: [new Date('2012-12-24T00:00:00Z')]
		},{ 
		  name: 	'weeks of year in future',
		  sched:    recur().on(3).weekOfYear(),
		  start:    new Date('2012-01-10T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-16T00:00:00Z')]
		},{ 
		  name: 	'weeks of year in future crossing month',
		  sched:    recur().on(6).weekOfYear(),
		  start:    new Date('2012-01-10T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2012-02-06T00:00:00Z')]
		},{ 
		  name: 	'weeks of year in past crossing year with 52 weeks',
		  sched:    recur().on(4).weekOfYear(),
		  start:    new Date('2007-02-07T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2008-01-21T00:00:00Z')]
		},{ 
		  name: 	'weeks of year in past crossing year with 53 weeks',
		  sched:    recur().on(4).weekOfYear(),
		  start:    new Date('2005-02-07T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2006-01-23T00:00:00Z')]
		},

		// start of days of year tests
		{ 
		  name: 	'days of year is valid',
		  sched:    recur().on(15).dayOfYear(),
		  start:    new Date('2012-01-15T05:00:05Z'),
		  count: 	1,
		  expected: [new Date('2012-01-15T05:00:05Z')]
		},{ 
		  name: 	'days of year in future',
		  sched:    recur().on(15).dayOfYear(),
		  start:    new Date('2012-01-10T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-15T00:00:00Z')]
		},{ 
		  name: 	'days of year in future crossing month',
		  sched:    recur().on(45).dayOfYear(),
		  start:    new Date('2012-01-10T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2012-02-14T00:00:00Z')]
		},{ 
		  name: 	'days of year in past crossing year',
		  sched:    recur().on(15).dayOfYear(),
		  start:    new Date('2012-01-20T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2013-01-15T00:00:00Z')]
		},{ 
		  name: 	'last day of year',
		  sched:    recur().last().dayOfYear(),
		  start:    new Date('2012-01-20T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2012-12-31T00:00:00Z')]
		},

		// start of months tests
		{ 
		  name: 	'months is valid',
		  sched:    recur().on(1).month(),
		  start:    new Date('2012-02-28T00:00:05Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T00:00:05Z')]
		},{ 
		  name: 	'months in future',
		  sched:    recur().on(4).month(),
		  start:    new Date('2012-02-28T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2012-05-01T00:00:00Z')]
		},{ 
		  name: 	'months in past crossing year',
		  sched:    recur().on(4).month(),
		  start:    new Date('2012-12-31T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2013-05-01T00:00:00Z')]
		},{ 
		  name: 	'last month of year',
		  sched:    recur().last().month(),
		  start:    new Date('2012-02-31T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-12-01T00:00:00Z')]
		},

		// start of week of month tests
		{ 
		  name: 	'week of month is valid',
		  sched:    recur().on(2).weekOfMonth(),
		  start:    new Date('2012-01-11T05:05:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-11T05:05:00Z')]
		},{ 
		  name: 	'week of month in future',
		  sched:    recur().on(2).weekOfMonth(),
		  start:    new Date('2012-02-02T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-02-05T00:00:00Z')]
		},{ 
		  name: 	'last week of month',
		  sched:    recur().last().weekOfMonth(),
		  start:    new Date('2012-02-04T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-02-26T00:00:00Z')]
		},{ 
		  name: 	'week of month in past crossing month',
		  sched:    recur().on(2).weekOfMonth(),
		  start:    new Date('2012-01-28T11:34:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-05T00:00:00Z')]
		},{ 
		  name: 	'week of month in past crossing year',
		  sched:    recur().on(2).weekOfMonth(),
		  start:    new Date('2011-12-29T12:14:15Z'),
		  count: 	1,
		  expected: [new Date('2012-01-08T00:00:00Z')]
		},{ 
		  name: 	'week of month in future on leap day',
		  sched:    recur().on(5).weekOfMonth(),
		  start:    new Date('2012-02-20T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-26T00:00:00Z')]
		},

		// start of day of month tests
		{ 
		  name: 	'day of month is valid',
		  sched:    recur().on(4).dayOfMonth(),
		  start:    new Date('2012-01-04T05:05:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-04T05:05:00Z')]
		},{ 
		  name: 	'day of month in future',
		  sched:    recur().on(4).dayOfMonth(),
		  start:    new Date('2012-01-02T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-04T00:00:00Z')]
		},{ 
		  name: 	'day of month in past crossing month',
		  sched:    recur().on(4).dayOfMonth(),
		  start:    new Date('2012-01-27T11:34:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-04T00:00:00Z')]
		},{ 
		  name: 	'day of month in past crossing year',
		  sched:    recur().on(4).dayOfMonth(),
		  start:    new Date('2011-12-29T12:14:15Z'),
		  count: 	1,
		  expected: [new Date('2012-01-04T00:00:00Z')]
		},{ 
		  name: 	'day of month in past crossing leap year',
		  sched:    recur().on(4).dayOfMonth(),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-03-04T00:00:00Z')]
		},{ 
		  name: 	'last day of month',
		  sched:    recur().last().dayOfMonth(),
		  start:    new Date('2012-02-14T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-29T00:00:00Z')]
		},

		// start of day instance of month tests
		{ 
		  name: 	'day instance of month is valid',
		  sched:    recur().on(1).dayOfWeekCount(),
		  start:    new Date('2012-01-11T05:05:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-11T05:05:00Z')]
		},{ 
		  name: 	'day instance of month in future',
		  sched:    recur().on(1).dayOfWeekCount(),
		  start:    new Date('2012-01-04T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-08T00:00:00Z')]
		},{ 
		  name: 	'last day instance of month',
		  sched:    recur().last().dayOfWeekCount(),
		  start:    new Date('2012-01-04T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-25T00:00:00Z')]
		},{ 
		  name: 	'day instance of month in past crossing month',
		  sched:    recur().on(1).dayOfWeekCount(),
		  start:    new Date('2012-01-17T11:34:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-08T00:00:00Z')]
		},{ 
		  name: 	'day instance of month in past crossing year',
		  sched:    recur().on(1).dayOfWeekCount(),
		  start:    new Date('2011-12-29T12:14:15Z'),
		  count: 	1,
		  expected: [new Date('2012-01-08T00:00:00Z')]
		},{ 
		  name: 	'day instance of month in future on leap day',
		  sched:    recur().on(4).dayOfWeekCount(),
		  start:    new Date('2012-02-20T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-29T00:00:00Z')]
		},

		// start of day of week tests
		{ 
		  name: 	'day of week is valid',
		  sched:    recur().on(3).dayOfWeek(),
		  start:    new Date('2012-01-04T05:05:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-04T05:05:00Z')]
		},{ 
		  name: 	'day of week in future',
		  sched:    recur().on(3).dayOfWeek(),
		  start:    new Date('2012-01-02T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-01-04T00:00:00Z')]
		},{ 
		  name: 	'day of week in past crossing week',
		  sched:    recur().on(3).dayOfWeek(),
		  start:    new Date('2012-01-05T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-01-11T00:00:00Z')]
		},{ 
		  name: 	'day of week in past crossing month',
		  sched:    recur().on(3).dayOfWeek(),
		  start:    new Date('2012-01-27T11:34:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-01T00:00:00Z')]
		},{ 
		  name: 	'day of week in past crossing year',
		  sched:    recur().on(3).dayOfWeek(),
		  start:    new Date('2011-12-29T12:14:15Z'),
		  count: 	1,
		  expected: [new Date('2012-01-04T00:00:00Z')]
		},{ 
		  name: 	'day of week in past crossing leap year',
		  sched:    recur().on(3).dayOfWeek(),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-29T00:00:00Z')]
		},{ 
		  name: 	'last day of week',
		  sched:    recur().last().dayOfWeek(),
		  start:    new Date('2012-01-09T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-01-14T00:00:00Z')]
		},

		// start of times tests
		{ 
		  name: 	'times is valid',
		  sched:    recur().at('05:05:00'),
		  start:    new Date('2012-02-28T05:05:00Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T05:05:00Z')]
		},{ 
		  name: 	'times in future',
		  sched:    recur().at('05:05:00'),
		  start:    new Date('2012-05-28T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-05-28T05:05:00Z')]
		},{ 
		  name: 	'times in past crossing day',
		  sched:    recur().at('05:05:00'),
		  start:    new Date('2012-02-25T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-26T05:05:00Z')]
		},{ 
		  name: 	'times in past crossing month',
		  sched:    recur().at('05:05:00'),
		  start:    new Date('2012-01-31T11:34:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-01T05:05:00Z')]
		},{ 
		  name: 	'times in past crossing year',
		  sched:    recur().at('05:05:00'),
		  start:    new Date('2012-12-31T12:14:15Z'),
		  count: 	1,
		  expected: [new Date('2013-01-01T05:05:00Z')]
		},{ 
		  name: 	'times in past crossing leap year',
		  sched:    recur().at('05:05:00'),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-29T05:05:00Z')]
		},

		// start of hours tests
		{ 
		  name: 	'hours is valid',
		  sched:    recur().on(5).hour(),
		  start:    new Date('2012-02-28T05:05:05Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T05:05:05Z')]
		},{ 
		  name: 	'hours in future',
		  sched:    recur().on(5).hour(),
		  start:    new Date('2012-05-28T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-05-28T05:00:00Z')]
		},{ 
		  name: 	'last',
		  sched:    recur().last().hour(),
		  start:    new Date('2012-05-28T02:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-05-28T23:00:00Z')]
		},{ 
		  name: 	'hours in past crossing day',
		  sched:    recur().on(5).hour(),
		  start:    new Date('2012-02-25T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-26T05:00:00Z')]
		},{ 
		  name: 	'hours in past crossing month',
		  sched:    recur().on(5).hour(),
		  start:    new Date('2012-01-31T11:34:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-01T05:00:00Z')]
		},{ 
		  name: 	'hours in past crossing year',
		  sched:    recur().on(5).hour(),
		  start:    new Date('2012-12-31T12:14:15Z'),
		  count: 	1,
		  expected: [new Date('2013-01-01T05:00:00Z')]
		},{ 
		  name: 	'hours in past crossing leap year',
		  sched:    recur().on(5).hour(),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-29T05:00:00Z')]
		},{ 
		  name: 	'range of hours is valid',
		  sched:    recur().every(1).hour().between(5, 8),
		  start:    new Date('2012-02-28T06:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T06:22:15Z')]
		},{ 
		  name: 	'range of hours is future invalid',
		  sched:    recur().every(1).hour().between(5, 8),
		  start:    new Date('2012-02-28T03:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T05:00:00Z')]
		},{ 
		  name: 	'range of hours is past invalid',
		  sched:    recur().every(1).hour().between(5, 8),
		  start:    new Date('2012-02-28T09:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-29T05:00:00Z')]
		},{ 
		  name: 	'every 2 hours',
		  sched:    recur().every(2).hour(),
		  res: 		3600,
		  start:    new Date('2012-02-28T09:22:15Z'),
		  count: 	3,
		  expected: [new Date('2012-02-28T10:00:00Z'),
		  			 new Date('2012-02-28T12:00:00Z'),
		  			 new Date('2012-02-28T14:00:00Z')]
		},

		// start of minutes tests
		{ 
		  name: 	'minutes is valid',
		  sched:    recur().on(5).minute(),
		  start:    new Date('2012-02-28T00:05:05Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T00:05:05Z')]
		},{ 
		  name: 	'minutes in future',
		  sched:    recur().on(5).minute(),
		  start:    new Date('2012-05-28T13:02:00Z'),
		  count: 	1,
		  expected: [new Date('2012-05-28T13:05:00Z')]
		},{ 
		  name: 	'minutes in past crossing hour',
		  sched:    recur().on(5).minute(),
		  start:    new Date('2012-02-28T22:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T23:05:00Z')]
		},{ 
		  name: 	'minutes in past crossing day',
		  sched:    recur().on(5).minute(),
		  start:    new Date('2012-02-25T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-26T00:05:00Z')]
		},{ 
		  name: 	'minutes in past crossing month',
		  sched:    recur().on(5).minute(),
		  start:    new Date('2012-01-31T23:34:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-01T00:05:00Z')]
		},{ 
		  name: 	'minutes in past crossing year',
		  sched:    recur().on(5).minute(),
		  start:    new Date('2012-12-31T23:14:15Z'),
		  count: 	1,
		  expected: [new Date('2013-01-01T00:05:00Z')]
		},{ 
		  name: 	'minutes in past crossing leap year',
		  sched:    recur().on(5).minute(),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-29T00:05:00Z')]
		},{ 
		  name: 	'minutes 7 and 14 on seconds 5',
		  sched:    recur().on(7).minute().on(14).minute().on(5).second(),
		  start:    new Date('2012-06-12T14:08:15Z'),
		  count: 	2,
		  expected: [new Date('2012-06-12T14:14:05Z'),
		  			 new Date('2012-06-12T15:07:05Z')]
		},{ 
		  name: 	'every 5 minutes',
		  sched:    recur().every(5).minute(),
		  res: 		60,
		  start:    new Date('2012-02-28T09:20:15Z'),
		  count: 	3,
		  expected: [new Date('2012-02-28T09:20:15Z'),
		  			 new Date('2012-02-28T09:25:00Z'),
		  			 new Date('2012-02-28T09:30:00Z')]
		},{ 
		  name: 	'every 5 minutes stating on minute 2',
		  sched:    recur().every(5).minute().startingOn(2),
		  res: 		60,
		  start:    new Date('2012-02-28T09:20:15Z'),
		  count: 	3,
		  expected: [new Date('2012-02-28T09:22:00Z'),
		  			 new Date('2012-02-28T09:27:00Z'),
		  			 new Date('2012-02-28T09:32:00Z')]
		},{ 
		  name: 	'every 5 minutes between minutes 4 and 16',
		  sched:    recur().every(5).minute().between(4, 16),
		  res: 		60,
		  start:    new Date('2012-02-28T09:10:15Z'),
		  count: 	3,
		  expected: [new Date('2012-02-28T09:14:00Z'),
		  			 new Date('2012-02-28T10:04:00Z'),
		  			 new Date('2012-02-28T10:09:00Z')]
		},{ 
		  name: 	'every 5 minutes on seconds 00',
		  sched:    recur().every(5).minute().on(0).second(),
		  start:    new Date('2012-02-28T09:20:15Z'),
		  count: 	3,
		  expected: [new Date('2012-02-28T09:25:00Z'),
		  			 new Date('2012-02-28T09:30:00Z'),
		  			 new Date('2012-02-28T09:35:00Z')]
		},{ 
		  name: 	'every 5 minutes on seconds 00 except 30',
		  sched:    recur().every(5).minute().on(0).second().except().on(30).minute(),
		  start:    new Date('2012-02-28T09:20:15Z'),
		  count: 	3,
		  expected: [new Date('2012-02-28T09:25:00Z'),
		  			 new Date('2012-02-28T09:35:00Z'),
		  			 new Date('2012-02-28T09:40:00Z')]
		},

		// start of seconds tests
		{ 
		  name: 	'seconds is valid',
		  sched:    recur().on(5).second(),
		  start:    new Date('2012-02-28T00:00:05Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T00:00:05Z')]
		},{ 
		  name: 	'seconds in future',
		  sched:    recur().on(5).second(),
		  start:    new Date('2012-02-28T23:59:00Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T23:59:05Z')]
		},{ 
		  name: 	'seconds in past crossing minute',
		  sched:    recur().on(5).second(),
		  start:    new Date('2012-02-28T22:00:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T22:01:05Z')]
		},{ 
		  name: 	'seconds in past crossing hour',
		  sched:    recur().on(5).second(),
		  start:    new Date('2012-02-28T22:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-28T23:00:05Z')]
		},{ 
		  name: 	'seconds in past crossing day',
		  sched:    recur().on(5).second(),
		  start:    new Date('2012-02-25T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-26T00:00:05Z')]
		},{ 
		  name: 	'seconds in past crossing month',
		  sched:    recur().on(5).second(),
		  start:    new Date('2012-01-31T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-01T00:00:05Z')]
		},{ 
		  name: 	'seconds in past crossing year',
		  sched:    recur().on(5).second(),
		  start:    new Date('2012-12-31T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2013-01-01T00:00:05Z')]
		},{ 
		  name: 	'seconds in past crossing leap year',
		  sched:    recur().on(5).second(),
		  start:    new Date('2012-02-28T23:59:15Z'),
		  count: 	1,
		  expected: [new Date('2012-02-29T00:00:05Z')]
		},

	];
*/
});