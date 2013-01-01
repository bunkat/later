if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}/**
* Later.js 0.0.1
* (c) 2012 Bill, BunKat LLC.
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://bunkat.github.com/later
*/
(function() {

    "use strict";

    /**
    * Calculates the next occurrence (or occcurrences) of a given schedule.
    * Schedules are simply a set of constraints that must be met for a 
    * particular date to be valid. Schedules can be generated using Recur or
    * can be created directly.  
    *
    * Schedules have the following form:
    *
    * {
    *   schedules: [
    *       {
    *           constraintId: [valid values],
    *           constraintId: [valid values],
    *           ...
    *       },
    *       {
    *           constraintId: [valid values],
    *           constraintId: [valid values],
    *           ...
    *       }
    *       ...
    *   ],
    *   exceptions: [
    *       {
    *           constraintId: [valid values],
    *           constraintId: [valid values],
    *           ...         
    *       },
    *       {
    *           constraintId: [valid values],
    *           constraintId: [valid values],
    *           ...         
    *       },
    *       ...
    *   ]   
    * }
    *
    * See Recur.js for the available constraints and their value ranges.  May
    * also be useful to create a schedule using Recur and then examining the
    * schedule that is produced.
    */

    /**
    * Initializes the Later object. 
    *
    * @param {Int} resolution: Minimum number of seconds between occurrences
    * @param {Bool} useLocalTime: True if local time zone should be used
    * @api public
    */
    var Later = function(resolution, useLocalTime) {

        var isLocal = useLocalTime || false
          , get = 'get' + (isLocal ? '' : 'UTC')
          , exec = true
          
          // constants
          , SEC = 1000
          , MIN = SEC * 60
          , HOUR = MIN * 60
          , DAY = HOUR * 24

          // aliases for common math functions
          , ceil = Math.ceil        
          , floor = Math.floor
          , max = Math.max

          // data prototypes to switch between UTC and local time calculations
          , dateProto = Date.prototype
          , getYear = dateProto[get + 'FullYear']
          , getMonth = dateProto[get + 'Month']
          , getDate = dateProto[get + 'Date']
          , getDay = dateProto[get + 'Day']
          , getHour = dateProto[get + 'Hours']
          , getMin = dateProto[get + 'Minutes']
          , getSec = dateProto[get + 'Seconds'];

          // minimum time between valid occurrences in seconds
          if (resolution == null) resolution = 1;

        /**
        * Finds the next valid value which is either the next largest valid
        * value or the minimum valid value if no larger value exists. To
        * simplify some calculations, the min value is then added to a specified
        * offset.  
        * 
        * For example, if the current minute is 5 and the next valid 
        * value is 1, the offset will be set to 60 (max number of minutes) and
        * nextInRange will return 61. This is the number of minutes that must
        * be added to the current hour to get to the next valid minute.
        *
        * @param {Int/String} val: The current value
        * @param {[]} values: Array of possible valid values
        * @param {Int/String} minOffset: Value to add to the minimum value
        */
        var nextInRange = function(val, values, minOffset) {
            var cur, next, min = values[0], i = values.length;
            while (i--) {
                cur = values[i];
                if (cur === val) {
                    return val;
                }
                min = cur < min ? cur : min;
                next = cur > val && (!next || cur < next) ? cur : next;             
            }

            return next || (min + minOffset);
        };

        /**
        * Builds and returns a new Date using the specified values.  Date
        * returned is either using Local time or UTC based on isLocal. 
        *
        * @param {Int} yr: Four digit year
        * @param {Int} mt: Month between 0 and 11
        * @param {Int} dt: Date between 1 and 31
        * @param {Int} hr: Hour between 0 and 23, defaults to 0
        * @param {Int} mn: Minute between 0 and 59, defaults to 0
        * @param {Int} sc: Second between 0 and 59, defaults to 0
        */
        var date = function(yr, mt, dt, hr, mn, sc) {
            return isLocal ? new Date(yr, mt, dt, hr || 0, mn || 0, sc || 0) :
                new Date(Date.UTC(yr, mt, dt, hr || 0, mn || 0, sc || 0));
        };

        /**
        * Pads a digit with a leading zero if it is less than 10.
        *
        * @param {Int} val: The value that needs to be padded
        */
        var pad = function(val) {
            return (val < 10 ? '0' : '') + val;
        };

        /**
        * Calculates the next valid occurrence of a particular schedule that 
        * occurs on or after the specified start time. 
        *
        * @param {object} schedule: Valid schedule object containing constraints
        * @param {Date} start: The first possible valid occurrence
        */
        var getNextForSchedule = function(sched, start, end) {
            var next, inc, x, cur
              , Y, M, D, d, h, m, s
              , oJan1, oMonthStart, oWeekStart, oWeekStartY, oMonthEnd
              , oDec31
              , t, dy, wy, wm, dc
              , daysInYear, daysInMonth, firstDayOfMonth
              , weekStart, weeksInYear, weeksInMonth
              , maxLoopCount = 1000;

            // handle any after constraints
            next = after(start, sched);

            // It's not pretty, but just keep looping through all of the
            // constraints until they have all been met (or no valid 
            // occurrence exists). All calculations are done just in time and 
            // and only once to prevent extra work from being done each loop.
            while (next && maxLoopCount--) {

                // make sure we are still with in the boundaries
                if (end && next.getTime() > end.getTime()) {
                    return null;
                }

                // check year
                Y = getYear.call(next);
                if (sched.Y && (inc = nextInRange(Y, sched.Y, 0)) !== Y ) {
                    next = inc > Y ? date(inc,0,1) : null;
                    continue;
                }


                // check day of year (one based)
                oJan1 = date(Y, 0, 1);
                oDec31 = date(Y + 1, 0, 0);
                if (sched.dy) {
                    dy = ceil((next.getTime() - oJan1.getTime() + 1)/DAY);
                    daysInYear = ceil((oDec31.getTime() - oJan1.getTime() + 1)/DAY);                    
                    if ((inc = nextInRange(dy, sched.dy, daysInYear)) !== dy) {
                        next = date(Y, 0, inc);
                        continue;
                    } 
                }

                // check month (one based)
                M = getMonth.call(next);
                if (sched.M && (inc = nextInRange(M+1, sched.M, 12)) !== M+1) {
                    next = date(Y, inc-1, 1);
                    continue;
                }

                // check week of year (one based, ISO week)
                D = getDate.call(next);
                d = getDay.call(next);
                if (sched.wy) {
                    oWeekStart = date(Y, M, D + 4 - (d || 7));
                    oWeekStartY = date(getYear.call(oWeekStart),0,1);
                    weeksInYear = getDay.call(oJan1) === 4 ||
                        getDay.call(oDec31) === 4 ? 53 : 52;
                    
                    wy = ceil((((oWeekStart.getTime()-oWeekStartY.getTime())/DAY)+1)/7);
                    if ((inc = nextInRange(wy, sched.wy, weeksInYear)) !== wy) {
                        next = date(
                                getYear.call(oWeekStart),
                                getMonth.call(oWeekStart),
                                getDate.call(oWeekStart) - 3 + (inc - wy) * 7);
                        continue;
                    }
                }

                // check date of month (one based)
                oMonthEnd = date(Y, M + 1, 0);
                daysInMonth = getDate.call(oMonthEnd);
                if (sched.D && (inc = nextInRange(D, sched.D, daysInMonth)) !== D) {
                    next = date(Y, M, inc);
                    continue;
                }

                // check week of month (one based, 0 for last week of month)
                if (sched.wm) {
                    firstDayOfMonth = getDay.call(date(Y, M, 1));
                    wm = floor((((D + firstDayOfMonth - 1)/7))+1);
                    weeksInMonth = floor((((daysInMonth + firstDayOfMonth - 1)/7))+1);
                    if ((inc = nextInRange(wm, sched.wm, weeksInMonth)) !== wm) {
                        // jump to the Sunday of the desired week, making sure not
                        // to double count the last week in the month if we cross
                        // a month boundary, set to 1st of month for week 1
                        next = date(Y, M,
                            (inc-1) * 7 - (firstDayOfMonth - 1) -
                            (inc > weeksInMonth && getDay.call(oMonthEnd) < 6 ? 7 : 0) +
                            (inc === weeksInMonth + 1 ? getDay.call(oMonthEnd) + 1 : 0));
                        continue;
                    }
                }

                // check day of week (zero based)
                if (sched.d && (inc = nextInRange(d+1, sched.d, 7)) !== d+1) {
                    next = date(Y, M, D + (inc-1) - d);
                    continue;
                }

                // check day of week count (one based, 0 for last instance)
                if (sched.dc) {
                    dc = floor((D - 1) / 7) + 1;
                    if ((inc = nextInRange(dc, sched.dc, 0)) !== dc) {
                        if (inc > 0) {
                            next = date(Y, M + (inc < dc ? 1 : 0), 1 + (7 * (inc-1)));
                            continue;
                        }
                        //special last day instance of month constraint
                        if (inc < 1 && D < (daysInMonth - 6)) {
                            next = date(Y, M, daysInMonth - 6);
                            continue;
                        }
                    }
                }

                // check hour of day (zero based)
                h = getHour.call(next);
                if (sched.h && (inc = nextInRange(h, sched.h, 24)) !== h) {
                    next = date(Y, M, D, inc);
                    continue;
                }

                // check minute of hour (zero based)
                m = getMin.call(next);
                if (sched.m && (inc = nextInRange(m, sched.m, 60)) !== m) {
                    next = date(Y, M, D, h, inc);
                    continue;
                }

                // check second of minute (zero based)
                s = getSec.call(next);
                if (sched.s && (inc = nextInRange(s, sched.s, 60)) !== s) {
                    next.setSeconds(inc);
                    next = date(Y, M, D, h, m, inc);
                    continue;
                }

                // check time of day (24-hr)
                if (sched.t) {
                    t = pad(h) +':'+ pad(m) +':'+ pad(s);
                    if ((inc = nextInRange(t, sched.t, '')) !== t) {
                        x = inc.split(':');
                        next = date(Y, M, D + (t > inc ? 1 : 0), x[0], x[1], x[2]);
                        continue;
                    }
                }

                // if we make it this far, all constraints have been met
                break;
            }

            return maxLoopCount > 0 ? next : null;
        };

        /**
        * Increments a date by a given amount of time.  Date
        * returned is either using Local time or UTC based on isLocal. 
        *
        * @param {Int} yr: Number of years to increment by
        * @param {Int} mt: Number of months to increment by
        * @param {Int} dt: Number of days to increment by
        * @param {Int} hr: Number of hours to increment by
        * @param {Int} mn: Number of minutes to increment by
        * @param {Int} sc: Number of seconds to increment by
        */
        var after = function (start, sched) {
            var yr = getYear.call(start) + getAfter(sched.aY)
              , mt = getMonth.call(start) + getAfter(sched.aM)
              , dt = getDate.call(start) + 
                    max(getAfter(sched.aD), getAfter(sched.ady), getAfter(sched.ad),
                        getAfter(sched.awy) * 7, getAfter(sched.awm) * 7)
              , hr = getHour.call(start) + getAfter(sched.ah)
              , mn = getMin.call(start) + getAfter(sched.am)
              , sc = getSec.call(start) + getAfter(sched.as);

            return date(yr, mt, dt, hr, mn, sc);
        }

        /**
        * Returns the value of an after constraint or 0 if not set. 
        *
        * @param {Array} constraint: After constrant to check
        */
        var getAfter = function (constraint) {
            return constraint && constraint[0] ? constraint[0] : 0;
        }

        /**
        * Returns a new date object that represents the next possible valid
        * occurrence based on the resolution that has beeen configured.
        *
        * @param {Date} date: The Date object to be incremented
        */
        var tick = function (date) {
            return new Date(date.getTime() + (resolution * 1000));
        };

        return {

            /**
            * Returns true if the specified date meets all of the constraints
            * defined within the specified schedule. 
            *
            * @param {Recur} recur: Set of schedule and exception constraints
            * @param {Date} date: The date to validate against
            * @api public
            */
            isValid: function (recur, date) {
                date.setMilliseconds(0);
                return date.getTime() === this.getNext(recur, date).getTime();
            },

            /**
            * Returns the next one or more valid occurrences of a schedule. 
            *
            * @param {Recur} recur: Set of schedule and exception constraints
            * @param {Int} count: The number of occurrences to return
            * @param {Date} startDate: The initial date to start looking from
            * @param {Date} endDate: The last date to include
            * @api public
            */
            get: function (recur, count, startDate, endDate) {
                var occurrences = []                
                  , date;
                 
                while (count-- > 0 && (date = 
                        this.getNext(recur, date || startDate, endDate))) {
                    occurrences.push(date);
                    date = tick(date);
                }

                return occurrences;
            },

            /**
            * Returns the next valid occurrence of a schedule. 
            *
            * @param {Recur} recur: Set of schedule and exception constraints
            * @param {Date} startDate: The initial date to start looking from
            * @param {Date} endDate: The last date to include
            * @api public
            */
            getNext: function (recur, startDate, endDate) {
                var schedules = recur.schedules || []
                  , exceptions = {schedules: recur.exceptions || []}
                  , start = startDate || new Date()               
                  , date, tDate
                  , i = schedules.length;
                
                // return null if we're past the specified end date
                if (endDate && startDate.getTime() > endDate.getTime()) {
                    return null;
                }
                                    
                while(i--) {
                    tDate = getNextForSchedule(schedules[i], start, endDate);
                    if (!date || (tDate < date)) {
                        date = tDate;
                    }
                }

                if (date && exceptions.schedules.length > 0 &&
                        this.isValid (exceptions, date)) {
                    date = this.getNext(recur, tick(date));
                }

                return date;                
            },

            /**
            * Executes the provided callback on the provided recurrence 
            * schedule. Returns true if the timer was started.
            *
            * @param {Recur} recur: Set of schedule and exception constraints
            * @param {Date} startDate: The initial date to start looking from
            * @param {Func} callback: The function to execute
            * @param {arg[]} arg: Argument or array of arguments to pass to the
            *                     callback
            * @api public
            */
            exec: function (recur, startDate, callback, arg) {
                var next = this.getNext(recur, tick(startDate));

                if (next) {
                    next = next.getTime() - (new Date()).getTime();

                    // reschedule the exec if the delay is greater than 2^31-1 
                    // otherwise setTimeout will be called immediately
                    if (next > 2147483647) {
                        exec = setTimeout(this.exec, 2147483647, recur, startDate, callback, arg);
                    }
                    else {
                        exec = setTimeout(this.handleExec, next, this, recur, callback, arg);
                    }

                    return true;
                }
            },

            /**
            * Immediately stops the execution of the current timer if one
            * exists.
            *
            * @api public
            */
            stopExec: function () {
                if (exec) {
                    clearTimeout(exec);
                    exec = false;
                }
            },

            /**
            * Handles the execution of the timer.
            *
            * @param {Later} later: The context to execute within
            * @param {Recur} recur: The set of constraints to use
            * @param {Func} callback: The function to execute
            * @param {arg[]} arg: Argument or array of arguments to pass to the
            *                     callback
            */
            handleExec: function (later, recur, callback, arg) {
                callback(arg);
                if (exec) {
                    later.exec(recur, (new Date()), callback, arg);
                }
            }

        };
    };

    /**
    * Allow library to be used within both the browser and node.js
    */
    var root = typeof exports !== "undefined" && exports !== null ? exports : window;
    root.later = Later;

}).call(this);



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
    * Simple API for generating valid schedules for Later.js.  All commands
    * are chainable.
    * 
    * Example:
    *
    * Every 5 minutes between minutes 15 and 45 of each hour and also 
    * at 9:00 am every day, except in the months of January and February
    *
    * recur().every(5).minute().between(15, 45).and().at('09:00:00')
    *        .except().on(0, 1).month();
    */
    var Recur = function () {
    
        var schedules = [{}]
          , exceptions = []
          , cur = schedules[0]
          , curArr = schedules
          , curName
          , values, every, after, applyMin, applyMax, i
          , last;

        /**
        * Adds values to the specified constraint in the current schedule.
        *
        * @param {String} name: Name of constraint to add
        * @param {Int} min: Minimum value for this constraint
        * @param {Int} max: Maximum value for this constraint
        */
        var add = function (name, min, max) {
            name = after ? 'a' + name : name;

            if (!cur[name]) {
                cur[name] = [];
            }

            curName = cur[name];

            if (every) {                    
                values = [];
                for (i = min; i <= max; i += every) {
                    values.push(i);
                }

                // save off values in case of startingOn or between
                last = {n: name, x: every, c: curName.length, m: max};
            }

            values = applyMin ? [min] : applyMax ? [max] : values;
            var length = values.length;
            for (i = 0; i < length; i += 1) {
                if (curName.indexOf(values[i]) < 0) {
                    curName.push(values[i]);
                }   
            }

            // reset the built up state
            values = every = after = applyMin = applyMax = 0;       
        };

        return {

            /**
            * Set of constraints that must be met for an occurrence to be valid.
            *
            * @api public
            */          
            schedules: schedules,

            /**
            * Set of exceptions that must not be met for an occurrence to be 
            * valid.
            *
            * @api public
            */
            exceptions: exceptions,

            /**
            * Specifies the specific instances of a time period that are valid. 
            * Must be followed by the desired time period (minute(), hour(), 
            * etc). For example, to specify a schedule for the 5th and 25th 
            * minute of every hour:
            *
            * recur().on(5, 25).minute();
            *
            * @param {Int} args: One or more valid instances
            * @api public
            */
            on: function () { 
                values = arguments[0] instanceof Array ? arguments[0] : arguments;
                return this; 
            },

            /**
            * Specifies the recurring interval of a time period that are valid. 
            * Must be followed by the desired time period (minute(), hour(), 
            * etc). For example, to specify a schedule for every 4 hours in the 
            * day:
            *
            * recur().every(4).hour();
            *
            * @param {Int} x: Recurring interval
            * @api public
            */
            every: function (x) {
                every = x;
                return this;
            },

            /**
            * Specifies the minimum interval between occurrences. 
            * Must be followed by the desired time period (minute(), hour(), 
            * etc). For example, to specify a schedule that occurs after four hours
            * from the start time:
            *
            * recur().after(4).hour();
            *
            * @param {Int} x: Recurring interval
            * @api public
            */
            after: function (x) {
                after = true;
                values = [x];
                return this;
            },

            /**
            * Specifies that the first instance of a time period is valid. Must
            * be followed by the desired time period (minute(), hour(), etc). 
            * For example, to specify a schedule for the first day of every 
            * month:
            *
            * recur().first().dayOfMonth();
            *
            * @api public
            */
            first: function () {
                applyMin = 1;
                return this;
            },

            /**
            * Specifies that the last instance of a time period is valid. Must
            * be followed by the desired time period (minute(), hour(), etc). 
            * For example, to specify a schedule for the last day of every year:
            *
            * recur().last().dayOfYear();
            *
            * @api public
            */
            last: function () {
                applyMax = 1;
                return this;
            },

            /**
            * Specifies a specific time that is valid. Time must be specified in
            * hh:mm:ss format using 24 hour time. For example, to specify 
            * a schedule for 8:30 pm every day:
            *
            * recur().at('20:30:00');
            *
            * @param {String} time: Time in hh:mm:ss 24-hour format
            * @api public
            */
            at: function () {
                values = arguments;
                var i, length = values.length;
                for (var i = 0; i < length; i++) {
                    var split = values[i].split(':');
                    if (split.length < 3) {
                        values[i] += ':00';
                    }
                }

                add('t');
                return this;
            },

            /**
            * Seconds time period, denotes seconds within each minute.
            * Minimum value is 0, maximum value is 59. Specify 59 for last.  
            *
            * recur().on(5, 15, 25).second();
            *
            * @api public
            */
            second: function () {
                add('s', 0, 59);
                return this;
            },

            /**
            * Minutes time period, denotes minutes within each hour.
            * Minimum value is 0, maximum value is 59. Specify 59 for last.  
            *
            * recur().on(5, 15, 25).minute();
            *
            * @api public
            */
            minute: function () {
                add('m', 0, 59);
                return this;
            },

            /**
            * Hours time period, denotes hours within each day.
            * Minimum value is 0, maximum value is 23. Specify 23 for last.  
            *
            * recur().on(5, 15, 25).hour();
            *
            * @api public
            */
            hour: function () {
                add('h', 0, 23);
                return this;
            },

            /**
            * Days of month time period, denotes number of days within a month.
            * Minimum value is 1, maximum value is 31.  Specify 0 for last.  
            *
            * recur().every(2).dayOfMonth();
            *
            * @api public
            */
            dayOfMonth: function () {
                add('D', 1, applyMax ? 0 : 31);
                return this;
            },

            /**
            * Days of week time period, denotes the days within a week.
            * Minimum value is 1, maximum value is 7.  Specify 0 for last.
            * 1 - Sunday
            * 2 - Monday
            * 3 - Tuesday
            * 4 - Wednesday
            * 5 - Thursday
            * 6 - Friday
            * 7 - Saturday  
            *
            * recur().on(1).dayOfWeek();
            *
            * @api public
            */
            dayOfWeek: function () {
                add('d', 1, 7);
                return this;
            },

            /**
            * Short hand for on(1,7).dayOfWeek()
            *
            * @api public
            */
            onWeekend: function() {
                values = [1,7];
                return this.dayOfWeek();
            },

            /**
            * Short hand for on(2,3,4,5,6).dayOfWeek()
            *
            * @api public
            */
            onWeekday: function() {
                values = [2,3,4,5,6];
                return this.dayOfWeek();
            },

            /**
            * Days of week count time period, denotes the number of times a 
            * particular day has occurred within a month.  Used to specify
            * things like second Tuesday, or third Friday in a month.
            * Minimum value is 1, maximum value is 5.  Specify 0 for last.
            * 1 - First occurrence
            * 2 - Second occurrence
            * 3 - Third occurrence
            * 4 - Fourth occurrence
            * 5 - Fifth occurrence
            * 0 - Last occurrence  
            *
            * recur().on(1).dayOfWeek().on(1).dayOfWeekCount();
            *
            * @api public
            */
            dayOfWeekCount: function () {
                add('dc', 1, applyMax ? 0 : 5);
                return this;
            },

            /**
            * Days of year time period, denotes number of days within a year.
            * Minimum value is 1, maximum value is 366.  Specify 0 for last.  
            *
            * recur().every(2).dayOfYear();
            *
            * @api public
            */
            dayOfYear: function () {
                add('dy', 1, applyMax ? 0 : 366);
                return this;
            },

            /**
            * Weeks of month time period, denotes number of weeks within a 
            * month. The first week is the week that includes the 1st of the
            * month. Subsequent weeks start on Sunday.    
            * Minimum value is 1, maximum value is 5.  Specify 0 for last.  
            * February 2nd,  2012 - Week 1
            * February 5th,  2012 - Week 2
            * February 12th, 2012 - Week 3
            * February 19th, 2012 - Week 4
            * February 26th, 2012 - Week 5 (or 0)
            *
            * recur().on(2).weekOfMonth();
            *
            * @api public
            */
            weekOfMonth: function () {
                add('wm', 1, applyMax ? 0 : 5);
                return this;
            },

            /**
            * Weeks of year time period, denotes the ISO 8601 week date. For 
            * more information see: http://en.wikipedia.org/wiki/ISO_week_date.
            * Minimum value is 1, maximum value is 53.  Specify 0 for last.
            *
            * recur().every(2).weekOfYear();
            *
            * @api public
            */
            weekOfYear: function () {
                add('wy', 1, applyMax ? 0 : 53);
                return this;
            },

            /**
            * Month time period, denotes the months within a year.
            * Minimum value is 1, maximum value is 12.  Specify 0 for last.
            * 1 - January
            * 2 - February
            * 3 - March
            * 4 - April
            * 5 - May
            * 6 - June
            * 7 - July
            * 8 - August
            * 9 - September
            * 10 - October
            * 11 - November
            * 12 - December  
            *
            * recur().on(1).dayOfWeek();
            *
            * @api public
            */
            month: function () {
                add('M', 1, 12);
                return this;
            },

            /**
            * Year time period, denotes the four digit year.
            * Minimum value is 1970, maximum value is 2450 (arbitrary)  
            *
            * recur().on(2011, 2012, 2013).year();
            *
            * @api public
            */
            year: function () {
                add('Y', 1970, 2450);
                return this;
            },

            /**
            * Modifies a recurring interval (specified using every) to start
            * at a given offset.  To create a schedule for every 5 minutes
            * starting on the 6th minute - making minutes 6, 11, 16, etc valid:
            *
            * recur().every(5).minute().startingOn(6);
            *
            * @param {Int} start: The desired starting offset
            * @api public
            */
            startingOn: function (start) {
                return this.between(start, last.m);
            },

            /**
            * Modifies a recurring interval (specified using every) to start
            * and stop at specified times.  To create a schedule for every 
            * 5 minutes starting on the 6th minute and ending on the 11th 
            * minute - making minutes 6 and 11 valid:
            *
            * recur().every(5).minute().between(6, 11);
            *
            * @param {Int} start: The desired starting offset
            * @param {Int} end: The last valid value
            * @api public
            */
            between: function (start, end) {
                // remove the values added as part of specifying the last
                // time period and replace them with the new restricted values
                cur[last.n] = cur[last.n].splice(0, last.c);
                every = last.x;
                add(last.n, start, end);
                return this;
            },

            /**
            * Creates a composite schedule.  With a composite schedule, a valid
            * occurrence of any of the component schedules is considered a valid
            * value for the composite schedule (e.g. they are OR'ed together).
            * To create a schedule for every 5 minutes on Mondays and every 10
            * minutes on Tuesdays:
            *
            * recur().every(5).minutes().on(1).dayOfWeek().and().every(10)
            *        .minutes().on(2).dayOfWeek();
            *
            * @api public
            */
            and: function () {
                cur = curArr[curArr.push({}) - 1];
                return this;
            },

            /**
            * Creates exceptions to a schedule. Any valid occurrence of the 
            * exception schedule (which may also be composite schedules) is
            * considered a invalid schedule occurrence. Everything that follows
            * except will be treated as an exception schedule.  To create a 
            * schedule for 8:00 am every Tuesday except for patch Tuesday 
            * (second Tuesday each month):
            *
            * recur().at('08:00:00').on(2).dayOfWeek().except()
            *        .dayOfWeekCount(1);
            *
            * @api public
            */
            except: function () {
                exceptions.push({});
                curArr = exceptions;
                cur = exceptions[0];
                return this;
            }
        };
    };

    /**
    * Allow library to be used within both the browser and node.js
    */
    var root = typeof exports !== "undefined" && exports !== null ? exports : window;
    root.recur = Recur;

}).call(this);


