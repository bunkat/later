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
    
        // constant array to convert valid names to values
        var NAMES = {
            JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7,
            SEP: 8, OCT: 9, NOV: 10, DEC: 11,
            SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
        };

        var getValue = function(value, offset) {
            return isNaN(value) ? NAMES[value] : +value + (offset || 0);
        };

        var itemSorter = function(a, b) {
            return a.H && !b.H ? 1 : 0; 
        };

        var cloneSchedule = function(sched) {
            var clone = {}, field;

            for(field in sched) {
                clone[field] = sched[field].slice(0);
            }

            return clone;
        };

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
            if (item.asterisk) {
                return;
            }

            var curSched = s.schedules[s.schedules.length-1];

            // add a closest weekday to date constraint
            if (item.W) {
                var except1 = {}, except2 = {};
                if (item.value === 1) {
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

            // add a day instance count restriction
            if (item.H) {
                // if there are no day of week constraints aleady
                // or only one exists and it is already equal to the hash
                if ((!curSched.d && !curSched.dc) || (curSched.dc &&
                     curSched.dc.length === 1 && curSched.dc[0] === item.H)) {
                    // add this constraint to the current schedule
                    add(curSched, 'd', item.value, item.value, 1);
                    add(curSched, 'dc', item.H, item.H, 1);
                } 
                // otherwise we need to create a new schedule to hold
                // this constraint
                else {
                    var clone = cloneSchedule(curSched);
                    clone.d = null;
                    clone.dc = null;
                    add(clone, 'd', item.value, item.value, 1);
                    add(clone, 'dc', item.H, item.H, 1);
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
        };

        var addItems = function(items, schedule, name) {
            for( var i = 0; i < items.length; i++) {
                addItem(items[i], schedule, name);
            }
        };

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

            // parse xW
            if (component.indexOf('W') === component.length - 1) {
                item.W = true;
                component = component.substring(0, component.length - 1);
            }

            // parse xL
            if (component.indexOf('L') === component.length - 1) {
                item.H = -1
                component = component.substring(0, component.length - 1);
            }

            // parse x#y
            var hashSplit = component.split('#');
            if (hashSplit.length === 2) {
                item.H = getValue(hashSplit[1], -1);
                component = hashSplit[0];
            }

            // parse x
            if ((value = getValue(component, offset)) != null) {
                item.value = value;
                return item;
            }

            // parse x-y and x-y/z
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
        };

        var parseAll = function(components, min, max, offset) {
            var items = [];
            
            for (var i = 0; i < components.length; i++) {
                items.push(parseOne(components[i], min, max, offset));
            }

            return items.sort(itemSorter);
        };


        var parseExpr = function(expr) {
            var schedule = {schedules: [{}], exceptions: []}   
              , components = expr.split(' ')
              // names, ranges, and offsets for each of the different fields
              , fields = {
                    s: [0, 0, 59],
                    m: [1, 0, 59],
                    h: [2, 0, 23],
                    D: [3, 1, 31],
                    M: [4, 0, 11, -1],
                    Y: [6, 1970, 2099],
                    d: [5, 0, 6]
                }
              , field, f, component, items;

            for(field in fields) {
                f = fields[field];
                component = components[f[0]];
                if (component) {
                    items = parseAll(component.split(','), f[1], f[2], f[3]);
                    addItems(items, schedule, field);
                }
            }

            return schedule;
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