/**
* Timeperiod
* (c) 2013 Bill, BunKat LLC.
*
* Example of creating a custom time period. See
* http://bunkat.github.io/later/time-periods.html#custom for more details.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/

var later = require('../index');

// create the new time period
 later.partOfDay = later.pd = {

    name: 'part of day',

    range: later.D.range * 6,

    val: function(d) {
      return later.h.val(d) < 12 ? 0 :
             later.h.val(d) < 18 ? 1 :
             2;
    },

    isValid: function(d, val) {
      return later.pd.val(d) === val;
    },

    extent: function(d) { return [0, 2]; },

    start: function(d) {
      var hour = later.pd.val(d) === 0 ? 0 :
                    later.pd.val(d) === 1 ? 12 :
                    18;

      return later.date.next(
        later.Y.val(d),
        later.M.val(d),
        later.D.val(d),
        hour
      );
    },

    end: function(d) {
      var hour = later.pd.val(d) === 0 ? 11 :
                    later.pd.val(d) === 1 ? 5 :
                    23;

      return later.date.prev(
        later.Y.val(d),
        later.M.val(d),
        later.D.val(d),
        hour
      );
    },

    next: function(d, val) {
      var hour = val === 0 ? 0 : val === 1 ? 12 : 18;

      return later.date.next(
        later.Y.val(d),
        later.M.val(d),
        // increment the day if we already passed the desired time period
        later.D.val(d) + (hour < later.h.val(d) ? 1 : 0),
        hour
      );
    },

    prev: function(d, val) {
      var hour = val === 0 ? 11 : val === 1 ? 5 : 23;

      return later.date.prev(
        later.Y.val(d),
        later.M.val(d),
        // decrement the day if we already passed the desired time period
        later.D.val(d) + (hour > later.h.val(d) ? -1 : 0),
        hour
      );
    }
  };


var sched = {schedules: [{m: [0, 15, 30, 45], pd: [2]}]},
    next = later.schedule(sched).next(5, new Date(2013, 3, 21));

console.log(next);
// Sat, 01 Mar 2014 00:00:00 GMT