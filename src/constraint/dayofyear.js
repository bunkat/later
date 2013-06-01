/**
* Day of Year Constraint (dy)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a day of year constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.dayOfYear = later.dy = {

  /**
  * The day of year value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function(d) {
    return d.dy || (d.dy =
      Math.ceil(1 + (later.D.start(d).getTime() - later.Y.start(d).getTime()) / later.DAY));
  },

  /**
  * The minimum and maximum valid day of year values of the month specified.
  *
  * @param {Date} d: The date indicating the month to find the extent of
  */
  extent: function(d) {
    return (d.dyExtent =
      [1, later.M.val(later.date.next(later.Y.val(d), 1, 29)) === 1 ? 366 : 365]);
  },

  /**
  * The start of the day of year of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function(d) {
    return later.D.start(d);
  },

  /**
  * The end of the day of year of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function(d) {
    return later.D.end(d, cache);
  },

  /**
  * Returns the start of the next instance of the day of year value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  next: function(d, val) {
    return later.date.next(
      later.Y.val(d) + (val < later.dy.val(d) ? 1 : 0),
      later.M.extent()[0],
      val
    );
  },

  /**
  * Returns the end of the previous instance of the day of year value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  prev: function(d, val) {
    return later.date.prev(
      later.Y.val(d) + (val > later.dy.val(d) ? -1 : 0),
      later.M.extent()[0],
      val
    );
  }

};