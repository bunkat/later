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
* Later.js 0.0.17
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

        var isLocal = useLocalTime || false,
            get = 'get' + (isLocal ? '' : 'UTC'),
            exec = true,

            // constants
            SEC = 1000,
            MIN = SEC * 60,
            HOUR = MIN * 60,
            DAY = HOUR * 24,

            // aliases for common math functions
            ceil = Math.ceil,
            floor = Math.floor,
            max = Math.max,

            // data prototypes to switch between UTC and local time calculations
            dateProto = Date.prototype,
            getYear = dateProto[get + 'FullYear'],
            getMonth = dateProto[get + 'Month'],
            getDate = dateProto[get + 'Date'],
            getDay = dateProto[get + 'Day'],
            getHour = dateProto[get + 'Hours'],
            getMin = dateProto[get + 'Minutes'],
            getSec = dateProto[get + 'Seconds'];

        // minimum time between valid occurrences in seconds
        resolution = resolution === undefined ? 1 : resolution;

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
            var cur, next = null, min = values[0], i = values.length;
            while (i--) {
                cur = values[i];
                if (cur === val) {
                    return val;
                }

                min = cur < min ? cur : min;
                next = cur > val && (!next || cur < next) ? cur : next;
            }

            return next || (minOffset === undefined ? min : (min + minOffset));
        };

        /**
        * Finds the previous valid value which is either the next smallest valid
        * value or the maximum valid value if no smaller value exists. To
        * simplify some calculations, the min value is then substracted to a specified
        * offset.
        *
        * For example, if the current minute is 5 and the next valid
        * value is 7, the offset will be set to 60 (max number of minutes) and
        * prevInRange will return -67. This is the number of minutes that must
        * be added to the current hour to get to the next valid minute.
        *
        * @param {Int/String} val: The current value
        * @param {[]} values: Array of possible valid values
        * @param {Int/String} maxOffset: Value to subtract from the maximum value
        */
        var prevInRange = function(val, values, maxOffset) {
            var cur, prev = null, i = values.length, max = values[i-1];
            while (i--) {
                cur = values[i];
                if (cur === val) {
                    return val;
                }

                max = cur > max ? cur : max;
                prev = cur < val && (!prev || cur > prev) ? cur : prev;
            }

            return prev !== null ? prev : (maxOffset === undefined ? max : (max - maxOffset));
        };

        /**
        * Builds and returns a new Date using the specified values.  Date
        * returned is either using Local time or UTC based on isLocal.
        *
        * @param {Int} yr: Four digit year
        * @param {Int} mt: Month between 0 and 11, defaults to 0
        * @param {Int} dt: Date between 1 and 31, defaults to 1
        * @param {Int} hr: Hour between 0 and 23, defaults to 0
        * @param {Int} mn: Minute between 0 and 59, defaults to 0
        * @param {Int} sc: Second between 0 and 59, defaults to 0
        */
        var nextDate = function(yr, mt, dt, hr, mn, sc) {
            mt = mt === undefined ? 0 : mt;
            dt = dt === undefined ? 1 : dt;
            hr = hr === undefined ? 0 : hr;
            mn = mn === undefined ? 0 : mn;
            sc = sc === undefined ? 0 : sc;

            return isLocal ? new Date(yr, mt, dt, hr, mn, sc) :
                new Date(Date.UTC(yr, mt, dt, hr, mn, sc));
        };

        /**
        * Builds and returns a new Date using the specified values.  Date
        * returned is either using Local time or UTC based on isLocal.
        *
        * @param {Int} yr: Four digit year
        * @param {Int} mt: Month between 0 and 11, defaults to 11
        * @param {Int} dt: Date between 1 and 31, defaults to last day of month
        * @param {Int} hr: Hour between 0 and 23, defaults to 23
        * @param {Int} mn: Minute between 0 and 59, defaults to 59
        * @param {Int} sc: Second between 0 and 59, defaults to 59
        */
        var prevDate = function(yr, mt, dt, hr, mn, sc) {
            mt = mt === undefined ? 11 : mt;
            dt = dt === undefined ? getDate.call(nextDate(yr, mt+1, 0)) : dt;
            hr = hr === undefined ? 23 : hr;
            mn = mn === undefined ? 59 : mn;
            sc = sc === undefined ? 59 : sc;

            return isLocal ? new Date(yr, mt, dt, hr, mn, sc) :
                new Date(Date.UTC(yr, mt, dt, hr, mn, sc));
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
        * Given a valid start time, finds the next schedule that is invalid.
        * Useful for finding the end of a valid time range.
        *
        * @param {object} schedule: Valid schedule object containing constraints
        * @param {Date} start: The first possible valid occurrence
        * @param {Date} end: The last possible valid occurrence
        * @param {boolean} reverse: True if we are looking for previous occurrences
        */
        var getNextInvalidSchedule = function(sched, start, reverse) {
            var Y, M, D, d, h, m, s,
                oJan1, oMonthStart, oWeekStart, oWeekStartY, oMonthEnd,
                oDec31,
                t, dy, wy, wm, dc,
                daysInYear, daysInMonth, firstDayOfMonth,
                weekStart, weeksInYear, weeksInMonth, x;

            // helper functions based on which direction we are going in
            var range = reverse ? prevInRange : nextInRange,
                date = reverse ? prevDate : nextDate;

            // calculate the earliest date that violates the schedule.
            // Note: This search isn't exact, date returned may still be valid,
            // but is pretty fast since most of the time the next invalid time
            // will be one increment away from current time

            Y = getYear.call(start);
            M = getMonth.call(start);
            D = getDate.call(start);
            h = getHour.call(start);
            m = getMin.call(start);
            s = getSec.call(start);
            t = pad(h) +':'+ pad(m) +':'+ pad(s);

            // check time of day (24-hr)
            if (sched.t && range(t, sched.t) === t) {
                return reverse ? (date(Y, M, D, h, m, s-1)) : (date(Y, M, D, h, m, s+1));
            }

            // check second of minute (zero based)
            if (sched.s && range(s, sched.s, 60) === s) {
                return reverse ? (date(Y, M, D, h, m, s-1)) : (date(Y, M, D, h, m, s+1));
            }

            // check minute of hour (zero based)
            if (sched.m && range(m, sched.m, 60) === m) {
                return reverse ? (date(Y, M, D, h, m-1)) : (date(Y, M, D, h, m+1));
            }

            // check hour of day (zero based)
            if (sched.h && range(h, sched.h, 24) === h) {
                return reverse ? (date(Y, M, D, h-1)) : (date(Y, M, D, h+1));
            }

            // check before time (24-hr)
            if (sched.tb) {
                if (t < sched.tb[0]) {
                    x = sched.tb[0].split(':');
                    if (reverse) {
                        return(date(Y, M, D-1, x[0], x[1], x[2]-1));
                    }
                    else {
                        return(date(Y, M, D, x[0], x[1], x[2]));
                    }
                }
            }

            // check after time (24-hr)
            if (sched.ta) {
                if (t >= sched.ta[0]) {
                    if (reverse) {
                        x = sched.ta[0].split(':');
                        return(date(Y, M, D, x[0], x[1], x[2]-1));
                    }
                    else {
                        return(date(Y, M, D+1));
                    }
                }
            }

            // check day of week count (one based, 0 for last instance)
            if (sched.dc) {
                dc = floor((D - 1) / 7) + 1;
                if (range(dc, sched.dc, 0) === dc) {
                    return reverse ? (date(Y, M, D-1)) : (date(Y, M, D+1));
                }
            }

            // check day of week (zero based)
            d = getDay.call(start);
            if (sched.d && range(d+1, sched.d, 7) === d+1) {
                return reverse ? (date(Y, M, D-1)) : (date(Y, M, D+1));
            }

            // check week of month (one based, 0 for last week of month)
            if (sched.wm) {
                firstDayOfMonth = getDay.call(nextDate(Y, M, 1));
                wm = floor((((D + firstDayOfMonth - 1)/7))+1);
                weeksInMonth = floor((((daysInMonth + firstDayOfMonth - 1)/7))+1);
                if ((range(wm, sched.wm, weeksInMonth) || weeksInMonth) === wm) {
                    // not optimal at all...
                    return reverse ? (date(Y, M, D-1)) : (date(Y, M, D+1));
                }
            }

            // check date of month (one based)
            oMonthEnd = nextDate(Y, M + 1, 0);
            daysInMonth = getDate.call(oMonthEnd);
            if (sched.D && (range(D, sched.D, daysInMonth) || daysInMonth) === D) {
                return reverse ? (date(Y, M, D-1)) : (date(Y, M, D+1));
            }

            // check week of year (one based, ISO week)
            oJan1 = nextDate(Y, 0, 1, 12);
            oDec31 = nextDate(Y + 1, 0, 0, 12);
            if (sched.wy) {
                oWeekStart = date(Y, M, D + 4 - (d || 7));
                oWeekStartY = date(getYear.call(oWeekStart),0,1);
                weeksInYear = getDay.call(oJan1) === 4 ||
                    getDay.call(oDec31) === 4 ? 53 : 52;

                wy = ceil((((oWeekStart.getTime()-oWeekStartY.getTime())/DAY)+1)/7);
                if ((range(wy, sched.wy, weeksInYear) || weeksInYear) === wy) {
                    return reverse ? (date(Y, M, D-1)) : (date(Y, M, D+1));
                }
            }

            // check month (one based)
            if (sched.M && range(M+1, sched.M, 12) === M+1) {
                return reverse ? (date(Y, M-1)) : (date(Y, M+1));
            }

            // check day of year (one based)
            if (sched.dy) {
                dy = ceil((start.getTime() - oJan1.getTime())/DAY) + 1;
                daysInYear = ceil((oDec31.getTime() - oJan1.getTime())/DAY) + 1;

                if ((range(dy, sched.dy, daysInYear) || daysInYear) === dy) {
                    return reverse ? (date(Y, M-1)) : (date(Y, M+1));
                }
            }

            // check year
            if (sched.Y && range(Y, sched.Y, 0) === Y ) {
                return reverse ? (date(Y-1)) : (date(Y+1));
            }

            return start;
        };

        /**
        * Calculates the next valid occurrence of a particular schedule that
        * occurs on or after the specified start time.
        *
        * @param {object} schedule: Valid schedule object containing constraints
        * @param {Date} start: The first possible valid occurrence
        * @param {Date} end: The last possible valid occurrence
        * @param {boolean} reverse: True if we are looking for previous occurrences
        */
        var getNextForSchedule = function(sched, start, end, reverse) {
            var next, inc, x, cur,
                Y, M, D, d, h, m, s,
                oJan1, oMonthStart, oWeekStart, oWeekStartY, oMonthEnd,
                oDec31,
                t, dy, wy, wm, dc,
                daysInYear, daysInMonth, firstDayOfMonth,
                weekStart, weeksInYear, weeksInMonth,
                maxLoopCount = 1000;

            var range = reverse ? prevInRange : nextInRange,
                date = reverse ? prevDate : nextDate;

            // handle any after constraints
            // after constraints are not applied when searching backwards
            next = reverse ? start : after(start, sched);

            // It's not pretty, but just keep looping through all of the
            // constraints until they have all been met (or no valid
            // occurrence exists). All calculations are done just in time and
            // and only once to prevent extra work from being done each loop.
            while (next && maxLoopCount--) {

                // make sure we are still with in the boundaries
                if (end &&
                     ((!reverse && next.getTime() > end.getTime()) ||
                     (reverse && next.getTime() < end.getTime()))) {
                    return null;
                }

                // check year
                Y = getYear.call(next);
                M = getMonth.call(next);
                D = getDate.call(next);
                if (sched.Y && (inc = range(Y, sched.Y, 0)) !== Y ) {
                    next = (!reverse && inc > Y) || (reverse && inc < Y) ? date(inc) : null;
                    continue;
                }

                // check day of year (one based)
                oJan1 = nextDate(Y, 0, 1, 12, 0, 0);
                var cDate = nextDate(Y, M, D, 12, 0, 0);
                oDec31 = nextDate(Y + 1, 0, 0);
                if (sched.dy) {

                    dy = ceil((cDate.getTime() - oJan1.getTime())/DAY) + 1;
                    daysInYear = ceil((oDec31.getTime() - oJan1.getTime())/DAY) + 1;

                    if (((inc = range(dy, sched.dy, daysInYear)) || daysInYear) !== dy) {
                        next = date(Y, 0, inc);
                        continue;
                    }
                }

                // check month (one based)
                if (sched.M && (inc = range(M+1, sched.M, 12)) !== M+1) {
                    next = date(Y, inc-1);
                    continue;
                }

                // check week of year (one based, ISO week)
                d = getDay.call(next);
                if (sched.wy) {
                    oWeekStart = date(Y, M, D + 4 - (d || 7), 12);
                    oWeekStartY = date(getYear.call(oWeekStart),0,1, 12);
                    weeksInYear = getDay.call(oJan1) === 4 ||
                        getDay.call(oDec31) === 4 ? 53 : 52;

                    wy = ceil((((oWeekStart.getTime()-oWeekStartY.getTime())/DAY)+1)/7);
                    if (((inc = range(wy, sched.wy, weeksInYear)) || weeksInYear) !== wy) {
                        if(inc < 0) inc += 1; // don't double count a week when reverse

                        next = date(
                                getYear.call(oWeekStart),
                                getMonth.call(oWeekStart),
                                getDate.call(oWeekStart) - 3 + (inc - wy) * 7 +
                                (reverse ?  6 : 0)); // head to end of week if reverse
                        continue;
                    }
                }

                // check date of month (one based)
                oMonthEnd = nextDate(Y, M + 1, 0, 12);
                daysInMonth = getDate.call(oMonthEnd);
                if (sched.D && ((inc = range(D, sched.D, daysInMonth)) || daysInMonth) !== D) {
                    // if we are going backwards, just jump to the last day in
                    // the previous month to avoid errors in calculating diff to
                    // desired date
                    next = date(Y, M, inc < 0 ? 0 : inc);
                    continue;
                }

                // check week of month (one based, 0 for last week of month)
                if (sched.wm) {
                    firstDayOfMonth = getDay.call(nextDate(Y, M, 1));
                    wm = floor((((D + firstDayOfMonth - 1)/7))+1);
                    weeksInMonth = floor((((daysInMonth + firstDayOfMonth - 1)/7))+1);
                    if (((inc = range(wm, sched.wm, weeksInMonth)) || weeksInMonth) !== wm) {
                        // jump to the Sunday of the desired week, making sure not
                        // to double count the last week in the month if we cross
                        // a month boundary, set to 1st of month for week 1
                        if(inc === 0) { //only happens in reverse, go to end of prev month
                            next = date(Y, M, inc);
                        }
                        else {
                            next = date(Y, M,
                                (inc < 0 ? inc+1 : inc-1) * 7 - (firstDayOfMonth - 1) -
                                (inc > weeksInMonth && getDay.call(oMonthEnd) < 6 ? 7 : 0) +
                                (inc === weeksInMonth + 1 ? getDay.call(oMonthEnd) + 1 : 0) +
                                (reverse ? 6 : 0)); // skip to end of week in reverse
                        }
                        continue;
                    }
                }

                // check day of week (zero based)
                if (sched.d && (inc = range(d+1, sched.d, 7)) !== d+1) {
                    next = date(Y, M, D + (inc-1) - d);
                    continue;
                }

                // check day of week count (one based, 0 for last instance)
                if (sched.dc) {
                    dc = floor((D - 1) / 7) + 1;
                    if ((inc = range(dc, sched.dc, 0)) !== dc) {
                        if (reverse) {
                            if (inc > 0) {
                                next = date(Y, M + (inc < dc ? 0 : -1), 7 + (7 * (inc-1)));
                                continue;
                            }
                            else if (inc === 0 && D < (daysInMonth - 6)) {
                                next = date(Y, M, inc);
                                continue;
                            }
                        }
                        else {
                            if (inc > 0) {
                                next = date(Y, M + (inc < dc ? 1 : 0), 1 + (7 * (inc-1)));
                                continue;
                            }
                            else if (inc < 1 && D < (daysInMonth - 6)) {
                                next = date(Y, M, daysInMonth - 6);
                                continue;
                            }
                        }
                    }
                }

                // check after time (24-hr)
                h = getHour.call(next);
                m = getMin.call(next);
                s = getSec.call(next);
                t = pad(h) +':'+ pad(m) +':'+ pad(s);
                if (sched.ta) {
                    if (t < sched.ta[0]) {
                        if (reverse) {
                            next = date(Y, M, D-1);
                        }
                        else {
                            x = sched.ta[0].split(':');
                            next = date(Y, M, D, x[0], x[1], x[2]);
                        }
                        continue;
                    }
                }

                // check before time (24-hr)
                if (sched.tb) {
                    if (t >= sched.tb[0]) {
                        if (reverse) {
                            x = sched.tb[0].split(':');
                            next = date(Y, M, D, x[0], x[1], x[2]-1);
                        }
                        else {
                            next = date(Y, M, D+1);
                        }
                        continue;
                    }
                }

                // check hour of day (zero based)
                if (sched.h && (inc = range(h, sched.h, 24)) !== h) {
                    next = date(Y, M, D, inc);
                    continue;
                }

                // check minute of hour (zero based)
                if (sched.m && (inc = range(m, sched.m, 60)) !== m) {
                    next = date(Y, M, D, h, inc);
                    continue;
                }

                // check second of minute (zero based)
                if (sched.s && (inc = range(s, sched.s, 60)) !== s) {
                    next = date(Y, M, D, h, m, inc);
                    continue;
                }

                // check time of day (24-hr)
                if (sched.t) {
                    if ((inc = range(t, sched.t)) !== t) {
                        x = inc.split(':');
                        var dayInc = !reverse ? (t > inc ? 1 : 0) : (t < inc ? -1 : 0);
                        next = date(Y, M, D + dayInc, x[0], x[1], x[2]);
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
            var yr = getYear.call(start) + getAfter(sched.aY),
                mt = getMonth.call(start) + getAfter(sched.aM),
                dt = getDate.call(start) +
                        max(getAfter(sched.aD), getAfter(sched.ady), getAfter(sched.ad),
                        getAfter(sched.awy) * 7, getAfter(sched.awm) * 7),
                hr = getHour.call(start) + getAfter(sched.ah),
                mn = getMin.call(start) + getAfter(sched.am),
                sc = getSec.call(start) + getAfter(sched.as);

            return nextDate(yr, mt, dt, hr, mn, sc);
        };

        /**
        * Returns the value of an after constraint or 0 if not set.
        *
        * @param {Array} constraint: After constrant to check
        */
        var getAfter = function (constraint) {
            return constraint && constraint[0] ? constraint[0] : 0;
        };

        /**
        * Returns a new date object that represents the next possible valid
        * occurrence based on the resolution that has beeen configured.
        *
        * @param {Date} date: The Date object to be incremented
        * @param {Boolean} backwards: True to tick backwards instead of forwards
        */
        var tick = function (date, backwards) {
            return !backwards ?
                new Date(date.getTime() + (resolution * 1000)) :
                new Date(date.getTime() - (resolution * 1000)) ;
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
                var next = this.getNext(recur, date);
                return next ? date.getTime() === next.getTime() : false;
            },

            /**
            * Returns the next one or more valid occurrences of a schedule.
            *
            * @param {Recur} recur: Set of schedule and exception constraints
            * @param {Int} count: The number of occurrences to return
            * @param {Date} startDate: The initial date to start looking from
            * @param {Date} endDate: The last date to include
            * @param {boolean} reverse: True to search for occurrences in reverse
            * @api public
            */
            get: function (recur, count, startDate, endDate, reverse) {
                var occurrences = [], date;

                while (count-- > 0 && (date =
                        !reverse ?
                            this.getNext(recur, date || startDate, endDate) :
                            this.getPrevious(recur, date || startDate, endDate)
                        )) {
                    occurrences.push(date);
                    date = tick(date, reverse);
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
                var schedules = recur ? recur.schedules || [] : [],
                    exceptions = recur ? recur.exceptions || [] : [],
                    schedLen = schedules.length,
                    exceptLen = exceptions.length,
                    start = startDate || new Date(),
                    date;

                while(start) {
                    var tDate;

                    if(endDate && start.getTime() > endDate.getTime()) {
                        date = undefined;
                        break;
                    }

                    if(schedLen) {
                        for(var i = 0; i < schedLen; i++) {
                            tDate = getNextForSchedule(schedules[i], start, endDate);
                            if (tDate && (!date || (tDate.getTime() < date.getTime()))) {
                                date = tDate;
                            }
                        }
                    }
                    else {
                        date = start;
                    }
                    start = null;

                    if (date && exceptLen) {
                        tDate = this.getNextInvalid({schedules: exceptions}, date);
                        if(tDate.getTime() !== date.getTime()) {
                            start = tDate;
                            date = undefined;
                        }
                    }

                }

                return date;
            },

            /**
            * Returns the next invalid occurrence of a schedule. Useful for
            * quickly calculating the end of a valid time period.
            *
            * @param {Recur} recur: Set of schedule and exception constraints
            * @param {Date} startDate: The initial date to start looking frome
            * @api public
            */
            getNextInvalid: function (recur, startDate) {
                var schedules = recur ? recur.schedules || [] : [],
                    exceptions = recur ? recur.exceptions || [] : [],
                    schedLen = schedules.length,
                    exceptLen = exceptions.length,
                    start = startDate || new Date();

                while(start && this.isValid(recur, start)) {
                    var nextExcep, nextInvalid;

                    // get the next invalid schedule if there is one
                    for(var i = 0; i < schedLen; i++) {
                        var tDate = getNextInvalidSchedule(schedules[i], start);
                        if (tDate && (!nextInvalid || (tDate.getTime() > nextInvalid.getTime()))) {
                            nextInvalid = tDate;
                        }
                    }

                    // get the next occurrence of any of the exceptions
                    if(exceptLen) {
                        nextExcep = this.getNext({schedules: exceptions}, start);
                    }

                    // if we didn't find any next occurrences, there is no next
                    // invalid (this schedule is always valid until the end
                    // of time)
                    if(!nextInvalid && !nextExcep) {
                        start = undefined;
                    }
                    else {
                        start = new Date(nextInvalid && nextExcep ?
                            Math.min(nextInvalid.getTime(), nextExcep.getTime()) :
                            nextExcep || nextInvalid);
                    }
                }

                // if the date is the start date, no next invalid was found
                return start;
            },

            /**
            * Returns the previous valid occurrence of a schedule based on the
            * provided endDate.
            *
            * @param {Recur} recur: Set of schedule and exception constraints
            * @param {Date} endDate: The date to start the search from
            * @param {Date} startDate: The last date to include in the search
            * @api public
            */
            getPrevious: function (recur, startDate, endDate) {
                var schedules = recur ? recur.schedules || [] : [],
                    exceptions = {schedules: recur ? recur.exceptions || [] : []},
                    end = startDate || new Date(),
                    date, tDate,
                    i = schedules.length;

                // return null if we're earlier than the specified endDate date
                if (endDate && startDate.getTime() < endDate.getTime()) {
                    return null;
                }

                if (i === 0) {
                    date = end; // no constraints, end date is fine
                }
                else {
                    while(i--) {
                        tDate = getNextForSchedule(schedules[i], end, endDate, true);
                        if (!date || (tDate > date)) {
                            date = tDate;
                        }
                    }
                }

                if (date && exceptions.schedules.length > 0 &&
                        this.isValid (exceptions, date)) {
                    date = this.getPrevious(recur, tick(date, true), endDate);
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

        var schedules = [],
            exceptions = [],
            cur,
            curArr = schedules,
            curName,
            values, every, after, applyMin, applyMax, i, last;

        /**
        * Adds values to the specified constraint in the current schedule.
        *
        * @param {String} name: Name of constraint to add
        * @param {Int} min: Minimum value for this constraint
        * @param {Int} max: Maximum value for this constraint
        */
        var add = function (name, min, max) {
            name = after ? 'a' + name : name;

            if (!cur) {
                curArr.push({});
                cur = curArr[0];
            }

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
                for (var i = 0, len = values.length; i < len; i++) {
                    var split = values[i].split(':');
                    if (split.length < 3) {
                        values[i] += ':00';
                    }
                }

                add('t');
                return this;
            },

            /**
            * Specifies a specific time that valid occurrences must occur
            * after. Time must be specified in hh:mm:ss format using 24 hour
            * time. For example, to specify a schedule after 8:30 pm every day:
            *
            * recur().afterTime('20:30:00');
            *
            * @param {String} time: Time in hh:mm:ss 24-hour format
            * @api public
            */
            afterTime: function () {
                values = arguments;
                for (var i = 0, len = values.length; i < len; i++) {
                    var split = values[i].split(':');
                    if (split.length < 3) {
                        values[i] += ':00';
                    }
                }

                add('ta');
                return this;
            },

            /**
            * Specifies a specific time that valid occurrences must occur
            * before. Time must be specified in hh:mm:ss format using 24 hour
            * time. For example, to specify a schedule before 8:30 pm every day:
            *
            * recur().beforeTime('20:30:00');
            *
            * @param {String} time: Time in hh:mm:ss 24-hour format
            * @api public
            */
            beforeTime: function () {
                values = arguments;
                for (var i = 0, len = values.length; i < len; i++) {
                    var split = values[i].split(':');
                    if (split.length < 3) {
                        values[i] += ':00';
                    }
                }

                add('tb');
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
                //exceptions.push({});
                curArr = exceptions;
                cur = null;
                //cur = exceptions[0];
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


/**
* Later.js 0.0.1
* (c) 2012 Bill, BunKat LLC.
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://bunkat.github.com/later
*/

var root =  typeof exports !== "undefined" && exports !== null ? exports : window;

var recur = root.recur;
if (!recur && (typeof require !== 'undefined')) {
    recur = require('./recur').recur;
}

(function () {

    "use strict";
    /**
    * Parses an English string expression and produces a schedule that is 
    * compatible with Later.js.  
    *
    * Examples:
    *
    * every 5 minutes between the 1st and 30th minute
    * at 10:00 am on tues of may in 2012
    * on the 15-20th day of march-dec
    * every 20 seconds every 5 minutes every 4 hours between the 10th and 20th hour
    */
    var EnParser = function () {
    
        var pos = 0
          , input = ''
          , error;

        // Regex expressions for all of the valid tokens
        var TOKENTYPES = {
          eof: /^$/,
          rank: /^((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|(0|[1-5]?[4-9]|[1-5]0|1[1-3])(th)?))\b/,
          time: /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,
          dayName: /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,
          monthName: /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
          yearIndex: /^(\d\d\d\d)\b/,
          every: /^every\b/,
          after: /^after\b/,
          second: /^(s|sec(ond)?(s)?)\b/,
          minute: /^(m|min(ute)?(s)?)\b/,
          hour: /^(h|hour(s)?)\b/,
          day: /^(day(s)?( of the month)?)\b/,
          dayInstance: /^day instance\b/,
          dayOfWeek: /^day(s)? of the week\b/,
          dayOfYear: /^day(s)? of the year\b/,
          weekOfYear: /^week(s)?( of the year)?\b/,
          weekOfMonth: /^week(s)? of the month\b/,
          weekday: /^weekday\b/,
          weekend: /^weekend\b/,
          month: /^month(s)?\b/,
          year: /^year(s)?\b/,
          between: /^between (the)?\b/,
          start: /^(start(ing)? (at|on( the)?)?)\b/,
          at: /^(at|@)\b/,
          and: /^(,|and\b)/,
          except: /^(except\b)/,
          also: /(also)\b/,
          first: /^(first)\b/,
          last: /^last\b/,
          "in": /^in\b/,
          of: /^of\b/,
          onthe: /^on the\b/,
          on: /^on\b/,
          through: /(-|^(to|through)\b)/
        };

        // Array to convert string names to valid numerical values
        var NAMES = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, 
            aug: 8, sep: 9, oct: 10, nov: 11, dec: 12, sun: 1, mon: 2, tue: 3, 
            wed: 4, thu: 5, fri: 6, sat: 7, '1st': 1, fir: 1, '2nd': 2, sec: 2, 
            '3rd': 3, thi: 3, '4th': 4, 'for': 4
        };

        /**
        * Bundles up the results of the peek operation into a token.
        *
        * @param {Int} start: The start position of the token
        * @param {Int} end: The end position of the token
        * @param {String} text: The actual text that was parsed
        * @param {TokenType} type: The TokenType of the token       
        */
        var t = function (start, end, text, type) {
            return {startPos: start, endPos: end, text: text, type: type};
        }

        /**
        * Peeks forward to see if the next token is the expected token and
        * returns the token if found.  Pos is not moved during a Peek operation.
        *
        * @param {TokenType} exepected: The types of token to scan for
        */
        var peek = function (expected) {
            var scanTokens = expected instanceof Array ? expected : [expected]
              , whiteSpace = /\s+/
              , token, curInput, m, scanToken, start, len
            
            scanTokens.push(whiteSpace);

            // loop past any skipped tokens and only look for expected tokens
            start = pos;
            while (!token || token.type === whiteSpace) {
                len = -1;
                curInput = input.substring(start);
                token = t(start, start, input.split(whiteSpace)[0]);
                
                var i, length = scanTokens.length;
                for(i = 0; i < length; i++) {
                    scanToken = scanTokens[i];
                    m = scanToken.exec(curInput);
                    if (m && m.index === 0 && m[0].length > len) {
                        len = m[0].length;
                        token = t(start, start + len, curInput.substring(0, len), scanToken);
                    }
                } 

                // update the start position if this token should be skipped
                if (token.type === whiteSpace) {
                    start = token.endPos;
                }
            }

            return token;
        }

        /**
        * Moves pos to the end of the expectedToken if it is found.
        *
        * @param {TokenType} exepectedToken: The types of token to scan for
        */
        var scan = function (expectedToken) {
            var token = peek(expectedToken);
            pos = token.endPos;
            return token;            
        }

        /**
        * Parses the next 'y-z' expression and returns the resulting valid
        * value array.
        *
        * @param {TokenType} tokenType: The type of range values allowed
        */
        var parseThroughExpr = function(tokenType) {

            var start = +parseTokenValue(tokenType)
              , end = checkAndParse(TOKENTYPES.through) ? 
                       +parseTokenValue(tokenType) : start
              , nums = [];

            for (var i = start; i <= end; i++) {
                nums.push(i);
            }
            
            return nums;
        }

        /**
        * Parses the next 'x,y-z' expression and returns the resulting valid
        * value array.
        *
        * @param {TokenType} tokenType: The type of range values allowed
        */
        var parseRanges = function(tokenType) {
            var nums = parseThroughExpr(tokenType);
            while (checkAndParse(TOKENTYPES.and)) {
                nums = nums.concat(parseThroughExpr(tokenType));
            }
            return nums;         
        }

        /**
        * Parses the next 'every (weekend|weekday|x) (starting on|between)' expression.
        *
        * @param {Recur} r: The recurrence to add the expression to
        */
        var parseEvery = function(r) {
            var num, period, start, end;

            if (checkAndParse(TOKENTYPES.weekend)) {
                r.on(NAMES.sun,NAMES.sat).dayOfWeek();
            }
            else if (checkAndParse(TOKENTYPES.weekday)) {
                r.on(NAMES.mon,NAMES.tue,NAMES.wed,NAMES.thu,NAMES.fri).dayOfWeek();
            }
            else {
                num = parseTokenValue(TOKENTYPES.rank);
                r.every(num);
                period = parseTimePeriod(r);

                if (checkAndParse(TOKENTYPES.start)) {
                    num = parseTokenValue(TOKENTYPES.rank);
                    r.startingOn(num);
                    parseToken(period.type);
                } 
                else if (checkAndParse(TOKENTYPES.between)) {
                    start = parseTokenValue(TOKENTYPES.rank);
                    if (checkAndParse(TOKENTYPES.and)) {
                        end = parseTokenValue(TOKENTYPES.rank);
                        r.between(start,end);
                    }
                }
            }            
        }

        /**
        * Parses the next 'on the (first|last|x,y-z)' expression.
        *
        * @param {Recur} r: The recurrence to add the expression to
        */
        var parseOnThe = function(r) {
            
            if (checkAndParse(TOKENTYPES.first)) {
                r.first();
            }
            else if (checkAndParse(TOKENTYPES.last)) {
                r.last();
            }
            else {
                r.on(parseRanges(TOKENTYPES.rank));
            }

            parseTimePeriod(r);
        }

        /**
        * Parses the schedule expression and returns the resulting schedules,
        * and exceptions.  Error will return the position in the string where
        * an error occurred, will be null if no errors were found in the
        * expression.
        *
        * @param {String} str: The schedule expression to parse
        */
        var parseScheduleExpr = function (str) {
            pos = 0;
            input = str;
            error = -1;

            var r = recur();
            while (pos < input.length && error < 0) {

                var token = parseToken([TOKENTYPES.every, TOKENTYPES.after, 
                    TOKENTYPES.onthe, TOKENTYPES.on, TOKENTYPES.of, TOKENTYPES["in"],
                    TOKENTYPES.at, TOKENTYPES.and, TOKENTYPES.except,
                    TOKENTYPES.also]);

                switch (token.type) {
                    case TOKENTYPES.every:
                        parseEvery(r);
                        break;
                    case TOKENTYPES.after:
                        r.after(parseTokenValue(TOKENTYPES.rank));
                        parseTimePeriod(r);
                        break;
                    case TOKENTYPES.onthe:
                        parseOnThe(r);
                        break;
                    case TOKENTYPES.on:
                        r.on(parseRanges(TOKENTYPES.dayName)).dayOfWeek();
                        break;
                    case TOKENTYPES.of:
                        r.on(parseRanges(TOKENTYPES.monthName)).month();
                        break;
                    case TOKENTYPES["in"]:
                        r.on(parseRanges(TOKENTYPES.yearIndex)).year();
                        break;
                    case TOKENTYPES.at:
                        r.at(parseTokenValue(TOKENTYPES.time));
                        while (checkAndParse(TOKENTYPES.and)) {
                            r.at(parseTokenValue(TOKENTYPES.time));
                        }
                        break;
                    case TOKENTYPES.also:
                        r.and();
                        break;
                    case TOKENTYPES.except:
                        r.except();
                        break;
                    default:
                        error = pos;
                }
            }

            return {schedules: r.schedules, exceptions: r.exceptions, error: error};
        }

        /**
        * Parses the next token representing a time period and adds it to
        * the provided recur object.
        *
        * @param {Recur} r: The recurrence to add the time period to
        */
        var parseTimePeriod = function (r) {
            var timePeriod = parseToken([TOKENTYPES.second, TOKENTYPES.minute, 
                TOKENTYPES.hour, TOKENTYPES.dayOfYear, TOKENTYPES.dayOfWeek, 
                TOKENTYPES.dayInstance, TOKENTYPES.day, TOKENTYPES.month, 
                TOKENTYPES.year, TOKENTYPES.weekOfMonth, TOKENTYPES.weekOfYear]);

            switch (timePeriod.type) {
                case TOKENTYPES.second:
                    r.second();
                    break;         
                case TOKENTYPES.minute:
                    r.minute();
                    break;
                case TOKENTYPES.hour:
                    r.hour();
                    break;
                case TOKENTYPES.dayOfYear:
                    r.dayOfYear();
                    break;             
                case TOKENTYPES.dayOfWeek:
                    r.dayOfWeek();
                    break;
                case TOKENTYPES.dayInstance:
                    r.dayOfWeekCount();
                    break;
                case TOKENTYPES.day:
                    r.dayOfMonth();
                    break;
                case TOKENTYPES.weekOfMonth:
                    r.weekOfMonth();
                    break;
                case TOKENTYPES.weekOfYear:
                    r.weekOfYear();
                    break;
                case TOKENTYPES.month:
                    r.month();
                    break;
                case TOKENTYPES.year:
                    r.year();
                    break;
                default:
                    error = pos;
            }

            return timePeriod;
        }

        /**
        * Checks the next token to see if it is of tokenType. Returns true if
        * it is and discards the token.  Returns false otherwise.
        *
        * @param {TokenType} tokenType: The type or types of token to parse
        */
        var checkAndParse = function (tokenType) {
            var found = (peek(tokenType)).type === tokenType;
            if (found) {
                scan(tokenType);
            }
            return found;
        }

        /**
        * Parses and returns the next token.
        *
        * @param {TokenType} tokenType: The type or types of token to parse
        */
        var parseToken = function (tokenType) {
            var t = scan(tokenType);
            if (t.type) {
                t.text = convertString(t.text, tokenType)
            }
            else {
                error = pos;
            }
            return t;
        }

        /**
        * Returns the text value of the token that was parsed.
        *
        * @param {TokenType} tokenType: The type of token to parse
        */
        var parseTokenValue = function (tokenType) {
            return (parseToken(tokenType)).text;
        }

        /**
        * Converts a string value to a numerical value based on the type of
        * token that was parsed.
        *
        * @param {String} str: The schedule string to parse
        * @param {TokenType} tokenType: The type of token to convert
        */
        var convertString = function (str, tokenType) {
            var output = str;

            switch (tokenType) {
                case TOKENTYPES.time:
                    var parts = str.split(/(:|am|pm)/)
                      , hour = parts[3] === 'pm' ? parseInt(parts[0],10) + 12 : parts[0]
                      , min = parts[2].trim();

                    output = (hour.length === 1 ? '0' : '') + hour + ":" + min;
                    break;

                case TOKENTYPES.rank:
                    output = parseInt((/^\d+/.exec(str))[0],10);
                    break;

                case TOKENTYPES.monthName:
                case TOKENTYPES.dayName:
                    output = NAMES[str.substring(0,3)];
                    break;
            }

            return output;
        }

        return {

            /**
            * Parses a schedule string.  Returns the schedule, exceptions, and
            * an error position if an error was hit.
            *
            * @param {String} str: The schedule string to parse
            * @api public
            */
            parse: function(str) {
                return parseScheduleExpr(str.toLowerCase());
            }
        };
    };

    /**
    * Allow library to be used within both the browser and node.js
    */
/*    if (typeof exports !== 'undefined') {
        module.exports = EnParser;
    } else {
        window.enParser = EnParser;
    } */

    //root = typeof exports !== "undefined" && exports !== null ? exports : window;
    root.enParser = EnParser;

}).call(this);


