/**
* Later.js 0.0.1
* (c) 2012 Bill, BunKat LLC.
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://bunkat.github.com/later
*/
(function () {

    "use strict";

    /**
    * Parses a cron expression and produces a schedule that is compatible
    * with Later.js.  See http://en.wikipedia.org/wiki/Cron for details of
    * the cron format.
    */
    var CronParser = function () {
    
        // Constant array to convert valid names to values
        var NAMES = {
            JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7,
            SEP: 8, OCT: 9, NOV: 10, DEC: 11,
            SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
        };

        // Contains the index, min, and max for each of the constraints
        var FIELDS = {
            s: [0, 0, 59],      // seconds
            m: [1, 0, 59],      // minutes
            h: [2, 0, 23],      // hours
            D: [3, 1, 31],      // day of month
            M: [4, 0, 11, -1],  // month
            Y: [6, 1970, 2099], // year
            d: [5, 0, 6]        // day of week
        };

        /**
        * Returns the value + offset if value is a number, otherwise it
        * attempts to look up the value in the NAMES table and returns
        * that result instead. 
        *
        * @param {Int,String} value: The value that should be parsed
        * @param {Int} offset: Any offset that must be added to the value
        */
        var getValue = function(value, offset) {
            return isNaN(value) ? NAMES[value] : +value + (offset || 0);
        };

        /**
        * Returns a deep clone of a schedule skipping any day of week
        * constraints.
        *
        * @param {Sched} sched: The schedule that will be cloned
        */
        var cloneSchedule = function(sched) {
            var clone = {}, field;

            for(field in sched) {
                if (field !== 'dc' && field !== 'd') {
                    clone[field] = sched[field].slice(0);
                }
            }

            return clone;
        };

        /**
        * Adds values to the specified constraint in the current schedule.
        *
        * @param {Sched} sched: The schedule to add the constraint to
        * @param {String} name: Name of constraint to add
        * @param {Int} min: Minimum value for this constraint
        * @param {Int} max: Maximum value for this constraint
        * @param {Int} inc: The increment to use between min and max
        */
        var add = function (sched, name, min, max, inc) {
            var i = min;

            if (!sched[name]) {
                sched[name] = [];
            }

            while (i <= max) {
                if (sched[name].indexOf(i) < 0) {
                    sched[name].push(i);
                } 
                i += inc || 1;              
            }       
        };

        /**
        * Adds a hash item (of the form x#y or xL) to the schedule.  
        *
        * @param {Schedule} schedules: The current schedule array to add to
        * @param {Schedule} curSched: The current schedule to add to
        * @param {Int} value: The value to add (x of x#y or xL)
        * @param {Int} hash: The hash value to add (y of x#y)
        */
        var addHash = function(schedules, curSched, value, hash) {
            // if there are any existing day of week constraints that
            // aren't equal to the one we're adding, create a new
            // composite schedule
            if ((curSched.d && !curSched.dc) || 
                    (curSched.dc && curSched.dc.indexOf(hash) < 0)) {
                schedules.push(cloneSchedule(curSched));
                curSched = schedules[schedules.length-1];
            }

            add(curSched, 'd', value, value);
            add(curSched, 'dc', hash, hash);          
        };


        var addWeekday = function(s, curSched, value) {
             var except1 = {}, except2 = {};
             if (value=== 1) {
                // cron doesn't pass month boundaries, so if 1st is a
                // weekend then we need to use 2nd or 3rd instead
                add(curSched, 'D', 1, 3);
                add(curSched, 'd', 1, 5);
                add(except1, 'D', 2, 2);
                add(except1, 'd', 2, 5); 
                add(except2, 'D', 3, 3);
                add(except2, 'd', 2, 5); 
            } else {
                // normally you want the closest day, so if v is a
                // Saturday, use the previous Friday.  If it's a
                // sunday, use the following Monday.
                add(curSched, 'D', value-1, value+1);
                add(curSched, 'd', 1, 5);
                add(except1, 'D', value-1, value-1);
                add(except1, 'd', 1, 4); 
                add(except2, 'D', value+1, value+1);
                add(except2, 'd', 2, 5);                 
            }
            s.exceptions.push(except1);
            s.exceptions.push(except2);           
        };

        /**
        * Adds a range item (of the form x-y/z) to the schedule.  
        *
        * @param {String} item: The cron expression item to add
        * @param {Schedule} curSched: The current schedule to add to
        * @param {String} name: The name to use for this constraint
        * @param {Int} min: The min value for the constraint
        * @param {Int} max: The max value for the constraint
        * @param {Int} offset: The offset to apply to the cron value
        */
        var addRange = function(item, curSched, name, min, max, offset) {
            // parse range/x
            var incSplit = item.split('/')
              , inc = +incSplit[1]
              , range = incSplit[0];

            // parse x-y or * or 0
            if (range !== '*' && range !== '0') {
                var rangeSplit = range.split('-');
                min = getValue(rangeSplit[0], offset);
                max = getValue(rangeSplit[1], offset);
            }
            add(curSched, name, min, max, inc);           
        };

        /**
        * Parses a particular item within a cron expression.  
        *
        * @param {String} item: The cron expression item to parse
        * @param {Schedule} s: The existing set of schedules
        * @param {String} name: The name to use for this constraint
        * @param {Int} min: The min value for the constraint
        * @param {Int} max: The max value for the constraint
        * @param {Int} offset: The offset to apply to the cron value
        */
        var parse = function(item, s, name, min, max, offset) {
            var value
              , split
              , schedules = s.schedules
              , curSched = schedules[schedules.length-1];

            // L just means min - 1 (this also makes it work for any field)
            if (item === 'L') {
                item = min - 1;
            }
            
            // parse x
            if ((value = getValue(item, offset)) != null) {
                add(curSched, name, value, value);
            }
            // parse xW
            else if ((value = getValue(item.replace('W', ''), offset)) != null) {
                addWeekday(s, curSched, value);
            }
            // parse xL
            else if ((value = getValue(item.replace('L', ''), offset)) != null) {
                addHash(schedules, curSched, value, min-1);
            }
            // parse x#y
            else if ((split = item.split('#')).length === 2) {
                value = getValue(split[0], offset);
                addHash(schedules, curSched, value, getValue(split[1], -1));
            }
            // parse x-y or x-y/z or */z or 0/z 
            else {
                addRange(item, curSched, name, min, max, offset);
            }
            
        };

        /**
        * Returns true if the item is either of the form x#y or xL.
        *
        * @param {String} item: The expression item to check
        */
        var isHash = function(item) {
            return item.indexOf('#') > -1 || item.indexOf('L') > 0;
        };


        var itemSorter = function(a,b) {
          return isHash(a) && !isHash(b) ? 1 : 0; 
        };

        /**
        * Parses each of the fields in a cron expression.  The expression must
        * include the seconds field, the year field is optional.
        *
        * @param {String} expr: The cron expression to parse
        */
        var parseExpr = function(expr) {
            var schedule = {schedules: [{}], exceptions: []}   
              , components = expr.split(' ')
              , field, f, component, items, i;

            for(field in FIELDS) {
                f = FIELDS[field];
                component = components[f[0]];
                if (component && component !== '*' && component !== '?') {
                    // need to sort so that any #'s come last, otherwise
                    // schedule clones to handle # won't contain all of the 
                    // other constraints
                    items = component.split(',').sort(itemSorter);
                    for (i = 0; i < items.length; i++) {    
                        parse(items[i], schedule, field, f[1], f[2], f[3]);
                    }
                }
            }

            return schedule;
        };

        return {

            /**
            * Parses a valid cron expression and produces a valid schedule that
            * can then be used with Later.
            *
            * CronParser().parse('* 5 * * * * *', true);
            *
            * @param {String} expr: The cron expression to parse
            * @param {Bool} hasSeconds: True if the expression uses a seconds field
            * @api public
            */
            parse: function (expr, hasSeconds) { 
                var e = expr.toUpperCase();
                return parseExpr(hasSeconds ? e : '0 ' + e); 
            }

        };
    };

    /**
    * Allow library to be used within both the browser and node.js
    */
    if (typeof exports !== 'undefined') {
        module.exports = CronParser;
    } else {
        this.cronParser = CronParser;
    }   

}).call(this);