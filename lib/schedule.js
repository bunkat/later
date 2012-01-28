(function() {
	
	var root = this;

	var Schedule = function() {

		var constraints = [];

		var getRange = function (start, end, max, eDefault) {
			var cleanStart = isNaN(start) ? 0 : (start < 0 ? 0 : start > max ? max : start)
			  , cleanEnd = isNaN(end) ? eDefault || cleanStart : (end < 0 ? 0 : end > max ? max : end);
			
			return cleanStart < cleanEnd ? [cleanStart, cleanEnd] : [cleanEnd, cleanStart];
		}

		var get24HourTime = function(date) {
			var h = date.getUTCHours()
			  , m = date.getUTCMinutes()
			  , s = date.getUTCSeconds();
			return (h < 10 ? '0' + h : h) + ':' + 
				   (m < 10 ? '0' + m : m) + ':' +
				   (s < 10 ? '0' + s : s);
		}

		return {

			on: function (name, range) {
				if (!this[name]) {
					this[name] = [];
				}
				this[name].push(range);			

				return this;
			},
				
			onTimes: function (start, end) {
				var d = '1/01/2001 '
				  , t1 = get24HourTime(new Date(d + start))
				  , t2 = end ? get24HourTime(new Date(d + end)): t1
				  , range = t1 < t2 ? [t1, t2] : [t2, t1];
				
				return this.on('time', range);	
			},

			onSecs: function(start, end) {
				return this.on('sec', getRange(start, end, 59)); 
			},
			
			onMins: function(start, end) { 
				return this.on('min', getRange(start, end, 59)); 
			},
			
			onHours: function(start, end) { 
				return this.on('hour', getRange(start, end, 23)); 
			},
			
			onDaysOfWeek: function(start, end) { 
				return this.on('dayOfWeek', getRange(start, end, 6)); 
			},
			
			onWeekends: function() { 
				return this.on('dayOfWeek', [0, 0]).on('dayOfWeek', [6, 6]); 
			},
			
			onWeekdays: function() { 
				return this.on('dayOfWeek', [1, 5]); 
			},
			
			onDaysOfMonth: function(start, end) { 
				return this.on('dayOfMonth', getRange(start, end, 32)); 
			},

			onLastDayOfMonth: function() {
				return this.on('dayOfMonth', [32, 32]);
			},

			onDayInstancesOfMonth: function(start, end) { 
				return this.on('dayInstanceOfMonth', getRange(start-1, end ? end -1 : end, 6)); 
			},

			onLastDayInstanceOfMonth: function() { 
				return this.on('dayInstanceOfMonth', [6, 6]); 
			},
			
			onDaysOfYear: function(start, end) { 
				return this.on('dayOfYear', getRange(start, end, 367)); 
			},

			onLastDayOfYear: function() { 
				return this.on('dayOfYear', [367,367]); 
			},
			
			onWeeksOfMonth: function(start, end) { 
				return this.on('weekOfMonth', getRange(start-1, end ? end-1 : end, 6)); 
			},

			onLastWeekOfMonth: function(start, end) { 
				return this.on('weekOfMonth', [6,6]); 
			},
			
			onWeeksOfYear: function(start, end) { 
				return this.on('weekOfYear', getRange(start, end, 52)); 
			},
			
			onMonths: function(start, end) { 
				return this.on('month', getRange(start-1, end ? end-1 : end, 11)); 
			},
			
			onYears: function(start, end) { 
				return this.on('year', getRange(start, end, 3000)); 
			},

			every: function (name, x, range) {
				for (var i = range[0]; i <= range[1]; i += x)
					this.on(name, [i, i]);	

				return this;
			},

			everySecs: function(x, startAt, endAt) {
				return this.every('sec', x, getRange(startAt, endAt, 59, 59));
			},

			everyMins: function(x, startAt, endAt) {
				return this.every('min', x, getRange(startAt, endAt, 59, 59));
			},

			everyHours: function(x, startAt, endAt) {
				return this.every('hour', x, getRange(startAt, endAt, 23, 23));
			},

			everyDaysOfMonth: function(x, startAt, endAt) {
				return this.every('dayOfMonth', x, getRange(startAt, endAt, 32, 32));
			},

			everyDaysOfYear: function(x, startAt, endAt) {
				return this.every('dayOfYear', x, getRange(startAt, endAt, 365, 367));
			},

			everyMonths: function(x, startAt, endAt) {
				return this.every('month', x, getRange(startAt-1, endAt ? endAt-1 : endAt, 11, 11));
			},

			everyYears: function(x, startAt, endAt) {
				return this.every('year', x, getRange(startAt, endAt, 3000, 3000));
			}

		};
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Schedule;
		}
		exports.schedule = Schedule;
	} else {
		root['schedule'] = Schedule;
	}	

}).call(this);


