
(function() {
	
	var root = this;

	var Scheduler = function(resolution) {

		var resolution = resolution;

		var getNextForSchedules = function(schedules, start) {
			var occur
			  , i
			  , length = schedules.length
			  , tOccur;
			
			for( i = 0; i < length; i++ ) {
				tOccur = getNextForSchedule(schedules[i], start);
				if (!occur || tOccur < occur) {
					occur = tOccur;
				}
			}

			return occur;
		}

		var skipTo = function(date, yr, mt, dt, hr, mn, sc) {
			date.setTime(Date.UTC(yr, mt || 0, dt || 1, hr || 0, mn || 0, sc || 0));
		}

		var getNextForSchedule = function(sched, start) {
			var next = start
			  , dc
			  , inc, x
			  , yr, mt, dt, di, wy, wm, da, dy, ti, hr, mn, sc, lm, ld, lw, ly;

			//console.log('\nstart\n');
			while (next) {
				//console.log(next);

				// year
				yr = next.getUTCFullYear();
				if ((inc = nextInRange(yr, sched.year, 0)) != yr ) {
					if (inc > yr ) {
						skipTo(next, inc);
					}
					else {
						next = null;
					}
					continue;
				}

				// day of year (one based)
				var firstOfYear = new Date();
				skipTo(firstOfYear, yr, 0, 1);

				var lastOfYear = new Date();
				skipTo(lastOfYear, yr + 1, 0, 0);

				dy = Math.ceil((next - firstOfYear + 1)/86400000);
				ly = Math.ceil((lastOfYear - firstOfYear)/86400000);
				if ((inc = nextInRange(dy, sched.dayOfYear, 0)) != dy) {
					// exception for 'last'
					if (inc >= 367 && dy != ly) {
						skipTo(next, yr, 0, ly);
						continue;
					}

					if (inc < 367) {
						skipTo(next, yr + (inc < dy ? 1 : 0), 0, inc);
						continue;
					}
				}

				// week of year (zero based)
				da = next.getUTCDay();
				wy = Math.ceil((dy - da)/ 7);
				if ((inc = nextInRange(wy, sched.weekOfYear, 0)) != wy) {
					yr += inc < wy ? 1 : 0;
					next.setTime(new Date(yr, 0,1).valueOf() + (86400000 * inc * 7));
					continue;
				}

				// month (zero based)
				mt = next.getUTCMonth();
				if ((inc = nextInRange(mt, sched.month, 12)) != mt) {
					skipTo(next, yr, inc);
					continue;
				}

				// day of month (one based)
				dt = next.getUTCDate();
				lm = new Date(yr, mt + 1, 0);
				ld = lm.getUTCDate();
				if ((inc = nextInRange(dt, sched.dayOfMonth, 0)) != dt) {
					// exception for 'last'
					if (inc >= 32 && dt != ld) {
						skipTo(next, yr, mt, ld);
						continue;
					}

					if (inc < 32) {
						skipTo(next, yr, mt + (inc < dt ? 1 : 0), inc);
						continue;
					}
				}

				// day instance of month (zero based, 6 for last instance)
				di = Math.floor((dt - 1) / 7);
				if ((inc = nextInRange(di, sched.dayInstanceOfMonth, 0)) != di) {
					// exception for 'last'
					if (inc >= 6 && dt < (ld - 6)) {
						skipTo(next, yr, mt, ld - 6);
						continue;						
					}				

					if (inc < 6) {
						skipTo(next, yr, mt + (inc < di ? 1 : 0), 1 + (7 * inc));
						continue;
					}
				}

				// week of month (zero based, 6 for last week of month)
				wm = Math.ceil((dt)/ 7);
				lw = ld - lm.getUTCDay();
				if ((inc = nextInRange(wm, sched.weekOfMonth, 0)) != wm) {
					// exception for 'last'
					if (inc >= 6 && dt < lw) {
						skipTo(next, yr, mt, lw);
						continue;						
					}
					
					if (inc < 6) {
						var firstOfMonth = new Date();
						skipTo(firstOfMonth, yr, mt + (inc < wm ? 1 : 0), 1);
						var fm = firstOfMonth.getUTCDay();

						skipTo( next, yr, mt + (inc < wm ? 1 : 0), (inc === 1 ? 1 : (7*inc)-fm - 6));
						break;

						continue;
					}
				}

				// day of week (zero based)
				if ((inc = nextInRange(da, sched.dayOfWeek, 0)) != da) {
					skipTo(next, yr, mt, dt + (inc < da ? 7 - da : inc - da));
					continue;
				}

				// hour of day (zero based)
				hr = next.getUTCHours();
				if ((inc = nextInRange(hr, sched.hour, 24)) != hr) {
					skipTo(next, yr, mt, dt, inc);
					continue;
				}			

				// minute of hour (zero based)
				mn = next.getUTCMinutes();
				if ((inc = nextInRange(mn, sched.min, 60)) != mn) {
					skipTo(next, yr, mt, dt, hr, inc);
					continue;
				}

				// second of minute (zero based)
				sc = next.getUTCSeconds();
				if ((inc = nextInRange(sc, sched.sec, 60)) != sc) {
					skipTo(next, yr, mt, dt, hr, mn, inc);
					continue;
				}

				// time (24-hr)
				ti = (hr < 10 ? '0' + hr : hr) + ':' + 
				     (mn < 10 ? '0' + mn : mn) + ':' +
				     (sc < 10 ? '0' + sc : sc);
				if ((inc = nextInRange(ti, sched.time, 0)) != ti) {
					x = inc.split(':');
					skipTo(next, yr, mt, dt + (inc < ti ? 1 : 0), x[0], x[1], x[2]);
					continue;
				}

				break; // all constraints have been met
			}

			//console.log(next);
			return next;
		}

		var nextInRange = function(value, ranges, max) {
			if (!ranges) {
				return value;
			}

			var min
			  , next
			  , length = ranges.length
			  , curMin, curMax;
					 
			for(var i = 0; i < length; i++) {
				curMin = ranges[i][0];
				curMax = ranges[i][0];
				if (curMin <= value && curMax >= value) {
					return value;  //cur value is valid
				}
				if (!min || curMin < min) {
					min = curMin;
				}
				if (curMin > value && (!next || curMin < next)) {
					next = curMin;
				}
			}

			return next || (min + max);
		}

		return {

			resolution: resolution,

			getNext: function (schedule, count, startDate) {
				var start = new Date(startDate.getTime()) || new Date()
				  , s = schedule.length ? schedule : new Array(schedule)
				  , num = count || 1
				  , occurrences = []
				  , date;
				 
				while (num) {
					//console.log(num);
					date = getNextForSchedules(s, start);
					if (date) {
						occurrences.push(date);
						start = new Date(date.getTime() + (resolution * 1000));
						num--;
					}
					else {
						occurrences.push(null);
						num = 0;
					}
				}
				return count === 1 ? occurrences[0] : occurrences;
			}
		}
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Scheduler;
		}
		exports.scheduler = Scheduler;
	} else {
		root['scheduler'] = Scheduler;
	}	

}).call(this);

  

