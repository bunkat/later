
var Schedule = exports = module.exports = function() {

	var START = 0
	  , END = 1
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


	var on = function (ctxt, rName, start, end) {
		var rType = restrictions[rName]
		  , range = getRange(start, end);
		
		if (isInvalid(rType, range[START]) || isInvalid(rType, range[END])) {
			err.push('Error: Invalid input for ' + rName + '.');
		}
		else {
			if (!ctxt[rName]) {
				ctxt[rName] = [];
			}
			ctxt[rName].push(range);			
		}

		return ctxt;
	};


	var every = function (ctxt, rName, x, startAt, endAt) {
		var range = getRange(startAt, endAt);
		for (var i = range[start]; i <= range[end]; i += x)
			on(ctxt, rName, i, i);	

		return ctxt;
	};

	var getRange = function (start, end) {
		var rangeEnd = end ? end : start;
		return start < end ? [start, rangeEnd] : [rangeEnd, start];
	};

	var isInvalid = function (rType, val) {
		var isValidTime = new Date('1/01/2001 ' + val) != 'Invalid Date';
		return !isValidTime && (isNaN(val) || val < rType[START] || val > rType[END]);
	};

	return {
		
		errors: err,

		atTimes: function (start, end) {
			var t1 = new Date('1/01/2001 ' + start);
			var t2 = end ? new Date('1/01/2001 ' + end) : t1;
			return on(this, 'time', t1.toLocaleTimeString(), t2.toLocaleTimeString());	
		},

		onSecs: function(start, end) {
			return on(this, 'sec', start, end); 
		},
		
		onMins: function(start, end) { 
			return on(this, 'min', start, end); 
		},
		
		onHours: function(start, end) { 
			return on(this, 'hour', start, end); 
		},
		
		onDaysOfWeek: function(start, end) { 
			return on(this, 'dayOfWeek', start, end); 
		},
		
		onWeekends: function() { 
			return on(this, 'dayOfWeek', 0, 0).on('dayOfWeek', 6, 6); 
		},
		
		onWeekdays: function() { 
			return on(this, 'dayOfWeek', 1, 5); 
		},
		
		onDaysOfMonth: function(start, end) { 
			return on(this, 'dayOfMonth', start, end); 
		},
		
		onDaysOfYear: function(start, end) { 
			return on(this, 'dayOfYear', start, end); 
		},
		
		onWeeksOfMonth: function(start, end) { 
			return on(this, 'weekOfMonth', start, end); 
		},
		
		onWeeksOfYear: function(start, end) { 
			return on(this, 'weekOfYear', start, end); 
		},
		
		onMonths: function(start, end) { 
			return on(this, 'month', start, end); 
		},
		
		onYears: function(start) { 
			return on(this, 'year', start, start); 
		},

		everyXSecs: function(x, startAt, endAt) {
			return every(this, 'sec', x, startAt, end);
		},

		everyXMins: function(x, startAt, endAt) {
			return every(this, 'min', x, startAt, end);
		},

		everyXHours: function(x, startAt, endAt) {
			return every(this, 'hour', x, startAt, end);
		},

		everyXDaysOfMonth: function(x, startAt, endAt) {
			return every(this, 'dayOfMonth', x, startAt, end);
		},

		everyXDaysOfYear: function(x, startAt, endAt) {
			return every(this, 'dayOfYear', x, startAt, end);
		},

		everyXMonths: function(x, startAt, endAt) {
			return every(this, 'month', x, startAt, end);
		},

		everyXYears: function(x, startAt, endAt) {
			return every(this, 'year', x, startAt, end);
		}

	};

}