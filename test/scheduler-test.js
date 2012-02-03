var scheduler = require('../lib/later');
//var schedule = require('../lib/schedule');
var recur = require('../lib/recur');
var should = require('should');

describe('Scheduler', function() {

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
		}

	];

});