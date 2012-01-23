var schedule = require('../lib/schedule').schedule;
var should = require('should');

describe('Schedule', function() {
	
	describe('on', function() {
		
		it('should report error on invalid restriction name', function() {
			var s = schedule().on('foo', 5);
			s.err.should.have.length(1);
		});

		it('should report error on non number input', function() {
			var s = schedule().on('min', 'foo');
			s.err.should.have.length(1);
		});

		it('should report error on input too small', function() {
			var s = schedule().on('min', -1);
			s.err.should.have.length(1);
		});

		it('should report error on input too large', function() {
			var s = schedule().on('min', 61);
			s.err.should.have.length(1);
		});

	});

	describe('atTime', function() {
		
		it('should create a single time restriction with valid input', function() {
			var s = schedule().atTimes('8:15 am GMT-0800');
			s.time.should.eql([['08:15:00','08:15:00']]);
		});


	});

	describe('onMins', function() {
		
		it('should create a single minute restriction with valid input', function() {
			var s = schedule().onMins(5);
			s.min.should.eql([[5,5]]);
		});

		it('should create a minute range restriction with valid input', function() {
			var s = schedule().onMins(5,10);
			s.min.should.eql([[5,10]]);
		});

	});


});