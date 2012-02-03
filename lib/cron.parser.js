/**
* Later.js 0.0.1
* (c) 2012 Bill, BunKat LLC.
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://bunkat.github.com/later
*/
(function () {

  	/**
   	* Parses a cron expression and produces a schedule that is compatible
   	* with Later.  See http://en.wikipedia.org/wiki/Cron for details of
   	* the format.
   	*/
	var CronParser = function () {
	
		// constant array to convert valid names to values
		var NAMES = {
			JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7,
			SEP: 8, OCT: 9, NOV: 10, DEC: 11,
			SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
		}


		var parseExpr = function(expr) {
			var schedule = {schedules: [{}], exceptions: []};	
			
			var components = expr.split(' ')
			  , seconds = components[0]
			  , minutes = components[1]
			  , hours = components[2]
			  , dayOfMonth = components[3]
			  , month = components[4]
			  , dayOfWeek = components[5]
			  , year = components.length === 7 ? components[6] : '*';

			// parse each of the components and add to the schedule
			addItems(parseAll(seconds, 0, 59), schedule, 's');
			addItems(parseAll(minutes, 0, 59), schedule, 'm');
			addItems(parseAll(hours, 0, 23), schedule, 'h');
			addItems(parseAll(dayOfMonth,1,31), schedule, 'D');
			addItems(parseAll(month,0,11,-1), schedule, 'M');
			addItems(parseAll(year,1970,2099), schedule, 'Y');

			// day of week goes last since they require the use
			// of composite schedules
			addItems(parseAll(dayOfWeek,0,6), schedule, 'd');

			return schedule;
		}

		var parseAll = function(component, min, max, offset) {

			var splitComponents = component.split(',')
			  , items = [];
			
			for (var i = 0; i < splitComponents.length; i++) {
				items.push(parseOne(splitComponents[i], min, max, offset));
			}

			return items;
		}

		var parseOne = function(component, min, max, offset) {
			var item = {}
			  , value;

			// parse * and ?
			if (component === '*' || component === '?') {
				item.asterisk = true;
				return item;
			}

			// parse L (and make it work for everything, not just day of month)
			if (component === 'L') {
				item.value = min - 1;
				return item;
			}

			// parse trailing W
			if (component.indexOf('W') === component.length - 1) {
				item.W = true;
				component = component.substring(0, component.length - 1);
			}

			// parse trailing L
			if (component.indexOf('L') === component.length - 1) {
				item.L = true;
				component = component.substring(0, component.length - 1);
			}

			// parse x
			if ((value = getValue(component, offset)) != null) {
				item.value = value;
				return item;
			}

			// finally parse x-y and x-y/z
			var incSplit = component.split('/');
			item.inc = incSplit.length === 2 ? +incSplit[1] : 1;

			if (incSplit[0] === '*' || incSplit[0] === '0') {
				item.range = [min, max];
			} else {
				var rangeSplit = incSplit[0].split('-')
				  , minR = getValue(rangeSplit[0], offset)
				  , maxR = getValue(rangeSplit[1], offset);
				item.range = [minR, maxR ? maxR : minR];
			}

			return item;
		}

		var getValue = function(value, offset) {
			if (!isNaN(value)) {
				return +value + (offset || 0);
			}
			return NAMES[value];
		}


		var itemSorter = function(a, b) {
			if ((b.L || b.H) && !(a.L || a.H)) {
				return -1;
			}		

			if ((a.L || a.H) && !(b.L || b.H)) {
				return 1;
			}			

			return 0;
		}

		var addItems = function(items, schedule, name) {
			var sortedItems = items.sort(itemSorter);
			for( var i = 0; i < sortedItems.length; i++) {
				addItem(sortedItems[i], schedule, name);
			}
		}


		var cloneSchedule = function(sched) {
			var clone = {};
			for(var field in sched) {
				clone[field] = sched[field].slice(0);
			}
			return clone;
		}



		var addItem = function(item, s, name) {
			if (item.asterisk) {
				return;
			}

			var curSched = s.schedules[s.schedules.length-1];

			// add a closest weekday to date constraint
			if (item.W) {
				var except1 = {}, except2 = {};
				if (item.value === 1) {
					add(curSched, 'D', 1, 3, 1);
					add(curSched, 'd', 1, 5, 1);
					add(except1, 'D', 2, 2, 1);
					add(except1, 'd', 2, 5, 1);	
					add(except2, 'D', 3, 3, 1);
					add(except2, 'd', 2, 5, 1);	
				} else {
					var v = item.value;
					add(curSched, 'D', v-1, v+1, 1);
					add(curSched, 'd', 1, 5, 1);
					add(except1, 'D', v-1, v-1, 1);
					add(except1, 'd', 1, 4, 1);	
					add(except2, 'D', v+1, v+1, 1);
					add(except2, 'd', 2, 5, 1);					
				}
				s.exceptions.push(except1);
				s.exceptions.push(except2);
				return;
			}

			// add a last day count of week day constraint
			if (item.L) {
				// if there are no day of week constraints aleady
				// or only one exists and it is already last day
				if ((!curSched.d && !curSched.dc) || (curSched.dc &&
				     curSched.dc.length === 1 && curSched.dc[0] === -1)) {
					// add this constraint to the current schedule
					add(curSched, 'd', item.value, item.value, 1);
					add(curSched, 'dc', -1, -1, 1);
				} 
				// otherwise we need to create a new schedule to hold
				// this constraint
				else {
					var clone = cloneSchedule(curSched);
					clone.d = null;
					clone.dc = null;
					add(clone, 'd', item.value, item.value, 1);
					add(clone, 'dc', -1, -1, 1);
					s.schedules.push(clone);							
				}
				return;
			}

			// add a single value
			if (item.value != null) {
				add(curSched, name, item.value, item.value, 1);
				return;
			}

			// add a range of values
			if (item.range != null) {
				add(curSched, name, item.range[0], item.range[1], item.inc);
				return;
			}
		}

		var add = function (sched, name, min, max, inc) {
			if (!sched[name]) {
				sched[name] = [];
			}

			var cur = sched[name];
			for (var i = min; i <= max; i += inc) {
				if (cur.indexOf(i) < 0) {
					cur.push(i);
				}	
			}		
		};

		return {

		  	/**
		   	* Parses a valid cron expression and produces a valid schedule that
		   	* can then be used with Later.
		   	*
		   	* CronParser().parse('* 5 * * * * *');
		   	*
		   	* @param {String} expr: The cron expression to parse
		   	* @param {Bool} hasSeconds: True if the expression uses a seconds field
		   	* @api public
		   	*/
			parse: function (expr, hasSeconds) { 
				var e = expr.toUpperCase();
				return parseExpr(hasSeconds ? e : '* ' + e); 
			}

		};
	};

  	/**
   	* Allow library to be used within both the browser and node.js
   	*/
	if (typeof exports !== 'undefined') {
		exports = module.exports = CronParser;
	} else {
		this.cronParser = CronParser;
	}	

}).call(this);