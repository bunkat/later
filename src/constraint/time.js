/**
* Time Constraint (dy)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a time of day constraint type. Stored as number of seconds
* since midnight to simplify calculations.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.time = later.t = {

  /**
  * The name of this constraint.
  */
  name: 'time',

  /**
  * The time value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function(d) {
    return d.t || (d.t =
      (later.h.val(d) * 3600) + (later.m.val(d) * 60) + (later.s.val(d)));
  },

  /**
  * The minimum and maximum valid time values.
  */
  extent: function() {
    return [0, 86399];
  },

  /**
  * Returns the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function(d) {
    return d;
  },

  /**
  * Returns the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function(d) {
    return d;
  },

  /**
  * Returns the start of the next instance of the time value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  next: function(d, val) {
    var next = later.date.next(
      later.Y.val(d),
      later.M.val(d),
      later.D.val(d) + (val <= later.t.val(d) ? 1 : 0),
      0,
      0,
      val);

    // correct for passing over a daylight savings boundry
    if(!later.option.UTC && next.getTime() < d.getTime()) {
      next = later.date.next(
        later.Y.val(next),
        later.M.val(next),
        later.D.val(next),
        later.h.val(next),
        later.m.val(next),
        val + 7200);
    }

    return next;
  },

  /**
  * Returns the end of the previous instance of the time value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  prev: function(d, val) {
    return later.date.next(
      later.Y.val(d),
      later.M.val(d),
      later.D.val(d) + (val >= later.t.val(d) ? -1 : 0),
      0,
      0,
      val);
  }

};