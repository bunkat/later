
var Schedule = function() {

	var MIN = 0 
	  , MAX = 1;
	  , START = 0;
	  , END = 1;
	  , restrictions = {
			time: 			['00:00','23:59'], 
			sec: 			[0,59],
			min: 			[0,59],
			hour: 			[0,23],
			dayOfWeek: 		[0,6],
			dayOfMonth: 	[1,31],
			dayOfYear: 		[1,365],
			weekOfMonth: 	[0,5],
			weekOfYear: 	[0,52],
			month: 			[0,11],
			year: 			[2000,2100]
		}
	  , err = [];


	var on = function (rName, start, end) {
		var rType = restrictions[rName];
		if (!rType) {
			err.push('Error: Unknown restriction type ' + rName + ' specified. Skipped.');
			return this;
		}

		var range = getRange(start, end);
		if (isInvalid(rType, range[START]) || isInvalid(rType, range[END])) {
			err.push('Error: Invalid input for restriction type ' + rName + ' specified. Skipped.');
			return this;
		}

		if (!this[rName]) {
			this[rName] = [];
		}

		this[rName].push(range);

		return this;
	};


	var every = function (rName, x, start, end) {
		if (x === 1) {
			this.on(rName, start, end);
		}
		else {
			var range = getRange(start, end);
			for (var i = range[start]; i <= range[end]; i += x) {
				this.on(rName, i);
			}		
		}

		return this;
	};

	var getRange = function (start, end) {
		var rangeEnd = end ? end : start;
		if (start > end) {
			return [rangeEnd, start];
		}

		return [start, rangeEnd];
	};

	var isInvalid = function (rType, val) {
		var isValidTime = new Date('1/01/2001 ' + val) != 'Invalid Date';
		return !isValidTime && (isNaN(val) || val < rType[MIN] || val > rType[MAX]);
	};

	return {
		
		errors: err,

		atTimes: function (start, end) {
			var t1 = new Date('1/01/2001 ' + start);
			var t2 = end ? new Date('1/01/2001 ' + end) : startTime;
			return this.on('time', t1.toLocaleTimeString(), t2.toLocaleTimeString());	
		},

		onSecs: function(start, end) { 
			return on('sec', start, end); 
		},
		
		onMins: function(start, end) { 
			return on('min', start, end); 
		},
		
		onHours: function(start, end) { 
			return on('hour', start, end); 
		},
		
		onDaysOfWeek: function(start, end) { 
			return on('dayOfWeek', x, start, end); 
		},
		
		onWeekends: function() { 
			return on('dayOfWeek', 0).on('dayOfWeek', 6); 
		},
		
		onWeekdays: function() { 
			return on('dayOfWeek', 1, 5); 
		},
		
		onDaysOfMonth: function(start, end) { 
			return on('dayOfMonth', start, end); 
		},
		
		onDaysOfYear: function(start, end) { 
			return on('dayOfYear', start, end); 
		},
		
		onWeeksOfMonth: function(start, end) { 
			return on('weekOfMonth', start, end); 
		},
		
		onWeeksOfYear: function(start, end) { 
			return on('weekOfYear', start, end); 
		},
		
		onMonths: function(start, end) { 
			return on('month', start, end); 
		},
		
		onYears: function(start) { 
			return on('year', start, start); 
		},

		everyXSecs = function(x, start, end) {
			return every('sec', x, start, end);
		},

		everyXMins = function(x, start, end) {
			return every('min', x, start, end);
		},

		everyXHours = function(x, start, end) {
			return every('hour', x, start, end);
		},

		everyXDaysOfMonth = function(x, start, end) {
			return every('dayOfMonth', x, start, end);
		},

		everyXDaysOfYear = function(x, start, end) {
			return every('dayOfYear', x, start, end);
		},

		everyXMonths = function(x, start, end) {
			return every('month', x, start, end);
		},

		everyXYears = function(x, start, end) {
			return every('year', x, start, end);
		}

	};

})

exports.schedule = function() {
	return new Schedule();
}