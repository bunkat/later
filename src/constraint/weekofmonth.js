/**
* Week of Month Constraint (wy)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for an week of month constraint type. Week of month treats the
* first of the month as the start of week 1, with each following week starting
* on Sunday.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.weekOfMonth = later.wm = {

  /**
  * The week of month value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  value: function(d) {
    return d.wm || (d.wm =
      (later.D.val(d) +
      (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(d))) / 7);
  },

  /**
  * The minimum and maximum valid week of month values for the month indicated.
  *
  * @param {Date} d: The date indicating the month to find values for
  */
  extent: function(d) {
    return d.wmExtent || (d.wmExtent = [1,
      (later.D.extent(d)[1] + (later.dw.val(later.M.start(d)) - 1) +
      (7 - later.dw.val(later.M.end(d)))) / 7]);
  },

  /**
  * The start of the week of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function(d) {
    return d.wmStart || (d.wmStart = later.date.next(
      later.Y.val(d),
      later.M.val(d),
      Math.max(later.D.val(d) - later.dw.val(d) + 1, 1)));
  },

  /**
  * The end of the week of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function(d) {
    return d.wmEnd || (d.wmEnd = later.date.prev(
      later.Y.val(d),
      later.M.val(d),
      Math.min(later.D.val(d) + (7 - later.dw.val(d)), later.D.extent(d)[1])));
  },

  /**
  * Returns the start of the next instance of the week value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  next: function(d, val) {
    var month = val > later.dw.val(d) ?
          later.M.start(d) : later.M.next(d, later.M.val(d)+1);

    // jump to the Sunday of the desired week, set to 1st of month for week 1
    return later.date.next(
        later.Y.val(d),
        later.M.val(month),
        Math.max(1, (val-1) * 7 - (later.dw.val(month)-2)));
  },

  /**
  * Returns the end of the previous instance of the week value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  prev: function(d, val) {
    var month = val < later.dw.val(d) ? later.M.start(d) :
          later.M.start(later.M.prev(d, later.M.value(d)-1));

    // jump to the end of Saturday of the desired week
    return later.dw.end(later.date.next(
        later.Y.val(d),
        later.M.val(month),
        Math.max(1, (val-1) * 7 - (later.dw.val(month)-2))));
  }

};