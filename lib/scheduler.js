
(function() {
	
	var root = this;

	var Scheduler = function(resolution, offset) {

		var resolution = resolution || 1;

		// offset in minutes from GMT (i.e if the desired time zone is GMT+2, use -120)
		// uses the local time zone offset by default
		var offset = (offset == null ? new Date().getTimezoneOffset() : offset);

		var ceil = Math.ceil;

		var getNextForSchedule = function(sched, start) {
			var next = start
			  , inc
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
				  , dayOfYear = ceil((next - oJan1 + 1)/DAY)    // cur day number of year	
				  , daysInYear = ceil((oDec31 - oJan1 + 1)/DAY) // total days in cur year

				  , oThur = utc(Y, M, D + 4 - (d || 7))			// nearest thursday
				  , oYOfThur = utc(oThur.getUTCFullYear(),0,1) 	// year of the nearest Thursday
				  , weekOfYear = ceil((((oThur-oYOfThur)/DAY) + 1)/7) // ISO week of year
				  
				  , oMonthEnd  = utc(Y, M + 1, 0)			    // last day of month
				  , daysInMonth = oMonthEnd.getUTCDate()		// days in current month
				  , lastDayInMonth = oMonthEnd.getUTCDay()		// last day of week in month

				  , lastWeekInMonth = daysInMonth - lastDayInMonth	// start of last week of month
				  , weekOfMonth = ceil((D - d - 1)/ 7)		    // week number of month

				  , dayInstanceOfMonth = Math.floor((D - 1) / 7);// day instance of month

				// check year
				if ((inc = nextInRange(Y, sched.Y, 0)) != Y ) {
					next = inc > Y ? utc(inc,0,1) : null;
					continue;
				}

				// check day of year (one based)
				if ((inc = nextInRange(dayOfYear, sched.dy, daysInYear)) != dayOfYear) {
					next = utc(Y, 0, inc);
					continue;
				} 

				// check month (one based)
				if ((inc = nextInRange(M+1, sched.M, 11)) != M+1) {
					next = utc(Y, inc-1, 1);
					continue;
				}
/*


				// week of year (one based, ISO week)
				if ((inc = nextInRange(wy, sched.weekOfYear, 0)) != wy) {
					fmw = nt.getUTCDate() - 3;				// first Monday of week
					next = utcDate(yr, mt, fmw + (inc > wy ? ((inc - wy) * 7) 
						: (52 - wy + inc)*7)); 
					continue;
				}
*/
				// check date of month (one based)
				if ((inc = nextInRange(D, sched.D, daysInMonth)) != D) {
					next = utc(Y, M, inc);
					continue;
				}

/*

				// check week of month (zero based, 6 for last week of month)
				if ((inc = nextInRange(wm, sched.weekOfMonth, 0)) != wm) {					
					if (inc < 6) {
						mt += inc < wm ? 1 : 0;
						fdm = utcDay(utcDate(yr,mt,1)); 	// first day of month
						next = utcDate(yr, mt, (inc === 0 ? 1 : (7*(inc+1))-fdm - 6));
						continue;
					}
					// special last week of month constraint
					if (inc > 5 && dt < lwm) {
						next = utcDate(yr, mt, lwm);
						continue;						
					}
				}

				// check day of week (zero based)
				if ((inc = nextInRange(da, sched.dayOfWeek, 0)) != da) {
					next = utcDate(yr, mt, dt + (inc < da ? 7 - da : inc - da));
					continue;
				}

				// check day instance of month (zero based, 6 for last instance)
				if ((inc = nextInRange(di, sched.dayInstanceOfMonth, 0)) != di) {
					if (inc < 6) {
						next = utcDate(yr, mt + (inc < di ? 1 : 0), 1 + (7 * inc));
						continue;
					}
					// special last day instance of month constraint
					if (inc >= 6 && dt < (ldtm - 6)) {
						next = utcDate(yr, mt, ldtm - 6);
						continue;						
					}				
				}

				// check time (24-hr)
				if ((inc = nextInRange(ti, sched.time, '')) != ti) {
					x = inc.split(':');
					next = utcDate(yr, mt, dt + (inc < ti ? 1 : 0), x[0], x[1], x[2]);
					continue;
				}

				// check hour of day (zero based)
				if ((inc = nextInRange(hr, sched.hour, 24)) != hr) {
					next = utcDate(yr, mt, dt, inc);
					continue;
				}			

				// check minute of hour (zero based)
				if ((inc = nextInRange(mn, sched.min, 60)) != mn) {
					next = utcDate(yr, mt, dt, hr, inc);
					continue;
				}

				// check second of minute (zero based)
				if ((inc = nextInRange(sc, sched.sec, 60)) != sc) {
					next = utcDate(yr, mt, dt, hr, mn, inc);
					continue;
				}
*/
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
		root['scheduler'] = Scheduler;
	}	

}).call(this);

  

