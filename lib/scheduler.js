
(function() {
	
	var Scheduler = function(resolution) {

		var resolution = resolution || 1;

		var ceil = Math.ceil, floor = Math.floor;

		var getNextForSchedule = function(sched, start) {
			var next = start
			  , inc, x
			  , DAY = 86400000;


			while (next) {

				var Y = next.getUTCFullYear()					// year number
				  , M = next.getUTCMonth()						// month number
				  , D = next.getUTCDate()					    // date in month
				  , d = next.getUTCDay()						// day number of week
				  , h = next.getUTCHours()						// hour of day
			 	  , m = next.getUTCMinutes()					// minute of day
				  , s = next.getUTCSeconds()					// second of day
				  , t = pad(h) +':'+ pad(m) +':'+ pad(s)		// time of day

				  , oJan1 = utc(Y, 0, 1)						// first day of the year
				  , oDec31 = utc(Y+1, 0, 0) 					// last day of the year
				  , dy = ceil((next - oJan1 + 1)/DAY)    		// cur day number of year	
				  , daysInYear = ceil((oDec31 - oJan1 + 1)/DAY) // total days in cur year

				  , oThur = utc(Y, M, D + 4 - (d || 7))			// nearest thursday
				  , oYOfThur = utc(oThur.getUTCFullYear(),0,1) 	// year of the nearest Thursday
				  , wy = ceil((((oThur-oYOfThur)/DAY)+1)/7) 	// ISO week of year
				  , fmw = oThur.getUTCDate() - 3				// first Monday of week
				  , weeksInYear = oJan1.getUTCDay() === 4 || oDec31.getUTCDay() === 4 ? 53 : 52
				  
				  , oMonthEnd  = utc(Y, M + 1, 0)			    // last day of month
				  , daysInMonth = oMonthEnd.getUTCDate()		// days in current month
				  , lastDayInMonth = oMonthEnd.getUTCDay()		// last day of week in month

				  , dOfMonth = utc(Y, M, 1).getUTCDay()			// first day of the month
				  , lastWeekInMonth = daysInMonth - lastDayInMonth	// start of last week of month
				  , wm = floor((((D + dOfMonth - 1)/7))+1)		// week number of month
				  , weeksInMonth = floor((((daysInMonth + dOfMonth - 1)/7))+1)

				  , dc = floor((D - 1) / 7);				// day instance of month


				// check year
				if ((inc = nextInRange(Y, sched.Y, 0)) != Y ) {
					next = inc > Y ? utc(inc,0,1) : null;
					continue;
				}

				// check day of year (one based)
				if ((inc = nextInRange(dy, sched.dy, daysInYear)) != dy) {
					next = utc(Y, 0, inc);
					continue;
				} 

				// check month (zero based)
				if ((inc = nextInRange(M, sched.M, 11)) != M) {
					next = utc(Y, inc, 1);
					continue;
				}

				// week of year (one based, ISO week)
				if ((inc = nextInRange(wy, sched.wy, weeksInYear)) != wy) {
					next = utc(Y, M, fmw + (inc - wy) * 7);
					continue;
				}

				// check date of month (one based)
				if ((inc = nextInRange(D, sched.D, daysInMonth)) != D) {
					next = utc(Y, M, inc);
					continue;
				}


				// check week of month (one based, 0 for last week of month)
				if ((inc = nextInRange(wm, sched.wm, weeksInMonth)) != wm) {
					next = utc(Y, M, Math.max(1, 
						(inc-1) * 7 											// weeks * 7
						- (dOfMonth-1) 											// set day to Sun
						- (inc > weeksInMonth && lastDayInMonth < 6 ? 7 : 0))); // subtract overlap
					continue;
				}

				// check day of week (zero based)
				if ((inc = nextInRange(d, sched.d, 7)) != d) {
					next = utc(Y, M, D + inc - d);
					continue;
				}

				// check day of week count (zero based, -1 for last instance)
				if ((inc = nextInRange(dc, sched.dc, 0)) != dc) {
					if (inc > 0) {
						next = utc(Y, M + (inc < dc ? 1 : 0), 1 + (7 * inc));
						continue;
					}
					//special last day instance of month constraint
					if (inc < 0 && D < (daysInMonth - 6)) {
						next = utc(Y, M, daysInMonth - 6);
						continue;						
					}				
				}

				// check time of day (24-hr)
				if ((sched.from && t < sched.from) || (sched.to && t > sched.to)) {
					inc = sched.from ? sched.from : '00:00:00';
					x = inc.split(':');
					next = utc(Y, M, D + (t > inc ? 1 : 0), x[0], x[1], x[2]);
					continue;
				}

				// check hour of day (zero based)
				if ((inc = nextInRange(h, sched.h, 24)) != h) {
					next = utc(Y, M, D, inc);
					continue;
				}			

				// check minute of hour (zero based)
				if ((inc = nextInRange(m, sched.m, 60)) != m) {
					next = utc(Y, M, D, h, inc);
					continue;
				}

				// check second of minute (zero based)
				if ((inc = nextInRange(s, sched.s, 60)) != s) {
					next = utc(Y, M, D, h, m, inc);
					continue;
				}

				break; // all constraints have been met
			}

			return next;
		}

		var nextInRange = function(curValue, values, minOffset) {
			if (!values || values.indexOf(curValue) > -1) {
				return curValue;
			}

			var cur, next, min = values[0], i = 0;
			for (;i < values.length; i++) {
				cur = values[i];
				min = cur < min ? cur : min;
				next = cur > curValue && (!next || cur < next) ? cur : next;
			}

			return next || (min + minOffset);
		};


		var utc = function(yr, mt, dt, hr, mn, sc) {
			return new Date(Date.UTC(yr, mt, dt, hr || 0, mn || 0, sc || 0));
		}

		var pad = function(val) {
			return (val < 10 ? '0' : '') + val;
		}

		var tick = function(date) {
			return new Date(date.getTime() + (resolution * 1000));
		}

		return {

			isValid: function (recur, date) {
				return date == this.getNext(recur, date);
			},

			get: function (recur, count, startDate) {
				var num = count || 1
				  , occurrences = []				
				  , date;
				 
				while (num && (date = this.getNext(recur, date || startDate))) {
					occurrences.push(date);
					date = tick(date);
					num--;
				}

				return occurrences;
			},

			getNext: function (recur, startDate) {
				var schedules = recur.schedules || []
				  , exceptions = {schedules: recur.exceptions || []}
				  , start = startDate || new Date()				
				  , date, tDate
				  , length = schedules.length
				  , i;
				 					
				for( i = 0; i < length; i++ ) {
					tDate = getNextForSchedule(schedules[i], start);
					if (!date || (tDate < date)) {
						date = tDate;
					}
				}

				if (date && recur.exceptions && this.isValid (exceptions, date)) {
					date = this.getNext(recur, tick(date));
				}

				return date;				
			}
		}
	};

	if (typeof exports !== 'undefined') {
		exports = module.exports = Scheduler;
	} else {
		this['scheduler'] = Scheduler;
	}	

}).call(this);

  

