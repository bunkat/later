var recur = require('../lib/recur').recur;
var cron = require('../lib/cron.parser').cronParser;
var text = require('../lib/en.parser').enParser;
var later = require('../lib/later').later;
var should = require('should');

describe('Later', function() {

  // These are long running tests!

	describe('exec', function() {
	
/*		it('should support long schedules', function(done) {
			this.timeout(15000);

			var count = 0;
			var r = recur().after(30).dayOfYear();
			var l = later();

			var func = function() {
				console.log(Date.now());
				done();
			};

			l.exec(r, (new Date()), func);

		});*/


/*	
		it('should call a function based on the schedule', function(done) {
			this.timeout(15000);

			var count = 0;
			var r = recur().every(1).second();
			var l = later();

			var func = function() {
				count++;
				if (count === 2) {
					l.stopExec();
					done();
				}
			}

			l.exec(r, (new Date()), func);

		});*/

/*		it('should run for a long time', function(done) {
			this.timeout(0);

			var count = 0;
			var r = text().parse("every 2nd minute every 5 s between 12 and 42 s");
			var l = later();

			var func = function() {
				count++;
				console.log(new Date());
				if (count === 20) {
					l.stopExec();
					done();
				}
			}

			l.exec(r, (new Date()), func);
		});*/

	});

});