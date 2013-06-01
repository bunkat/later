/**
* Hour Constraint (H)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a hour constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.hour = later.h = {

  /**
  * The hour value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function(d) {
    return d.h || (d.h = later.option.UTC ? d.getUTCHours() : d.getHours());
  },

  /**
  * The minimum and maximum valid hour values.
  */
  extent: function() {
    return [0, 23];
  },

  /**
  * The start of the hour of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function(d) {
    return d.hStart || (d.hStart = later.date.next(
      later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));
  },

  /**
  * The end of the hour of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function(d) {
    return d.hEnd || (d.hEnd = later.date.prev(
      later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));
  },

  /**
  * Returns the start of the next instance of the hour value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  next: function(d, val) {
    return later.date.next(
      later.Y.val(d),
      later.M.val(d),
      later.D.val(d) + (val < later.h.val(d) ? 1 : 0),
      val);
  },

  /**
  * Returns the end of the previous instance of the hour value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  prev: function(d, val) {
    return later.date.prev(
      later.Y.val(d),
      later.M.val(d),
      later.D.val(d) + (val > later.h.val(d) ? -1 : 0),
      val);
  }

};