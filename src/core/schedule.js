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
  if(!sched) throw new Error('Missing schedule definition.');
  if(!sched.schedules) throw new Error('Definition must include at least one schedule.');

  // compile the schedule components
  var schedules = [],
      schedulesLen = sched.schedules.length,
      exceptions = [],
      exceptionsLen = sched.exceptions ? sched.exceptions.length : 0;

  for(var i = 0; i < schedulesLen; i++) {
    schedules.push(later.compile(sched.schedules[i]));
  }

  for(var j = 0; j < exceptionsLen; j++) {
    exceptions.push(later.compile(sched.exceptions[j]));
  }


  function print(msg, arr) {
    console.log('------- ' + msg + ' -------');

    for(var i = 0, len = arr.length; i < len; i++) {
      var val = arr[i],
          txt = '';

      if(val instanceof Array) {
        txt = 'Schedule ' + i + ': ';
        txt += val[0] ? val[0].toUTCString() : 'undefined';
        txt += val[0] ? ' to ' : '';
        txt += val[0] && val[1] ? val[1].toUTCString() : '';
      }
      else {
        txt = 'Schedule ' + i + ': ';
        txt += val ? val.toUTCString() : 'undefined';
      }

      console.log(txt);
    }

    console.log('++++++++++++++++++++++');
  }




  /**
  * Calculates count number of instances or ranges for the current schedule,
  * optionally between the specified startDate and endDate.
  *
  * @param {String} dir: The direction to use, either 'next' or 'prev'
  * @param {Integer} count: The number of instances or ranges to return
  * @param {Date} startDate: The earliest date a valid instance can occur on
  * @param {Date} endDate: The latest date a valid instance can occur on
  * @param {Bool} isRange: True to return ranges, false to return instances
  */
  function getInstances(dir, count, startDate, endDate, isRange) {
    var compare = compareFn(dir), // encapsulates difference between directions
        loopCount = count,
        maxAttempts = 1000,
        schedStarts = [], exceptStarts = [],
        next, end, results = [];

    startDate = startDate ? new Date(startDate) : new Date();
    if(!startDate || !startDate.getTime()) throw new Error('Invalid start date.');

    // Step 1: calculate the earliest start dates for each schedule
    updateNextStarts(dir, schedules, schedStarts, startDate);

    //print('initial start dates', schedStarts);

    // Step 2: select the earliest of the start dates calculated
    while(maxAttempts-- && loopCount && (next = findNext(schedStarts, compare))) {

      //console.log('Found next earliest start at ' + next.toUTCString());

      // Step 3: make sure the start date we found is in range
      //if(compare(startDate, next)) {
      //  tickStarts(dir, schedules, schedStarts, next);
      //  continue;
      //}

      if(endDate && compare(next, endDate)) {
        break;
      }

      // Step 4: make sure we aren't in the middle of an exception range
      if(exceptionsLen) {
        updateRangeStarts(dir, exceptions, exceptStarts, next);

        //print('update exception ranges', exceptStarts);

        if((end = calcRangeOverlap(dir, exceptStarts, next))) {

          //console.log('Found exception overlap, ends at ' + end.toUTCString());

          updateNextStarts(dir, schedules, schedStarts, end);

          //print('update start dates', schedStarts);

          continue;
        }
      }

      // Step 5: If range, find the end of the range and update start dates
      if(isRange) {

        var maxEndDate = calcMaxEndDate(exceptStarts, compare);
/*        if(compare(maxEndDate, endDate)) {
          maxEndDate = endDate;
        }*/

        //console.log('Found max end date of ' + (maxEndDate ? maxEndDate.toUTCString() : 'none.'));

        end = calcEnd(dir, schedules, schedStarts, next, maxEndDate);

        //console.log('Found end of ' + end.toUTCString());

        results.push( dir === 'next' ?
          [
            new Date(Math.max(startDate, next)),
            new Date(endDate ? Math.min(end, endDate) : end)
          ] :
          [
            new Date(endDate ? Math.max(endDate, end.getTime()+later.SEC) : end.getTime()+later.SEC),
            new Date(Math.min(startDate, next.getTime()+later.SEC))
          ]
        );


/*        if(dir === 'next') {
          results.push([new Date(next), new Date(end)]);
        }
        else {
          results.push([new Date(end.getTime()+later.SEC), new Date(next.getTime()+later.SEC)]);
          //end = next;
        }*/

        //results.push(range);

        //print('results', results);

        // new end is either the end date when going forward, or just before
        // the start date when going backwards
        //end = dir === 'next' ? range[1] : new Date(range[0].getTime()- later.SEC);
        updateNextStarts(dir, schedules, schedStarts, end);

        //print('update next start', schedStarts);


      }
      // otherwise store the start date and tick the start dates
      else {
        //console.log('next = ' + next);

        results.push( dir === 'next' ?
          new Date(Math.max(startDate, next)) :
          getStart(schedules, schedStarts, next, endDate)
        );

        //print('results', results);

        tickStarts(dir, schedules, schedStarts, next);
      }

      loopCount--;
    }

    return results.length === 0 ? undefined : count === 1 ? results[0] : results;
  }

  /**
  * Updates the set of cached start dates to the next valid start dates. Only
  * schedules where the current start date is less than or equal to the
  * specified startDate need to be updated.
  *
  * @param {String} dir: The direction to use, either 'next' or 'prev'
  * @param {Array} schedArr: The set of compiled schedules to use
  * @param {Array} startsArr: The set of cached start dates for the schedules
  * @param {Date} startDate: Starts earlier than this date will be calculated
  */
  function updateNextStarts(dir, schedArr, startsArr, startDate) {
    var compare = compareFn(dir);

    for(var i = 0, len = schedArr.length; i < len; i++) {
      if(!startsArr[i] || !compare(startsArr[i], startDate)) {
        startsArr[i] = schedArr[i].start(dir, startDate);
      }
    }
  }

  /**
  * Updates the set of cached ranges to the next valid ranges. Only
  * schedules where the current start date is less than or equal to the
  * specified startDate need to be updated.
  *
  * @param {String} dir: The direction to use, either 'next' or 'prev'
  * @param {Array} schedArr: The set of compiled schedules to use
  * @param {Array} startsArr: The set of cached start dates for the schedules
  * @param {Date} startDate: Starts earlier than this date will be calculated
  */
  function updateRangeStarts(dir, schedArr, rangesArr, startDate) {
    var compare = compareFn(dir);

    for(var i = 0, len = schedArr.length; i < len; i++) {
      if(!rangesArr[i] || !compare(rangesArr[i][0], startDate)) {
        var nextStart = schedArr[i].start(dir, startDate);
        if(!nextStart) {
          rangesArr[i] = undefined;
        }
        else {
/*          console.log('updating exceptions -----');
          console.log('dir = ' + dir);
          console.log('nextStart = ' + nextStart.toUTCString());
          console.log('end = ' + schedArr[i].end(dir, nextStart).toUTCString());
          console.log('tick = ' + schedArr[i].tick('next', nextStart));*/

          rangesArr[i] = [nextStart, schedArr[i].end(dir, nextStart)];


          //rangesArr[i] = dir === 'next' ?
          //  [nextStart, schedArr[i].end(dir, nextStart)] :
          //  [new Date(schedArr[i].end(dir, nextStart).getTime() + later.SEC), schedArr[i].tick('next', nextStart)];
        }

        //rangesArr[i] = nextStart ? [nextStart, schedArr[i].end('next', nextStart)] : undefined;
      }
    }
  }

  /**
  * Increments all schedules with next start equal to startDate by one tick.
  * Tick size is determined by the smallest constraint within a schedule.
  *
  * @param {String} dir: The direction to use, either 'next' or 'prev'
  * @param {Array} schedArr: The set of compiled schedules to use
  * @param {Array} startsArr: The set of cached start dates for the schedules
  * @param {Date} startDate: The date that should cause a schedule to tick
  */
  function tickStarts(dir, schedArr, startsArr, startDate) {
    for(var i = 0, len = schedArr.length; i < len; i++) {
      if(startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {
        startsArr[i] = schedArr[i].start(dir, schedArr[i].tick(dir, startDate));
      }
    }
  }


  function getStart(schedArr, startsArr, startDate, minEndDate) {
    var result;

    for(var i = 0, len = startsArr.length; i < len; i++) {
      if(startsArr[i].getTime() !== startDate.getTime()) continue;

      var start = schedArr[i].tickStart(startDate);

      if(minEndDate && (start < minEndDate)) {
        return minEndDate;
      }

      if(!result || (start > result)) {
        result = start;
      }
    }

    return result;
  }

  /**
  * Calculates the end of the overlap between any exception schedule and the
  * specified start date. Returns undefined if there is no overlap.
  *
  * @param {String} dir: The direction to use, either 'next' or 'prev'
  * @param {Array} schedArr: The set of compiled schedules to use
  * @param {Array} rangesArr: The set of cached start dates for the schedules
  * @param {Date} startDate: The valid date for which the overlap will be found
  */
  function calcRangeOverlap(dir, rangesArr, startDate) {
    var compare = compareFn(dir), result;

/*    console.log('sched = ' + schedArr);
    console.log('except = ' + rangesArr);
    console.log('start = ' + startDate);*/

    for(var i = 0, len = rangesArr.length; i < len; i++) {
      var range = rangesArr[i];
      if(!range) continue;

      if(!compare(range[0], startDate) && compare(range[1], startDate)) {
        // startDate is in the middle of an exception range
        if(!result || compare(range[1], result)) {
          result = range[1];
        }
      }




/*      // see if startDate falls inside of the range
      if(startDate.getTime() >= range[0].getTime() &&
        (!range[1] || startDate.getTime() < range[1].getTime())) {

        // end depends on direction, going forwards its the end of the exception
        // schedule; going backwards it is the second immediatley before the
        // start of the exception
        var end = dir === 'next' ? range[1] : new Date(range[0].getTime()-1000);
        if(!result || compare(end, result)) {
          result = end;
        }
      }*/
    }

    return result;
  }


  function calcMaxEndDate(exceptsArr, compare) {
    var result;

    for(var i = 0, len = exceptsArr.length; i < len; i++) {
      if(!exceptsArr[i]) continue;

      if(!result || compare(result, exceptsArr[i][0])) {
        result = exceptsArr[i][0];
      }
    }

    return result;
  }


  /**
  * Calculates the next invalid date for a particular schedules starting from
  * the specified valid start date.
  *
  * @param {String} dir: The direction to use, either 'next' or 'prev'
  * @param {Array} schedArr: The set of compiled schedules to use
  * @param {Array} startsArr: The set of cached start dates for the schedules
  * @param {Date} startDate: The valid date for which the end date will be found
  * @param {Date} maxEndDate: The latested possible end date or null for none
  */
  function calcEnd(dir, schedArr, startsArr, startDate, maxEndDate) {
    var compare = compareFn(dir), result;

    for(var i = 0, len = schedArr.length; i < len; i++) {
      var start = startsArr[i];
      if(!start || start.getTime() !== startDate.getTime()) continue;

      var end = schedArr[i].end(dir, start);

      // if the end date is past the maxEndDate, just return the maxEndDate
      if(maxEndDate && compare(end, maxEndDate)) {
        return maxEndDate;
      }

      // otherwise, return the maximum end date that was calculated
      if(!result || compare(end, result)) {
        result = end;
      }
    }

    //console.log(result);

    return result;
  }

  /**
  * Returns a function to use when comparing two dates. Encapsulates the
  * difference between searching for instances forward and backwards so that
  * the same code can be completely reused for both directions.
  *
  * @param {String} dir: The direction to use, either 'next' or 'prev'
  */
  function compareFn(dir) {
    return dir === 'next' ?
      function(a,b) { return a.getTime() > b.getTime(); } :
      function(a,b) { return b.getTime() > a.getTime(); };
  }

  /**
  * Returns the next value in an array using the function passed in as compare
  * to do the comparison. Skips over null or undefined values.
  *
  * @param {Array} arr: The array of values
  * @param {Function} compare: The comparison function to use
  */
  function findNext(arr, compare) {
    var next = arr[0];

    for(var i = 1, len = arr.length; i < len; i++) {
      if(arr[i] && compare(next, arr[i])) {
        next = arr[i];
      }
    }

    return next;
  }

  return {

    /**
    * Returns true if d is a valid occurrence of the current schedule.
    *
    * @param {Date} d: The date to check
    */
    isValid: function(d) {
      return getInstances('next', 1, d, d) !== undefined;
    },

    /**
    * Finds the next valid instance or instances of the current schedule,
    * optionally between a specified start and end date. Start date is
    * Date.now() by default, end date is unspecified. Start date must be
    * smaller than end date.
    *
    * @param {Integer} count: The number of instances to return
    * @param {Date} startDate: The earliest a valid instance can occur
    * @param {Date} endDate: The latest a valid instance can occur
    */
    next: function(count, startDate, endDate) {
      return getInstances('next', count || 1, startDate, endDate);
    },

    /**
    * Finds the previous valid instance or instances of the current schedule,
    * optionally between a specified start and end date. Start date is
    * Date.now() by default, end date is unspecified. Start date must be
    * greater than end date.
    *
    * @param {Integer} count: The number of instances to return
    * @param {Date} startDate: The earliest a valid instance can occur
    * @param {Date} endDate: The latest a valid instance can occur
    */
    prev: function(count, startDate, endDate) {
      return getInstances('prev', count || 1, startDate, endDate);
    },

    /**
    * Finds the next valid range or ranges of the current schedule,
    * optionally between a specified start and end date. Start date is
    * Date.now() by default, end date is unspecified. Start date must be
    * greater than end date.
    *
    * @param {Integer} count: The number of ranges to return
    * @param {Date} startDate: The earliest a valid range can occur
    * @param {Date} endDate: The latest a valid range can occur
    */
    nextRange: function(count, startDate, endDate) {
      return getInstances('next', count || 1, startDate, endDate, true);
    },

    /**
    * Finds the previous valid range or ranges of the current schedule,
    * optionally between a specified start and end date. Start date is
    * Date.now() by default, end date is unspecified. Start date must be
    * greater than end date.
    *
    * @param {Integer} count: The number of ranges to return
    * @param {Date} startDate: The earliest a valid range can occur
    * @param {Date} endDate: The latest a valid range can occur
    */
    prevRange: function(count, startDate, endDate) {
      return getInstances('prev', count || 1, startDate, endDate, true);
    }
  };
};