var parser = require('../lib/cron.parser');
var should = require('should');

describe('CronParser', function() {

	describe('seconds', function() {

		it('should parse asterisk to mean any value', function() {
			var p = parser().parse('* * * * * *', true);
			p.schedules[0].should.not.have.ownProperty('s');
		});		

		it('should parse a single value', function() {
			var p = parser().parse('1 * * * * *', true);
			p.schedules[0].should.have.ownProperty('s').and.eql({s: [1]});
		});

		it('should parse multiple values', function() {
			var p = parser().parse('1,5,10 * * * * *', true);
			p.schedules[0].should.have.ownProperty('s').and.eql({s: [1,5,10]});
		});

		it('should parse a range value', function() {
			var p = parser().parse('1-5 * * * * *', true);
			p.schedules[0].should.have.ownProperty('s').and.eql({s: [1,2,3,4,5]});
		});

		it('should parse a range with increment value', function() {
			var p = parser().parse('1-6/2 * * * * *', true);
			p.schedules[0].should.have.ownProperty('s').and.eql({s: [1,3,5]});
		});

		it('should parse an asterisk with increment value', function() {
			var p = parser().parse('*/10 * * * * *', true);
			p.schedules[0].should.have.ownProperty('s').and.eql({s: [0,10,20,30,40,50]});
		});

		it('should parse a zero with increment value', function() {
			var p = parser().parse('0/10 * * * * *', true);
			p.schedules[0].should.have.ownProperty('s').and.eql({s: [0,10,20,30,40,50]});
		});

	});

	describe('minutes', function() {

		it('should parse asterisk to mean any value', function() {
			var p = parser().parse('* * * * * *', true);
			p.schedules[0].should.not.have.ownProperty('m');
		});		

		it('should parse a single value', function() {
			var p = parser().parse('* 1 * * * *', true);
			p.schedules[0].should.have.ownProperty('m').and.eql({m: [1]});
		});

		it('should parse multiple values', function() {
			var p = parser().parse('* 1,5,10 * * * *', true);
			p.schedules[0].should.have.ownProperty('m').and.eql({m: [1,5,10]});
		});

		it('should parse a range value', function() {
			var p = parser().parse('* 1-5 * * * *', true);
			p.schedules[0].should.have.ownProperty('m').and.eql({m: [1,2,3,4,5]});
		});

		it('should parse a range with increment value', function() {
			var p = parser().parse('* 1-6/2 * * * *', true);
			p.schedules[0].should.have.ownProperty('m').and.eql({m: [1,3,5]});
		});

		it('should parse an asterisk with increment value', function() {
			var p = parser().parse('* */20 * * * *', true);
			p.schedules[0].should.have.ownProperty('m').and.eql({m: [0,20,40]});
		});

		it('should parse a 0 with increment value', function() {
			var p = parser().parse('* 0/20 * * * *', true);
			p.schedules[0].should.have.ownProperty('m').and.eql({m: [0,20,40]});
		});

	});

	describe('hours', function() {

		it('should parse asterisk to mean any value', function() {
			var p = parser().parse('* * * * * *', true);
			p.schedules[0].should.not.have.ownProperty('h');
		});		

		it('should parse a single value', function() {
			var p = parser().parse('* * 1 * * *', true);
			p.schedules[0].should.have.ownProperty('h').and.eql({h: [1]});
		});

		it('should parse multiple values', function() {
			var p = parser().parse('* * 1,5,10 * * *', true);
			p.schedules[0].should.have.ownProperty('h').and.eql({h: [1,5,10]});
		});

		it('should parse a range value', function() {
			var p = parser().parse('* * 1-5 * * *', true);
			p.schedules[0].should.have.ownProperty('h').and.eql({h: [1,2,3,4,5]});
		});

		it('should parse a range with increment value', function() {
			var p = parser().parse('* * 1-6/2 * * *', true);
			p.schedules[0].should.have.ownProperty('h').and.eql({h: [1,3,5]});
		});

		it('should parse an asterisk with increment value', function() {
			var p = parser().parse('* * */10 * * *', true);
			p.schedules[0].should.have.ownProperty('h').and.eql({h: [0,10,20]});
		});

		it('should parse a 0 with increment value', function() {
			var p = parser().parse('* * 0/10 * * *', true);
			p.schedules[0].should.have.ownProperty('h').and.eql({h: [0,10,20]});
		});
	
	});

	describe('day of month', function() {

		it('should parse asterisk to mean any value', function() {
			var p = parser().parse('* * * * * *', true);
			p.schedules[0].should.not.have.ownProperty('D');
		});		

		it('should parse ? to mean any value', function() {
			var p = parser().parse('* * * ? * *', true);
			p.schedules[0].should.not.have.ownProperty('D');
		});	

		it('should parse a single value', function() {
			var p = parser().parse('* * * 1 * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [1]});
		});

		it('should parse multiple values', function() {
			var p = parser().parse('* * * 1,5,10 * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [1,5,10]});
		});

		it('should parse a range value', function() {
			var p = parser().parse('* * * 1-5 * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [1,2,3,4,5]});
		});

		it('should parse a range with increment value', function() {
			var p = parser().parse('* * * 1-6/2 * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [1,3,5]});
		});

		it('should parse an asterisk with increment value', function() {
			var p = parser().parse('* * * */10 * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [1,11,21,31]});
		});

		it('should parse last', function() {
			var p = parser().parse('* * * L * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [0]});
		});

		it('should parse a single nearest first weekday', function() {
			var p = parser().parse('* * * 1W * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [1, 2, 3], d:[2,3,4,5,6]});
			p.exceptions[0].should.eql({D: [2], d:[3,4,5,6]});
			p.exceptions[1].should.eql({D: [3], d:[3,4,5,6]});
		});

		it('should parse a single nearest weekday', function() {
			var p = parser().parse('* * * 15W * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [14, 15, 16], d:[2,3,4,5,6]});
			p.exceptions[0].should.eql({D: [14], d:[2,3,4,5]});
			p.exceptions[1].should.eql({D: [16], d:[3,4,5,6]});
		});

		it('should parse multiple single nearest weekday', function() {
			var p = parser().parse('* * * 4W,15W * *', true);
			p.schedules[0].should.have.ownProperty('D').and.eql({D: [3, 4, 5, 14, 15, 16], d:[2,3,4,5,6]});
			p.exceptions[0].should.eql({D: [3], d:[2,3,4,5]});
			p.exceptions[1].should.eql({D: [5], d:[3,4,5,6]});
			p.exceptions[2].should.eql({D: [14], d:[2,3,4,5]});
			p.exceptions[3].should.eql({D: [16], d:[3,4,5,6]});
		});

	});

	describe('months', function() {

		it('should parse asterisk to mean any value', function() {
			var p = parser().parse('* * * * * *', true);
			p.schedules[0].should.not.have.ownProperty('M');
		});		

		it('should parse a single value', function() {
			var p = parser().parse('* * * * 1 *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1]});
		});

		it('should parse multiple values', function() {
			var p = parser().parse('* * * * 1,5,10 *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1,5,10]});
		});

		it('should parse a range value', function() {
			var p = parser().parse('* * * * 1-5 *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1,2,3,4,5]});
		});

		it('should parse a range with increment value', function() {
			var p = parser().parse('* * * * 1-6/2 *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1,3,5]});
		});

		it('should parse an asterisk with increment value', function() {
			var p = parser().parse('* * * * */5 *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1,6,11]});
		});

		it('should parse a single value in words', function() {
			var p = parser().parse('* * * * JAN *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1]});
		});

		it('should parse multiple values in words', function() {
			var p = parser().parse('* * * * JAN,MAY,OCT *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1,5,10]});
		});

		it('should parse a range value in words', function() {
			var p = parser().parse('* * * * JAN-MAY *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1,2,3,4,5]});
		});

		it('should parse a range with increment value in words', function() {
			var p = parser().parse('* * * * JAN-JUN/2 *', true);
			p.schedules[0].should.have.ownProperty('M').and.eql({M: [1,3,5]});
		});

	});

	describe('day of week', function() {

		it('should parse asterisk to mean any value', function() {
			var p = parser().parse('* * * * * *', true);
			p.schedules[0].should.not.have.ownProperty('d');
		});		

		it('should parse ? to mean any value', function() {
			var p = parser().parse('* * * * * ?', true);
			p.schedules[0].should.not.have.ownProperty('d');
		});	

		it('should parse a single value', function() {
			var p = parser().parse('* * * * * 1', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2]});
		});

		it('should parse multiple values', function() {
			var p = parser().parse('* * * * * 1,2,5', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2,3,6]});
		});

		it('should parse a range value', function() {
			var p = parser().parse('* * * * * 1-5', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2,3,4,5,6]});
		});

		it('should parse a range with increment value', function() {
			var p = parser().parse('* * * * * 1-6/2', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2,4,6]});
		});

		it('should parse an asterisk with increment value', function() {
			var p = parser().parse('* * * * * */3', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [1,4,7]});
		});

		it('should parse last', function() {
			var p = parser().parse('* * * * * 5L', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [6], dc: [0]});
		});

		it('should parse last in combination', function() {
			var p = parser().parse('* * * * * 4,5L', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [5]});
			p.schedules[1].should.have.ownProperty('d').and.eql({d: [6], dc: [0]});
		});

		it('should parse last in combination', function() {
			var p = parser().parse('* * * * * 5L,4', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [5]});
			p.schedules[1].should.have.ownProperty('d').and.eql({d: [6], dc: [0]});
		});

		it('should parse multiple last', function() {
			var p = parser().parse('* * * * * 4L,5L', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [5,6], dc: [0]});
		});

		it('should parse a single day instance', function() {
			var p = parser().parse('* * * * * 1#2', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2], dc:[2]});
		});

		it('should parse multiple single day instance', function() {
			var p = parser().parse('* * * * * 1#2,3#3', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2], dc:[2]});
			p.schedules[1].should.have.ownProperty('d').and.eql({d: [4], dc:[3]});
		});

		it('should parse multiple single day instance with mins and secs', function() {
			var p = parser().parse('5 5 * * * 1#2,3#3', true);
			p.schedules[0].should.eql({s: [5], m:[5], d: [2], dc:[2]});
			p.schedules[1].should.eql({s: [5], m:[5], d: [4], dc:[3]});
		});

		it('should parse multiple single day instance in combination', function() {
			var p = parser().parse('* * * * * 2,1#2,3#3', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [3]});
			p.schedules[1].should.have.ownProperty('d').and.eql({d: [2], dc:[2]});
			p.schedules[2].should.have.ownProperty('d').and.eql({d: [4], dc:[3]});
		});

		it('should parse a single value in words', function() {
			var p = parser().parse('* * * * * MON', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2]});
		});

		it('should parse multiple values in words', function() {
			var p = parser().parse('* * * * * MON,TUE,FRI', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2,3,6]});
		});

		it('should parse a range value in words', function() {
			var p = parser().parse('* * * * * MON-FRI', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2,3,4,5,6]});
		});

		it('should parse a range with increment value in words', function() {
			var p = parser().parse('* * * * * MON-SAT/2', true);
			p.schedules[0].should.have.ownProperty('d').and.eql({d: [2,4,6]});
		});

	});

	describe('years', function() {

		it('should parse asterisk to mean any value', function() {
			var p = parser().parse('* * * * * * *', true);
			p.schedules[0].should.not.have.ownProperty('Y');
		});		

		it('should parse a single value', function() {
			var p = parser().parse('* * * * * * 2012', true);
			p.schedules[0].should.have.ownProperty('Y').and.eql({Y: [2012]});
		});

		it('should parse multiple values', function() {
			var p = parser().parse('* * * * * * 2012,2014,2020', true);
			p.schedules[0].should.have.ownProperty('Y').and.eql({Y: [2012,2014,2020]});
		});

		it('should parse a range value', function() {
			var p = parser().parse('* * * * * * 2012-2014', true);
			p.schedules[0].should.have.ownProperty('Y').and.eql({Y: [2012,2013,2014]});
		});

		it('should parse a range with increment value', function() {
			var p = parser().parse('* * * * * * 2012-2016/2', true);
			p.schedules[0].should.have.ownProperty('Y').and.eql({Y: [2012,2014,2016]});
		});

		it('should parse an asterisk with increment value', function() {
			var p = parser().parse('* * * * * * */100', true);
			p.schedules[0].should.have.ownProperty('Y').and.eql({Y: [1970,2070]});
		});
	
	});
});