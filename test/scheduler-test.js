var scheduler = require('../lib/scheduler');
var schedule = require('../lib/schedule');
var should = require('should');

describe('Scheduler', function() {
			
	it('should work with a single schedule', function() {

		//var s = schedule().onTimes('8:30:15 pm').onDaysOfWeek(3).onMonths(3).onYears(2014);
		//var s = schedule().onDaysOfYear(5).onTimes('8:30 am');
		//var s = schedule().onWeeksOfYear(5).onDaysOfWeek(3).onTimes('8:30 am');
		//var s = schedule().onWeeksOfMonth(6).onDaysOfWeek(1).onTimes('8:30 am');
		//var s = schedule().onDaysOfWeek(1).onDayInstancesOfMonth(2).onTimes('8:30 am');
		//var s = schedule().onTimes('8:30 am');
		//var s = schedule().onLastDayOfMonth().onTimes('8:30 am');
		var s = schedule().onLastDayOfYear().onTimes('8:30 am');

		var next = scheduler(60).getNext(s, 10);

		console.log(next.toLocaleString());

	});

});