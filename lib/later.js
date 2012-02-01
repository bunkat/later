
(function() {
	
	var Later = function(resolution) {

		var offset = -480;

		var resolution = resolution || 1
		  , ceil = Math.ceil		// aliases for common math functions
		  , floor = Math.floor;

		var getNextForSchedule = function(sched, start) {
			var next = start
			  , inc, x
			  , Y, M, D, d, h, m, s, t, oJan1, oDec31, dy, daysInYear
			  , oNearestThur, oNearestThurYear,wy, firstMondayOfWeek, weeksInYear
			  , oMonthEnd, daysInMonth, lastDayInMonth, firstDayOfMonth 
			  , lastWeekInMonth, wm, weeksInMonth, dc
			  , DAY = 86400000;


			while (next) {
				next = tick(next, offset * 60);
				console.log(next.toLocaleString());

				// check year
				Y = next.getUTCFullYear();	
				if ((inc = nextInRange(Y, sched.Y, 0)) != Y ) {
					next = inc > Y ? utc(inc,0,1) : null;
					continue;
				}

				oJan1 = utc(Y, 0, 1);						
				oDec31 = utc(Y+1, 0, 0); 					
				daysInYear = ceil((oDec31 - oJan1 + 1)/DAY);

				// check day of year (one based)
				dy = ceil((next - oJan1 + 1)/DAY); 	
				if ((inc = nextInRange(dy, sched.dy, daysInYear)) != dy) {
					next = utc(Y, 0, inc);
					continue;
				} 

				// check month (zero based)
				M = next.getUTCMonth();
				if ((inc = nextInRange(M, sched.M, 11)) != M) {
					next = utc(Y, inc, 1);
					continue;
				}

				D = next.getUTCDate();					    // date in month
				d = next.getUTCDay()						// day number of week
				oNearestThur = utc(Y, M, D + 4 - (d || 7));		
				oNearestThurYear = utc(oNearestThur.getUTCFullYear(),0,1);
				weeksInYear = oJan1.getUTCDay() === 4 || 
					oDec31.getUTCDay() === 4 ? 53 : 52;

				// check week of year (one based, ISO week)
				wy = ceil((((oNearestThur-oNearestThurYear)/DAY)+1)/7);
				if ((inc = nextInRange(wy, sched.wy, weeksInYear)) != wy) {
					firstMondayOfWeek = oNearestThur.getUTCDate() - 3;
					next = utc(Y, M, firstMondayOfWeek + (inc - wy) * 7);
					continue;
				}

				oMonthEnd  = utc(Y, M + 1, 0);			   
				daysInMonth = oMonthEnd.getUTCDate();

				// check date of month (one based)
				if ((inc = nextInRange(D, sched.D, daysInMonth)) != D) {
					next = utc(Y, M, inc);
					continue;
				}

				lastDayInMonth = oMonthEnd.getUTCDay();
				firstDayOfMonth = utc(Y, M, 1).getUTCDay();
				lastWeekInMonth = daysInMonth - lastDayInMonth;
				weeksInMonth = floor((((daysInMonth + firstDayOfMonth - 1)/7))+1);

				// check week of month (one based, 0 for last week of month)
				wm = floor((((D + firstDayOfMonth - 1)/7))+1);
				if ((inc = nextInRange(wm, sched.wm, weeksInMonth)) != wm) {
					// jump to the Sunday of the desired week, making sure not
					// to double count the last week in the month if we cross
					// a month boundary
					next = utc(Y, M, Math.max(1, 
						(inc-1) * 7 													
						- (firstDayOfMonth-1) 											
						- (inc > weeksInMonth && lastDayInMonth < 6 ? 7 : 0))); 
					continue;
				}

				// check day of week (zero based)
				if ((inc = nextInRange(d, sched.d, 7)) != d) {
					next = utc(Y, M, D + inc - d);
					continue;
				}

				// check day of week count (zero based, -1 for last instance)
				dc = floor((D - 1) / 7);
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

				// check hour of day (zero based)
				h = next.getUTCHours();				
				if ((inc = nextInRange(h, sched.h, 24)) != h) {
					next = utc(Y, M, D, inc);
					continue;
				}			

				// check minute of hour (zero based)
				m = next.getUTCMinutes();		
				if ((inc = nextInRange(m, sched.m, 60)) != m) {
					next = utc(Y, M, D, h, inc);
					continue;
				}

				// check second of minute (zero based)
				s = next.getUTCSeconds();			
				if ((inc = nextInRange(s, sched.s, 60)) != s) {
					next = utc(Y, M, D, h, m, inc);
					continue;
				}

				// check time of day (24-hr)
				t = pad(h) +':'+ pad(m) +':'+ pad(s);
				if ((inc = nextInRange(t, sched.t, '')) != t) {
					x = inc.split(':');
					next = utc(Y, M, D + (t > inc ? 1 : 0), x[0], x[1], x[2]);
				}

				break; // all constraints have been met
			}

			return next;
		}

		var nextInRange = function(val, values, minOffset) {
			if (!values || values.length === 0 || values.indexOf(val) > -1) {
				return val;
			}

			var cur, next, min = values[0], i = values.length;
			while (i--) {
				cur = values[i];
				min = cur < min ? cur : min;
				next = cur > val && (!next || cur < next) ? cur : next;				
			}

			return next || (min + minOffset);
		};


		var utc = function(yr, mt, dt, hr, mn, sc) {
			return new Date(Date.UTC(yr, mt, dt, hr || 0, mn || 0, sc || 0));
		}

		var pad = function(val) {
			return (val < 10 ? '0' : '') + val;
		}

		var tick = function(date, amount) {
			return new Date(date.getTime() + (amount * 1000));
		}

		return {

			isValid: function (recur, date) {
				return date == this.getNext(recur, date);
			},

			get: function (recur, count, start) {
				var occurrences = []				
				  , date;
				 
				while (count-- > 0 && (date = this.getNext(recur, date || start))) {
					occurrences.push(date);
					date = tick(date, resolution);
				}

				return occurrences;
			},

			getNext: function (recur, startDate) {
				var schedules = recur.schedules || []
				  , exceptions = {schedules: recur.exceptions || []}
				  , start = startDate || new Date				
				  , date, tDate
				  , i = schedules.length;
				 					
				while(i--) {
					tDate = getNextForSchedule(schedules[i], start);
					if (!date || (tDate < date)) {
						date = tDate;
					}
				}

				if (date && recur.exceptions && this.isValid (exceptions, date)) {
					date = this.getNext(recur, tick(date, resolution));
				}

				return date;				
			}
		}
	};

	if (typeof exports !== 'undefined') {
		exports = module.exports = Later;
	} else {
		this['later'] = Later;
	}	

}).call(this);

  

