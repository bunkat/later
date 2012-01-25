
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

		var getStartOfLastWeek = function(yr, mt) {
			var lastDay = new Date(yr, mt + 1, 0);
			return lastDay.getDate() - lastDay.getDay();		
		}

		var getNextForSchedule = function(sched, start) {
			var next = start
			  , dc
			  , inc, x, z = 1
			  , yr, mt, dt, di, wy, wm, da, dy, ti, hr, mn, sc, lm, ld, lw, ly;

			while (next) {
				console.log(next);
				console.log('loop ' + z);
				z++;

				// year
				yr = next.getFullYear();
				if ((inc = nextInRange(yr, sched.year, 0)) != yr ) {
					next = inc > yr ? new Date(inc, 0, 1) : null;
					continue;
				}

				// day of year (zero based)
				dy = Math.floor((next - new Date(yr,0,1))/86400000);
				ly = Math.floor((new Date(yr+1,0,0) - new Date(yr,0,1))/86400000);
				if ((inc = nextInRange(dy, sched.dayOfYear, 0)) != dy) {
					// exception for 'last'
					if (inc >= 367 && dy != ly) {
						next = new Date(yr+1,0,0);
						continue;
					}

					if (inc < 367) {
						yr += inc < dy ? 1 : 0;
						next = new Date(new Date(yr, 0,1).valueOf() + (86400000 * inc));
						continue;
					}
				}

				// week of year (zero based)
				da = next.getDay();
				wy = Math.ceil((dy - da)/ 7);
				if ((inc = nextInRange(wy, sched.weekOfYear, 0)) != wy) {
					yr += inc < wy ? 1 : 0;
					next = new Date(new Date(yr, 0,1).valueOf() + (86400000 * inc * 7));
					continue;
				}

				// month (zero based)
				mt = next.getMonth();
				if ((inc = nextInRange(mt, sched.month, 12)) != mt) {
					next = new Date(yr, inc, 1);
					continue;
				}

				// day of month (one based)
				dt = next.getDate();
				lm = new Date(yr, mt + 1, 0);
				ld = lm.getDate();
				if ((inc = nextInRange(dt, sched.dayOfMonth, 0)) != dt) {
					// exception for 'last'
					if (inc >= 32 && dt != ld) {
						next = new Date(yr, mt, ld);
						continue;
					}

					if (inc < 32) {
						next = new Date(yr, mt + (inc < dt ? 1 : 0), inc);
						continue;
					}
				}

				// day instance of month (zero based, 6 for last instance)
				di = Math.floor((dt - 1) / 7);
				if ((inc = nextInRange(di, sched.dayInstanceOfMonth, 0)) != di) {
					// exception for 'last'
					if (inc >= 6 && dt < (ld - 7)) {
						next = new Date(yr, mt, ld - 7);
						continue;						
					}				

					if (inc < 6) {
						next = new Date(yr, mt + (inc < di ? 1 : 0), 
							(inc < di ? 1 : dt + (inc - di) * 7));
						continue;
					}

				}

				// week of month (zero based, 6 for last week of month)
				wm = Math.ceil((dt - da)/ 7);
				lw = ld - lm.getDay();
				if ((inc = nextInRange(wm, sched.weekOfMonth, 0)) != wm) {
					// exception for 'last'
					if (inc >= 6 && dt < lw) {
						next = new Date(yr, mt, lw);
						continue;						
					}
					
					if (inc < 6) {
						next = new Date(yr, mt + (inc < dt ? 1 : 0), inc * 7);
						continue;
					}
				}

				// day of week (zero based)
				if ((inc = nextInRange(da, sched.dayOfWeek, 0)) != da) {
					next = new Date(yr, mt, dt + (inc < da ? 7 - da : inc - da));
					continue;
				}

				// hour of day (zero based)
				hr = next.getHours();
				if ((inc = nextInRange(hr, sched.hour, 24)) != hr) {
					next = new Date(yr, mt, dt, inc);
					continue;
				}			

				// minute of hour (zero based)
				mn = next.getMinutes();
				if ((inc = nextInRange(mn, sched.min, 60)) != mn) {
					next = new Date(yr, mt, dt, hr, inc);
					continue;
				}

				// second of minute (zero based)
				sc = next.getSeconds();
				if ((inc = nextInRange(sc, sched.sec, 60)) != sc) {
					next = new Date(yr, mt, dt, hr, min, inc);
					continue;
				}

				// time (24-hr)
				ti = (hr < 10 ? '0' + hr : hr) + ':' + 
				     (mn < 10 ? '0' + mn : mn) + ':' +
				     (sc < 10 ? '0' + sc : sc);
				if ((inc = nextInRange(ti, sched.time, 0)) != ti) {
					x = inc.split(':');
					next = new Date(yr, mt, dt + (inc < ti ? 1 : 0), x[0], x[1], x[2]);
					continue;
				}

				break; // all constraints have been met
			}

			console.log(next);
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
				var start = startDate || new Date()
				  , s = schedule.length ? schedule : new Array(schedule)
				  , num = count || 1
				  , occurrences = []
				  , date;
				 
				while (num) {
					console.log(num);
					date = getNextForSchedules(s, start);
					if (date) {
						occurrences.push(date);
						start = new Date(date.getTime() + (resolution * 1000));
						num--;
					}
					else {
						num = 0;
					}
				}
				return occurrences;
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

  

