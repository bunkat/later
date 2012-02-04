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
    * with Later.  See http://en.wikipedia.org/wiki/Cron for details of
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
            if (!sched[name]) {
                sched[name] = [];
            }

            for (var i = min; i <= max; i += inc) {
                if (sched[name].indexOf(i) < 0) {
                    sched[name].push(i);
                }   
            }       
        };

        var addItem = function(item, s, name) {
            var curSched = s.schedules[s.schedules.length-1];

            // add a closest weekday to date constraint
            if (item.W) {
                var except1 = {}, except2 = {};
                if (item.v === 1) {
                    // cron doesn't pass month boundaries, so if 1st is a
                    // weekend then we need to use 2nd or 3rd instead
                    add(curSched, 'D', 1, 3, 1);
                    add(curSched, 'd', 1, 5, 1);
                    add(except1, 'D', 2, 2, 1);
                    add(except1, 'd', 2, 5, 1); 
                    add(except2, 'D', 3, 3, 1);
                    add(except2, 'd', 2, 5, 1); 
                } else {
                    // normally you want the closest day, so if v is a
                    // Saturday, use the previous Friday.  If it's a
                    // sunday, use the following Monday.
                    var v = item.v;
                    add(curSched, 'D', v-1, v+1, 1);
                    add(curSched, 'd', 1, 5, 1);
                    add(except1, 'D', v-1, v-1, 1);
                    add(except1, 'd', 1, 4, 1); 
                    add(except2, 'D', v+1, v+1, 1);
                    add(except2, 'd', 2, 5, 1);                 
                }
                s.exceptions.push(except1);
                s.exceptions.push(except2);
            }
            // add a day instance count restriction
            else if (item.H) {
                // if there are any existing day of week constraints that
                // aren't equal to the one we're adding, create a new
                // schedule
                if ((curSched.d && !curSched.dc) || 
                        (curSched.dc && curSched.dc.indexOf(item.H) < 0)) {
                    s.schedules.push(cloneSchedule(curSched));
                    curSched = s.schedules[s.schedules.length-1];
                }

                add(curSched, 'd', item.v, item.v, 1);
                add(curSched, 'dc', item.H, item.H, 1);
            }             
            // add a single value
            else if (item.v != null) {
                add(curSched, name, item.v, item.v, 1);
            }
            // add a range of values
            else if (item.r) {
                add(curSched, name, item.r[0], item.r[1], item.inc || 1);
            }
        };

        var parseOne = function(component, min, max, offset) {
            var item = {}
              , value;

            // parse L (and make it work for everything, not just day of month)
            if (component === 'L') {
                item.v = min - 1;
                return item;
            }

            // parse xW
            if (component.indexOf('W') > -1) {
                item.W = true;
                component = component.replace('W', '');
            }

            // parse xL
            if (component.indexOf('L') > -1) {
                item.H = min - 1
                component = component.replace('L', '');
            }

            // parse x#y
            if (component.indexOf('#') > -1) {
                var hashSplit = component.split('#');
                item.H = getValue(hashSplit[1], -1);
                component = hashSplit[0];
            }

            // parse x
            if ((value = getValue(component, offset)) != null) {
                item.v = value;
                return item;
            }

            // parse x/z
            if (component.indexOf('/') > -1) {
                var incSplit = component.split('/');
                item.inc = +incSplit[1];
                component = incSplit[0];
            }

            // parse x-y
            if (component === '*' || component === '0') {
                item.r = [min, max];
            } else {
                var rangeSplit = component.split('-')
                  , minR = getValue(rangeSplit[0], offset)
                  , maxR = getValue(rangeSplit[1], offset);
                item.r = [minR, maxR ? maxR : minR];
            }

            return item;
        };

        var parseAll = function(components, min, max, offset) {
            var items = [], i;
            
            for (i = 0; i < components.length; i++) {
                items.push(parseOne(components[i], min, max, offset));
            }

            // sort items to make sure that any hash values are at the end
            return items.sort(function(a, b){return a.H && !b.H ? 1 : 0;});
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
              , field, f, component, items;

            for(field in FIELDS) {
                f = FIELDS[field];
                component = components[f[0]];
                if (component && component != '*' && component != '?') {
                    items = parseAll(component.split(','), f[1], f[2], f[3]);
                    for( var i = 0; i < items.length; i++) {
                        addItem(items[i], schedule, field);
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
        exports = module.exports = CronParser;
    } else {
        this.cronParser = CronParser;
    }   

}).call(this);