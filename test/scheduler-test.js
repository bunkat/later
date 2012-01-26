var scheduler = require('../lib/scheduler');
var schedule = require('../lib/schedule');
var should = require('should');

describe('Scheduler', function() {

	it('should pass all of the tests', function () {
		var s = scheduler();

		for(var key in tests) {
			var test = tests[key];
			var actual = s.getNext(test.sched, test.count, test.start);
			
			if (actual.getTime() != test.expected.getTime()) {
				console.log(test.name);
			}

			actual.should.eql(test.expected);
		}

	});

	var tests = [
		
		// start of years tests
		{ 
		  name: 	'years is valid',
		  sched:    schedule().onYears(2012),
		  start:    new Date('2012-02-28T00:00:05Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T00:00:05Z')
		},{ 
		  name: 	'years in future',
		  sched:    schedule().onYears(2013),
		  start:    new Date('2012-02-28T23:59:00Z'),
		  count: 	1,
		  expected: new Date('2013-01-01T00:00:00Z')
		},

		// start of days of year tests
		{ 
		  name: 	'days of year is valid',
		  sched:    schedule().onDaysOfYear(15),
		  start:    new Date('2012-01-15T05:00:05Z'),
		  count: 	1,
		  expected: new Date('2012-01-15T05:00:05Z')
		},{ 
		  name: 	'days of year in future',
		  sched:    schedule().onDaysOfYear(15),
		  start:    new Date('2012-01-10T23:59:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-15T00:00:00Z')
		},{ 
		  name: 	'days of year in future crossing month',
		  sched:    schedule().onDaysOfYear(45),
		  start:    new Date('2012-01-10T23:59:00Z'),
		  count: 	1,
		  expected: new Date('2012-02-14T00:00:00Z')
		},{ 
		  name: 	'days of year in past crossing year',
		  sched:    schedule().onDaysOfYear(15),
		  start:    new Date('2012-01-20T23:59:00Z'),
		  count: 	1,
		  expected: new Date('2013-01-15T00:00:00Z')
		},{ 
		  name: 	'last day of year',
		  sched:    schedule().onLastDayOfYear(),
		  start:    new Date('2012-01-20T23:59:00Z'),
		  count: 	1,
		  expected: new Date('2012-12-31T00:00:00Z')
		},

		// start of months tests
		{ 
		  name: 	'months is valid',
		  sched:    schedule().onMonths(2),
		  start:    new Date('2012-02-28T00:00:05Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T00:00:05Z')
		},{ 
		  name: 	'months in future',
		  sched:    schedule().onMonths(5),
		  start:    new Date('2012-02-28T23:59:00Z'),
		  count: 	1,
		  expected: new Date('2012-05-01T00:00:00Z')
		},{ 
		  name: 	'months in past crossing year',
		  sched:    schedule().onMonths(5),
		  start:    new Date('2012-12-31T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2013-05-01T00:00:00Z')
		},

		// start of week of month tests
		{ 
		  name: 	'week of month is valid',
		  sched:    schedule().onWeeksOfMonth(2),
		  start:    new Date('2012-01-11T05:05:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-11T05:05:00Z')
		},{ 
		  name: 	'week of month in future',
		  sched:    schedule().onWeeksOfMonth(2),
		  start:    new Date('2012-02-02T02:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-02-05T00:00:00Z')
		},{ 
		  name: 	'last week of month',
		  sched:    schedule().onLastWeekOfMonth(),
		  start:    new Date('2012-02-04T02:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-02-26T00:00:00Z')
		},{ 
		  name: 	'week of month in past crossing month',
		  sched:    schedule().onWeeksOfMonth(2),
		  start:    new Date('2012-01-28T11:34:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-05T00:00:00Z')
		},{ 
		  name: 	'week of month in past crossing year',
		  sched:    schedule().onWeeksOfMonth(2),
		  start:    new Date('2011-12-29T12:14:15Z'),
		  count: 	1,
		  expected: new Date('2012-01-08T00:00:00Z')
		},{ 
		  name: 	'week of month in future on leap day',
		  sched:    schedule().onWeeksOfMonth(5),
		  start:    new Date('2012-02-20T23:22:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-26T00:00:00Z')
		},

		// start of day of month tests
		{ 
		  name: 	'day of month is valid',
		  sched:    schedule().onDaysOfMonth(4),
		  start:    new Date('2012-01-04T05:05:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-04T05:05:00Z')
		},{ 
		  name: 	'day of month in future',
		  sched:    schedule().onDaysOfMonth(4),
		  start:    new Date('2012-01-02T02:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-04T00:00:00Z')
		},{ 
		  name: 	'day of month in past crossing month',
		  sched:    schedule().onDaysOfMonth(4),
		  start:    new Date('2012-01-27T11:34:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-04T00:00:00Z')
		},{ 
		  name: 	'day of month in past crossing year',
		  sched:    schedule().onDaysOfMonth(4),
		  start:    new Date('2011-12-29T12:14:15Z'),
		  count: 	1,
		  expected: new Date('2012-01-04T00:00:00Z')
		},{ 
		  name: 	'day of month in past crossing leap year',
		  sched:    schedule().onDaysOfMonth(4),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: new Date('2012-03-04T00:00:00Z')
		},

		// start of day instance of month tests
		{ 
		  name: 	'day instance of month is valid',
		  sched:    schedule().onDayInstancesOfMonth(2),
		  start:    new Date('2012-01-11T05:05:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-11T05:05:00Z')
		},{ 
		  name: 	'day instance of month in future',
		  sched:    schedule().onDayInstancesOfMonth(2),
		  start:    new Date('2012-01-04T02:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-08T00:00:00Z')
		},{ 
		  name: 	'last day instance of month',
		  sched:    schedule().onLastDayInstanceOfMonth(),
		  start:    new Date('2012-01-04T02:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-25T00:00:00Z')
		},{ 
		  name: 	'day instance of month in past crossing month',
		  sched:    schedule().onDayInstancesOfMonth(2),
		  start:    new Date('2012-01-17T11:34:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-08T00:00:00Z')
		},{ 
		  name: 	'day instance of month in past crossing year',
		  sched:    schedule().onDayInstancesOfMonth(2),
		  start:    new Date('2011-12-29T12:14:15Z'),
		  count: 	1,
		  expected: new Date('2012-01-08T00:00:00Z')
		},{ 
		  name: 	'day instance of month in future on leap day',
		  sched:    schedule().onDayInstancesOfMonth(5),
		  start:    new Date('2012-02-20T23:22:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-29T00:00:00Z')
		},

		// start of day of week tests
		{ 
		  name: 	'day of week is valid',
		  sched:    schedule().onDaysOfWeek(3),
		  start:    new Date('2012-01-04T05:05:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-04T05:05:00Z')
		},{ 
		  name: 	'day of week in future',
		  sched:    schedule().onDaysOfWeek(3),
		  start:    new Date('2012-01-02T02:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-01-04T00:00:00Z')
		},{ 
		  name: 	'day of week in past crossing week',
		  sched:    schedule().onDaysOfWeek(3),
		  start:    new Date('2012-01-05T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-01-11T00:00:00Z')
		},{ 
		  name: 	'day of week in past crossing month',
		  sched:    schedule().onDaysOfWeek(3),
		  start:    new Date('2012-01-27T11:34:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-01T00:00:00Z')
		},{ 
		  name: 	'day of week in past crossing year',
		  sched:    schedule().onDaysOfWeek(3),
		  start:    new Date('2011-12-29T12:14:15Z'),
		  count: 	1,
		  expected: new Date('2012-01-04T00:00:00Z')
		},{ 
		  name: 	'day of week in past crossing leap year',
		  sched:    schedule().onDaysOfWeek(3),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-29T00:00:00Z')
		},

		// start of times tests
		{ 
		  name: 	'times is valid',
		  sched:    schedule().onTimes('5:05 am GMT'),
		  start:    new Date('2012-02-28T05:05:00Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T05:05:00Z')
		},{ 
		  name: 	'times in future',
		  sched:    schedule().onTimes('5:05 am GMT'),
		  start:    new Date('2012-05-28T02:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-05-28T05:05:00Z')
		},{ 
		  name: 	'times in past crossing day',
		  sched:    schedule().onTimes('5:05 am GMT'),
		  start:    new Date('2012-02-25T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-26T05:05:00Z')
		},{ 
		  name: 	'times in past crossing month',
		  sched:    schedule().onTimes('5:05 am GMT'),
		  start:    new Date('2012-01-31T11:34:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-01T05:05:00Z')
		},{ 
		  name: 	'times in past crossing year',
		  sched:    schedule().onTimes('5:05 am GMT'),
		  start:    new Date('2012-12-31T12:14:15Z'),
		  count: 	1,
		  expected: new Date('2013-01-01T05:05:00Z')
		},{ 
		  name: 	'times in past crossing leap year',
		  sched:    schedule().onTimes('5:05 am GMT'),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-29T05:05:00Z')
		},

		// start of hours tests
		{ 
		  name: 	'hours is valid',
		  sched:    schedule().onHours(5),
		  start:    new Date('2012-02-28T05:05:05Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T05:05:05Z')
		},{ 
		  name: 	'hours in future',
		  sched:    schedule().onHours(5),
		  start:    new Date('2012-05-28T02:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-05-28T05:00:00Z')
		},{ 
		  name: 	'hours in past crossing day',
		  sched:    schedule().onHours(5),
		  start:    new Date('2012-02-25T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-26T05:00:00Z')
		},{ 
		  name: 	'hours in past crossing month',
		  sched:    schedule().onHours(5),
		  start:    new Date('2012-01-31T11:34:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-01T05:00:00Z')
		},{ 
		  name: 	'hours in past crossing year',
		  sched:    schedule().onHours(5),
		  start:    new Date('2012-12-31T12:14:15Z'),
		  count: 	1,
		  expected: new Date('2013-01-01T05:00:00Z')
		},{ 
		  name: 	'hours in past crossing leap year',
		  sched:    schedule().onHours(5),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-29T05:00:00Z')
		},

		// start of minutes tests
		{ 
		  name: 	'minutes is valid',
		  sched:    schedule().onMins(5),
		  start:    new Date('2012-02-28T00:05:05Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T00:05:05Z')
		},{ 
		  name: 	'minutes in future',
		  sched:    schedule().onMins(5),
		  start:    new Date('2012-05-28T13:02:00Z'),
		  count: 	1,
		  expected: new Date('2012-05-28T13:05:00Z')
		},{ 
		  name: 	'minutes in past crossing hour',
		  sched:    schedule().onMins(5),
		  start:    new Date('2012-02-28T22:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T23:05:00Z')
		},{ 
		  name: 	'minutes in past crossing day',
		  sched:    schedule().onMins(5),
		  start:    new Date('2012-02-25T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-26T00:05:00Z')
		},{ 
		  name: 	'minutes in past crossing month',
		  sched:    schedule().onMins(5),
		  start:    new Date('2012-01-31T23:34:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-01T00:05:00Z')
		},{ 
		  name: 	'minutes in past crossing year',
		  sched:    schedule().onMins(5),
		  start:    new Date('2012-12-31T23:14:15Z'),
		  count: 	1,
		  expected: new Date('2013-01-01T00:05:00Z')
		},{ 
		  name: 	'minutes in past crossing leap year',
		  sched:    schedule().onMins(5),
		  start:    new Date('2012-02-28T23:22:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-29T00:05:00Z')
		},

		// start of seconds tests
		{ 
		  name: 	'seconds is valid',
		  sched:    schedule().onSecs(5),
		  start:    new Date('2012-02-28T00:00:05Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T00:00:05Z')
		},{ 
		  name: 	'seconds in future',
		  sched:    schedule().onSecs(5),
		  start:    new Date('2012-02-28T23:59:00Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T23:59:05Z')
		},{ 
		  name: 	'seconds in past crossing minute',
		  sched:    schedule().onSecs(5),
		  start:    new Date('2012-02-28T22:00:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T22:01:05Z')
		},{ 
		  name: 	'seconds in past crossing hour',
		  sched:    schedule().onSecs(5),
		  start:    new Date('2012-02-28T22:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-28T23:00:05Z')
		},{ 
		  name: 	'seconds in past crossing day',
		  sched:    schedule().onSecs(5),
		  start:    new Date('2012-02-25T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-26T00:00:05Z')
		},{ 
		  name: 	'seconds in past crossing month',
		  sched:    schedule().onSecs(5),
		  start:    new Date('2012-01-31T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-01T00:00:05Z')
		},{ 
		  name: 	'seconds in past crossing year',
		  sched:    schedule().onSecs(5),
		  start:    new Date('2012-12-31T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2013-01-01T00:00:05Z')
		},{ 
		  name: 	'seconds in past crossing leap year',
		  sched:    schedule().onSecs(5),
		  start:    new Date('2012-02-28T23:59:15Z'),
		  count: 	1,
		  expected: new Date('2012-02-29T00:00:05Z')
		},
	];

});