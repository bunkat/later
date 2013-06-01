/**
* Calculates the next occurrence (or occcurrences) of a given schedule.
* Schedules are simply a set of constraints that must be met for a
* particular date to be valid. Schedules can be generated using a parser or
* can be created directly.
*
* Schedules have the following form:
*
* {
*   schedules: [
*     {
*       constraintId: [valid values],
*       constraintId: [valid values],
*       ...
*     },
*     {
*       constraintId: [valid values],
*       constraintId: [valid values],
*       ...
*     }
*     ...
*   ],
*   exceptions: [
*     {
*       constraintId: [valid values],
*       constraintId: [valid values],
*       ...
*     },
*     {
*       constraintId: [valid values],
*       constraintId: [valid values],
*       ...
*     },
*     ...
*   ]
* }
*
* See Recur.js for the available constraints and their value ranges.  May
* also be useful to create a schedule using Recur and then examining the
* schedule that is produced.
*/

/**
* Initializes the schedule object.
*
* @param {Schedule} sched: The definition of the schedule
* @param {Int} resolution: The minimum amount of time between valid schedules
* @api public
*/
later.schedule = function(sched, resolution) {
  resolution = resolution === undefined ? later.option.resolution : resolution;


  // compile the schedule components
  var schedules = [],
      schedulesLen = sched && sched.schedules ? sched.schedules.length : 0,
      exceptions = [],
      exceptionsLen = sched && sched.exceptions ? sched.exceptions.length : 0;

  for(var i = 0; i < schedulesLen; i++) {
    schedules.push(later.compile(sched.schedules[i]));
  }

  for(var j = 0; j < exceptionsLen; j++) {
    exceptions.push(later.compile(sched.exceptions[j]));
  }

  /**
  * Returns a new date object that represents the next possible valid
  * occurrence based on the resolution that has beeen configured.
  *
  * @param {Date} date: The Date object to be incremented
  * @param {Boolean} reverse: True to tick backwards instead of forwards
  */
  function tick(date, reverse) {
    return !reverse ?
      new Date(date.getTime() + (resolution * 1000)) :
      new Date(date.getTime() - (resolution * 1000));
  }

  /**
  * Compares two dates, flipping the direction based on reverse.
  *
  * @param {Date} a: The first Date to compare
  * @param {Date} b: The second Date to compare
  * @param {Boolean} reverse: True for a < b, false for a > b
  */
  function compare(a, b, reverse) {
    return reverse ? a.getTime() < b.getTime() : a.getTime() > b.getTime();
  }

  /**
  * Returns true if the specified date meets all of the constraints
  * defined within the specified schedule.
  *
  * @param {Recur} recur: Set of schedule and exception constraints
  * @param {Date} date: The date to validate against
  * @api public
  */
  function isValid(sched, except, date) {
    date.setMilliseconds(0);
    var next = getNext(sched, except, date);
    return next ? date.getTime() === next.getTime() : false;
  }

  /**
  * Returns count valid occurrence of a composite schedule.
  *
  * @param {Date} startDate: The initial date to start looking from
  * @param {Date} endDate: The last date to include
  * @param {Int} count: The number of occurrences to return
  * @param {Bool} reverse: The last date to include
  */
  function get(startDate, endDate, count, reverse) {
    var result;

    if(count === 1) {
      result = getNext(schedules, exceptions, startDate, endDate, reverse);
    }
    else {
      result = [];
      while(count--) {
        var tDate = getNext(schedules, exceptions, startDate, endDate, reverse);
        if(!tDate) break;
        result.push(tDate);
        startDate = tick(tDate, reverse);
      }
    }

    return result;
  }

  /**
  * Returns the next valid occurrence of a composite schedule.
  *
  * @param {Date} startDate: The initial date to start looking from
  * @param {Date} endDate: The last date to include
  * @param {Bool} reverse: The last date to include
  */
  function getNext(sched, except, startDate, endDate, reverse) {
    var start = startDate || new Date(),
        result;

    while(start) {
      var tDate;

      if(sched.length) {
        for(var i = 0, len = sched.length; i < len; i++) {
          tDate = sched[i].getValid(start, reverse);
          if (tDate && (!result || compare(result, tDate, reverse))) {
            result = tDate;
          }
        }
      }
      else {
        result = start;
      }

      start = null;

      if (result && except.length) {
        tDate = getNextInvalid(except, [], result, reverse);
        if(tDate.getTime() !== result.getTime()) {
          start = tDate;
          result = undefined;
        }
      }

      if(result && endDate && compare(result, endDate, reverse)) {
        result = undefined;
        break;
      }
    }

    return result;
  }

  /**
  * Returns the next invalid occurrence of a schedule. Useful for
  * quickly calculating the end of a valid time period.
  *
  * @param {Array} constraints: Set of constraints to test against
  * @param {Date} startDate: The initial date to start looking frome
  */
  function getNextInvalid(sched, except, startDate, reverse) {
    var start = startDate || new Date();

    while(start && isValid(sched, except, start)) {
      var nextExcep, nextInvalid;

      // get the next invalid schedule if there is one
      for(var i = 0, len = sched.length; i < len; i++) {
        var tDate = sched[i].getInvalid(start, reverse);
        if (tDate && (!nextInvalid || compare(tDate, nextInvalid, reverse))) {
          nextInvalid = tDate;
        }
      }

      // get the next occurrence of any of the exceptions
      if(except.length) {
        nextExcep = getNext(except, [], start, null, reverse);
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
  }

  return {

    /**
    * Returns true if the specified date meets all of the constraints
    * defined within the specified schedule.
    *
    * @param {Recur} recur: Set of schedule and exception constraints
    * @param {Date} date: The date to validate against
    * @api public
    */
    isValid: function (date) {
      return isValid(schedules, exceptions, date);
    },

    next: function(start, end, count) {
      return get(start, end, count || 1, false);
    },

    nextRange: function(start, end) {
      var tStart = getNext(schedules, exceptions, start, end, false),
          tEnd = getNextInvalid(schedules, exceptions, tStart, false);

      return [tStart, tEnd];
    },

    prev: function(start, end, count) {
      return get(start, end, count || 1, true);
    },

    prevRange: function(start) {
      var tStart = getNext(schedules, exceptions, start, null, true),
          tEnd = getNextInvalid(schedules, exceptions, tStart, true);

      return [tStart, tEnd];
    }
  };
};



