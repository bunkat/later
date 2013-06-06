/**
* Minute Constraint (m)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a minute constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.minute = later.m = {

  /**
  * The minute value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function(d) {
    return d.m || (d.m = later.option.UTC ? d.getUTCMinutes() : d.getMinutes());
  },

  /**
  * The minimum and maximum valid minute values.
  */
  extent: function(d) {
    return [0, 59];
  },

  /**
  * The start of the minute of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function(d) {
    return d.mStart || (d.mStart = later.date.next(
      later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
  },

  /**
  * The end of the minute of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function(d) {
    return d.mEnd || (d.mEnd = later.date.prev(
      later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
  },

  /**
  * Returns the start of the next instance of the minute value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  next: function(d, val) {
    val = val > 59 ? 0 : val;

    var next = later.date.next(
      later.Y.val(d),
      later.M.val(d),
      later.D.val(d),
      later.h.val(d) + (val <= later.m.val(d) ? 1 : 0),
      val);

    // correct for passing over a daylight savings boundry
    if(!later.option.UTC && next.getTime() < d.getTime()) {
      next = later.date.next(
        later.Y.val(next),
        later.M.val(next),
        later.D.val(next),
        later.h.val(next),
        val + 120);
    }

    return next;
  },

  /**
  * Returns the end of the previous instance of the minute value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  prev: function(d, val) {
    val = val > 59 ? 59 : val;

    return later.date.prev(
      later.Y.val(d),
      later.M.val(d),
      later.D.val(d),
      later.h.val(d) + (val >= later.m.val(d) ? -1 : 0),
      val);
  }

};