/**
* Day Constraint (D)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a day of month (date) constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.day = later.D = {

  /**
  * The day value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function(d) {
    return d.D || (d.D = later.option.UTC ? d.getUTCDate() : d.getDate());
  },

  /**
  * The minimum and maximum valid day values of the month specified.
  *
  * @param {Date} d: The date indicating the month to find the extent of
  */
  extent: function(d) {
    return d.DExtent || (d.DExtent = [1, later.D.val(later.M.end(d))]);
  },

  /**
  * The start of the day of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function(d) {
    return d.DStart || (d.DStart = later.date.next(
      later.Y.val(d), later.M.val(d), later.D.val(d)));
  },

  /**
  * The end of the day of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function(d) {
    return d.DEnd || (d.DEnd = later.date.prev(
      later.Y.val(d), later.M.val(d), later.D.val(d)));
  },

  /**
  * Returns the start of the next instance of the day value indicated. Returns
  * the first day of the next month if val is greater than the number of
  * days in the month.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  next: function(d, val) {
    return later.date.next(
      later.Y.val(d),
      later.M.val(d) + (val < later.D.val(d) ? 1 : 0),
      val > later.D.val(d) ? Math.min(val, later.D.extent(d)[1] + 1) :
      Math.min(val, later.D.extent(later.M.next(d, later.M.val(d)+1))[1] + 1)
    );
  },

  /**
  * Returns the end of the previous instance of the day value indicated. Returns
  * the last day in the previous month if val is greater than the number of days
  * in the month.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  prev: function(d, val) {
    return later.date.next(
      later.Y.val(d),
      later.M.val(d) - (val > later.D.val(d) ? 1 : 0),
      val < later.D.val(d) ? val :
      Math.min(val, later.D.extent(later.M.prev(d, later.M.val(d)-1))[1])
    );
  }

};