

var MIN = 0;
var MAX = 1;
var START = 0;
var END = 1;

var restrictions = {
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

var Schedule = exports = module.exports = function Schedule() { 
	this.err = []; 
};

Schedule.prototype.atTimes = function(start, end) {
	var startTime = new Date('1/01/2001 ' + start);
	var endTime = end ? new Date('1/01/2001 ' + end) : startTime;
	return this.on('time', startTime.toLocaleTimeString(), endTime.toLocaleTimeString());	
}

Schedule.prototype.onSecs = function(start, end) {
	return this.on('sec', start, end);
}

Schedule.prototype.onMins = function(start, end) {
	return this.on('min', start, end);
}

Schedule.prototype.onHours = function(start, end) {
	return this.on('hour', start, end);
}

Schedule.prototype.onDaysOfWeek = function(start, end) {
	return this.on('dayOfWeek', x, start, end);
}

Schedule.prototype.onWeekends = function() {
	return this.on('dayOfWeek', 0).on('dayOfWeek', 6);
}

Schedule.prototype.onWeekdays = function() {
	return this.on('dayOfWeek', 1, 5);
}

Schedule.prototype.onDaysOfMonth = function(start, end) {
	return this.on('dayOfMonth', start, end);
}

Schedule.prototype.onDaysOfYear = function(start, end) {
	return this.on('dayOfYear', start, end);
}

Schedule.prototype.onWeeksOfMonth = function(start, end) {
	return this.on('weekOfMonth', start, end);
}

Schedule.prototype.onWeeksOfYear = function(start, end) {
	return this.on('weekOfYear', start, end);
}

Schedule.prototype.onMonths = function(start, end) {
	return this.on('month', start, end);
}

Schedule.prototype.onYears = function(start) {
	return this.on('year', start, start);
}

Schedule.prototype.on = function(rName, start, end) {
	var rType = restrictions[rName];
	if (!rType) {
		this.log('Error: Unknown restriction type ' + rName + ' specified. Skipped.');
		return this;
	}

	var range = getRange(start, end);
	if (isInvalid(rType, range[START]) || isInvalid(rType, range[END])) {
		this.log('Error: Invalid input for restriction type ' + rName + ' specified. Skipped.');
		return this;
	}

	if (!this[rName]) {
		this[rName] = [];
	}

	this[rName].push(range);

	return this;
}

Schedule.prototype.everyXSecs = function(x, start, end) {
	return this.every('sec', x, start, end);
}

Schedule.prototype.everyXMins = function(x, start, end) {
	return this.every('min', x, start, end);
}

Schedule.prototype.everyXHours = function(x, start, end) {
	return this.every('hour', x, start, end);
}

Schedule.prototype.everyXDaysOfMonth = function(x, start, end) {
	return this.every('dayOfMonth', x, start, end);
}

Schedule.prototype.everyXDaysOfYear = function(x, start, end) {
	return this.every('dayOfYear', x, start, end);
}

Schedule.prototype.everyXMonths = function(x, start, end) {
	return this.every('month', x, start, end);
}

Schedule.prototype.everyXYears = function(x, start, end) {
	return this.every('year', x, start, end);
}

Schedule.prototype.every = function(rName, x, start, end) {
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
}

Schedule.prototype.log = function(errMsg) {
	this.err.push(errMsg);
}

var getRange = function(start, end) {
	var rangeEnd = end ? end : start;
	if (start > end) {
		return [rangeEnd, start];
	}

	return [start, rangeEnd];
}

var isInvalid = function(rType, val) {
	var isValidTime = new Date('1/01/2001 ' + val) != 'Invalid Date';
	return !isValidTime && (isNaN(val) || val < rType[MIN] || val > rType[MAX]);
}

exports.schedule = function() {
	return new Schedule();
}