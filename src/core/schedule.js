/**
* Schedule
* (c) 2013 Bill, BunKat LLC.
*
* Returns an object to calculate future or previous occurrences of the
* specified schedule.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/

later.schedule = function(sched) {

  // compile the schedule components
  var schedules = [], schedulesLen = sched.schedules.length,
      exceptions = [], exceptionsLen = sched.exceptions ? sched.exceptions.length : 0;

  for(var i = 0; i < schedulesLen; i++) {
    schedules.push(later.compile(sched.schedules[i]));
  }

  for(var j = 0; j < exceptionsLen; j++) {
    exceptions.push(later.compile(sched.exceptions[j]));
  }

  function getInstances(dir, count, startDate, endDate, isRange) {
    var d = startDate ? new Date(startDate) : new Date(),
        instances = getStart(dir, count, d, endDate, isRange);

    return instances.length === 0 ? undefined :
           count === 1 ? instances[0] : instances;
  }

  function getStart(dir, count, startDate, endDate, isRange) {
    var nextIndex = indexFn(dir), compare = compareFn(dir),
        schedStarts = [], next, results = [];

    // calc the earliest start date for each schedule
    calcSchedStarts(dir, schedStarts, startDate);

    while(count--) {

      while((next = schedStarts[nextIndex(schedStarts)])) {

        // make sure we didn't go past the end date
        if((endDate && compare(next.getTime(), endDate.getTime()))) {
          next = null;
          break;
        }

        // make sure that this date isn't included in any exception
        // if it is, update the schedule starts and try again
        var exceptionEnd = getExceptionEnd(dir, next);
        if(exceptionEnd) {
          calcSchedStarts(dir, schedStarts, exceptionEnd);
          continue;
        }

        // date is good, push to results and tick schedules to next time
        results.push( isRange ?
          [new Date(next), new Date(getEnd(dir, schedStarts, next))] :
           new Date(next)
        );

        tickSchedStarts(dir, schedStarts, next);

        break;
      }

      // break out if we've run out of valid dates
      if(!next) {
        break;
      }
    }

    return results;
  }


  function getEnd(dir, schedStarts, next) {
    var compare = compareFn(dir), end;

    for(var i = 0; i < schedulesLen; i++) {
      // find the max end date for any schedule that is valid at 'next'
      if(schedStarts[i] && schedStarts[i].getTime() === next.getTime()) {
        var schedEnd = schedules[i].end(dir, next);
        if(!end || compare(schedEnd,end)) {
          end = schedEnd;
        }
      }
    }

    // find the min start date of any exception starting from 'next'
    for(var j = 0; j < exceptionsLen; j++) {
      var exceptStart = exceptions[j].start(dir, next);
      if(compare(end, exceptStart)) {
        end = exceptStart;
      }
    }

    return new Date(end);
  }

  function getExceptionEnd(dir, next) {
    var compare = compareFn(dir), result;
    if(exceptionsLen) {
      for(var i = 0; i < exceptionsLen; i++) {
        var exceptStart = exceptions[i].start(dir, next);
        if(exceptStart && (exceptStart.getTime() === next.getTime() || compare(next, exceptStart))) {
          //var end = exceptions[i].end(dir, next);
          var end = dir === 'next' ? exceptions[i].end(dir, next) : new Date(exceptStart.getTime()-1000);
          result = !result || compare(end, result) ? end : result;
        }
      }
    }

    return result;
  }

  function tickSchedStarts(dir, schedStarts, next) {
    for(var i = 0; i < schedulesLen; i++) {
      if(schedStarts[i] && schedStarts[i].getTime() === next.getTime()) {
        schedStarts[i] = schedules[i].start(dir, schedules[i].tick(dir, next));
      }
    }
  }

  function calcSchedStarts(dir, schedStarts, next) {
    var compare = compareFn(dir);

    for(var i = 0; i < schedulesLen; i++) {
      if(!schedStarts[i] || compare(next, schedStarts[i])) {
        schedStarts[i] = schedules[i].start(dir, next);
      }
    }
  }

  function compareFn(dir) {
    return dir === 'next' ?
      function(a,b) { return a > b; } :
      function(a,b) { return b > a; };
  }

  function indexFn(dir) {
    return dir === 'next' ? later.array.minIndex : later.array.maxIndex;
  }


  return {

    isValid: function(d) {
      return getInstances('next', 1, d, d) !== undefined;
    },

    next: function(count, startDate, endDate) {
      return getInstances('next', count || 1, startDate, endDate);
    },

    prev: function(count, startDate, endDate) {
      return getInstances('prev', count || 1, startDate, endDate);
    },

    nextRange: function(count, startDate, endDate) {
      return getInstances('next', count || 1, startDate, endDate, true);
    },

    prevRange: function(count, startDate, endDate) {
      return getInstances('prev', count || 1, startDate, endDate, true);
    }

  };

};