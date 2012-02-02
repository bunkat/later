
(function() {
	
	var Later = function(resolution) {

		var offset = -480;
		var get = 'getUTC';

		var resolution = resolution || 1
		  , DAY = 86400000
		  , ceil = Math.ceil		// aliases for common math functions
		  , floor = Math.floor;

		var dateProto = Date.prototype
		  , getYear = dateProto[get + 'FullYear']
		  , getMonth = dateProto[get + 'Month']
		  , getDate = dateProto[get + 'Date']
		  , getDay = dateProto[get + 'Day']
		  , getHour = dateProto[get + 'Hours']
		  , getMin = dateProto[get + 'Minutes']
		  , getSec = dateProto[get + 'Seconds'];


		var breakDate = function(date) {
			
			var cur = {
				Y: getYear.call(date),
				M: getMonth.call(date),
				D: getDate.call(date),
				d: getDay.call(date),
				h: getHour.call(date),		
				m: getMin.call(date),
				s: getSec.call(date)
			};

			var oJan1 = utc(cur.Y, 0, 1);
			var oMonthStart = utc(cur.Y, cur.M, 1);						
			var oNearestThur = utc(cur.Y, cur.M, cur.D + 4 - (cur.d || 7));		
			var oNearestThurYear = utc(getYear.call(oNearestThur),0,1);
			var oMonthEnd  = utc(cur.Y, cur.M + 1, 0);
			var oDec31 = utc(cur.Y+1, 0, 0); 

			cur.t = pad(cur.h) +':'+ pad(cur.m) +':'+ pad(cur.s);

			cur.dy = ceil((date.getTime() - oJan1.getTime() + 1)/DAY);			
			cur.daysInYear = ceil((oDec31.getTime() - oJan1.getTime() + 1)/DAY);
			
			cur.wy = ceil((((oNearestThur.getTime()-oNearestThurYear.getTime())/DAY)+1)/7);
			cur.weekStart = oNearestThur;
			cur.weeksInYear = getDay.call(oJan1) === 4 || getDay.call(oDec31) === 4 ? 53 : 52;
			
			cur.daysInMonth = getDate.call(oMonthEnd);
			cur.firstDayOfMonth = getDay.call(oMonthStart);
			cur.lastDayInMonth = getDay.call(oMonthEnd);
			
			cur.wm = floor((((cur.D + cur.firstDayOfMonth - 1)/7))+1);
			cur.weeksInMonth = floor((((cur.daysInMonth + cur.firstDayOfMonth - 1)/7))+1);
			
			cur.dc = floor((cur.D - 1) / 7);

			return cur;
		}

		var getNextForSchedule = function(sched, start) {
			var next = start, inc, x, cur;

			while (next) {

				cur = breakDate(next);

				// check year
				if (sched.Y && (inc = nextInRange(cur.Y, sched.Y, 0)) != cur.Y ) {
					next = inc > cur.Y ? utc(inc,0,1) : null;
					continue;
				}

				// check day of year (one based)				 	
				if (sched.dy && (inc = nextInRange(cur.dy, sched.dy, cur.daysInYear)) != cur.dy) {
					next = utc(cur.Y, 0, inc);
					continue;
				} 

				// check month (zero based)
				if (sched.M && (inc = nextInRange(cur.M, sched.M, 11)) != cur.M) {
					next = utc(cur.Y, inc, 1);
					continue;
				}

				// check week of year (one based, ISO week)
				if (sched.wy && (inc = nextInRange(cur.wy, sched.wy, cur.weeksInYear)) != cur.wy) {
					next = utc(
							getYear.call(cur.weekStart),
							getMonth.call(cur.weekStart),
							getDate.call(cur.weekStart) - 3 + (inc - cur.wy) * 7);
					continue;
				}

				// check date of month (one based)
				if (sched.D && (inc = nextInRange(cur.D, sched.D, cur.daysInMonth)) != cur.D) {
					next = utc(cur.Y, cur.M, inc);
					continue;
				}

				// check week of month (one based, 0 for last week of month)
				if (sched.wm && (inc = nextInRange(cur.wm, sched.wm, cur.weeksInMonth)) != cur.wm) {
					// jump to the Sunday of the desired week, making sure not
					// to double count the last week in the month if we cross
					// a month boundary
					next = utc(cur.Y, cur.M, 
						Math.max(1, (inc-1) * 7 													
						- (cur.firstDayOfMonth-1) 											
						- (inc > cur.weeksInMonth && cur.lastDayInMonth < 6 ? 7 : 0))); 
					continue;
				}

				// check day of week (zero based)
				if (sched.d && (inc = nextInRange(cur.d, sched.d, 7)) != cur.d) {
					next = utc(cur.Y, cur.M, cur.D + inc - cur.d);
					continue;
				}

				// check day of week count (zero based, -1 for last instance)
				if (sched.dc && (inc = nextInRange(cur.dc, sched.dc, 0)) != cur.dc) {
					if (inc >= 0) {
						next = utc(cur.Y, cur.M + (inc < cur.dc ? 1 : 0), 1 + (7 * inc));
						continue;
					}
					//special last day instance of month constraint
					if (inc < 0 && cur.D < (cur.daysInMonth - 6)) {
						next = utc(cur.Y, cur.M, cur.daysInMonth - 6);
						continue;						
					}				
				}

				// check hour of day (zero based)
				if (sched.h && (inc = nextInRange(cur.h, sched.h, 24)) != cur.h) {
					next = utc(cur.Y, cur.M, cur.D, inc);
					continue;
				}			

				// check minute of hour (zero based)		
				if (sched.m && (inc = nextInRange(cur.m, sched.m, 60)) != cur.m) {
					next = utc(cur.Y, cur.M, cur.D, cur.h, inc);
					continue;
				}

				// check second of minute (zero based)			
				if (sched.s && (inc = nextInRange(cur.s, sched.s, 60)) != cur.s) {
					next = utc(cur.Y, cur.M, cur.D, cur.h, cur.m, inc);
					continue;
				}

				// check time of day (24-hr)
				if (sched.t && (inc = nextInRange(cur.t, sched.t, '')) != cur.t) {
					x = inc.split(':');
					next = utc(cur.Y, cur.M, cur.D + (cur.t > inc ? 1 : 0), x[0], x[1], x[2]);
					continue;
				}

				break; // all constraints have been met
			}

			return next;
		}

		var nextInRange = function(val, values, minOffset) {
			var cur, next, min = values[0], i = values.length;
			while (i--) {
				cur = values[i];
				if (cur === val) return val;
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

		var tick = function(date) {
			return new Date(date.getTime() + (resolution * 1000));
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
					date = tick(date);
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

				if (date && exceptions.schedules.length > 0 &&
						this.isValid (exceptions, date)) {
					date = this.getNext(recur, tick(date));
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

  

