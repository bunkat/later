/**
* Time Constraint (dy)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a time of day constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.time = later.t = {

  /**
  * The time value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function(d) {
    return d.t || (d.t =
      later.date.pad(later.h.val(d)) + ':' +
      later.date.pad(later.m.val(d)) + ':' +
      later.date.pad(later.s.val(d)));
  },

  /**
  * The minimum and maximum valid time values.
  */
  extent: function() {
    return ['00:00:00', '23:59:59'];
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
  * @param {int} val: The desired value
  */
  next: function(d, val) {
    var x = val.split(':');

    return later.date.next(
      later.Y.val(d),
      later.M.val(d),
      later.D.val(d) + (val < later.t.val(d) ? 1 : 0),
      x[0],
      x[1],
      x[2]);
  },

  /**
  * Returns the end of the previous instance of the time value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  prev: function(d, val) {
    var x = val.split(':');

    return later.date.next(
      later.Y.val(d),
      later.M.val(d),
      later.D.val(d) + (val > later.t.val(d) ? -1 : 0),
      x[0],
      x[1],
      x[2]);
  }

};