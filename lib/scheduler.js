
(function() {
	
	var root = this;

	var Scheduler = function(resolution, offset) {

		var resolution = resolution || 1;

		// offset in minutes from GMT (i.e if the desired time zone is GMT+2, use -120)
		// uses the local time zone offset by default
		var offset = (offset == null ? new Date().getTimezoneOffset() : offset);

		var getNextForSchedule = function(sched, start) {
			var next = start
			  , inc
		      , yr, fdy, ldy, dy, ly, mt, wy, nt, nty, fmw, wm, lw, lm, fdm, dt, ldm, ldtm
		      , lwm, da, di, hr, mn, sc, ti, x
			  , MS_DAY = 86400000;

			while (next) {

				yr = next.getUTCFullYear()					// year number

				// check year
				if ((inc = nextInRange(yr, sched.year, 0)) != yr ) {
					next = inc > yr ? utcDate(inc,0,1) : null;
					continue;
				}

				fdy = utcDate(yr, 0, 1);					// first day of year
				ldy = utcDate(yr+1, 0, 0);					// last day of year
				dy  = Math.ceil((next - fdy + 1)/MS_DAY);	// cur day number of year
				ly  = Math.ceil((ldy - fdy + 1)/MS_DAY);	// last day number of year

				// check day of year (one based)
				if ((inc = nextInRange(dy, sched.dayOfYear, 0)) != dy) {
					if (inc < 367) {
						next = utcDate(yr + (inc < dy ? 1 : 0), 0, inc);
						continue;
					}
					// special last day of year constraint
					if (inc > 366 && dy != ly) {
						next = utcDate(yr, 0, ly);
						continue;
					}
				} 

				mt = next.getUTCMonth();					// month number

				// check month (zero based)
				if ((inc = nextInRange(mt, sched.month, 12)) != mt) {
					next = utcDate(yr, inc, 1);
					continue;
				}

				dt   = next.getUTCDate();					// date in month
				da   = utcDay(next);						// day number of week
				nt   = utcDate(yr, mt, dt + 4 - (da||7));	// nearest thursday
				nty  = utcDate(nt.getUTCFullYear(),0,1);	// year of the nearest Thursday
				wy   = Math.ceil((((nt-nty)/MS_DAY) + 1)/7);// ISO week of year 

				// week of year (one based, ISO week)
				if ((inc = nextInRange(wy, sched.weekOfYear, 0)) != wy) {
					fmw = nt.getUTCDate() - 3;				// first Monday of week
					next = utcDate(yr, mt, fmw + (inc > wy ? ((inc - wy) * 7) 
						: (52 - wy + inc)*7)); 
					continue;
				}

				ldm  = utcDate(yr, mt + 1, 0);				// last day of month
				ldtm = ldm.getUTCDate();					// last date of month

				// check date of month (one based)
				if ((inc = nextInRange(dt, sched.dayOfMonth, 0)) != dt) {
					if (inc < 32) {
						next = utcDate(yr, mt + (inc < dt ? 1 : 0), inc);
						continue;
					}
					// special last date of month constraint
					if (inc >= 32 && dt != ldtm) {
						next = utcDate(yr, mt, ldtm);
						continue;
					}
				}

				lwm  = ldtm - utcDay(ldm);					// start of last week of month
				wm   = Math.ceil((dt - da - 1)/ 7);			// week number of month

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

				di = Math.floor((dt - 1) / 7);				// day instance of month

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

				hr = next.getUTCHours();					// hour of day
				mn = next.getUTCMinutes();					// minute of day
				sc = next.getUTCSeconds();					// second of day
				ti = pad(hr) +':'+ pad(mn) +':'+ pad(sc);	// time of day

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

				break; // all constraints have been met
			}

			return next;
		}

		var nextInRange = function(curValue, values, minOffset) {
			if (!values || values.indexOf(value) > -1) {
				return curValue;
			}

			var cur, next, min = values[0], i = 0;
			for (;i < values.length; i++) {
				cur = values[i];
				min = cur < min ? cur : min;
				next = curMin > curValue && (!next || curMin < next) ? cur : next;
			}

			return next || (min + minOffset);
		};


		var utcDate = function(yr, mt, dt, hr, mn, sc) {
			return new Date(Date.UTC(yr, mt, dt, hr || 0, mn || 0, sc || 0));
		}

		var utcDay = function(date) {
			return date.getUTCDay();
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

				if (date && this.isValid (exceptions, date)) {
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

  

