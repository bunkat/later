/*var schedule = require('../lib/schedule');
var should = require('should');

describe('Schedule', function() {
	
	describe('onTime', function() {
		
		it('should create a single time restriction with valid input', function() {
			var s = schedule().onTimes('8:15 am GMT');
			s.time.should.eql([['08:15:00','08:15:00']]);
		});

		it('should create a time range restriction with valid input', function() {
			var s = schedule().onTimes('8:15 pm GMT-0800', '6:15 am GMT-0800');
			s.time.should.eql([['04:15:00','14:15:00']]);
		});


	});

	describe('on', function() {
		
		it('should create a single minute restriction with valid input', function() {
			var s = schedule().onMins(5);
			s.min.should.eql([[5,5]]);
		});

		it('should create a minute range restriction with valid input', function() {
			var s = schedule().onMins(5,10);
			s.min.should.eql([[5,10]]);
		});

		it('should allow multiple restrictions to be chained together', function() {
			var s = schedule().onMins(5,10).onMins(15,10);
			s.min.should.eql([[5,10],[10,15]]);
		});

		it('should return min on non number input', function() {
			var s = schedule().onMins('foo');
			s.min.should.eql([[0,0]]);
		});

		it('should return min on input too small', function() {
			var s = schedule().onMins(-1);
			s.min.should.eql([[0,0]]);
		});

		it('should return max on input too large', function() {
			var s = schedule().onMins(61);
			s.min.should.eql([[59,59]]);
		});

		it('should return max on input too large', function() {
			var s = schedule().onMins(61, 5);
			s.min.should.eql([[5,59]]);
		});

	});

});*/