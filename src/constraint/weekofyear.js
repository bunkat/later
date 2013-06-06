/**
* Week of Year Constraint (wy)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for an ISO 8601 week constraint type. For more information about
* ISO 8601 see http://en.wikipedia.org/wiki/ISO_week_date.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.weekOfYear = later.wy = {

  /**
  * The ISO week year value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function(d) {
    if (d.wy) return d.wy;

    // move to the Thursday in the target week and find Thurs of target year
    var wThur = later.dw.next(later.wy.start(d), 5),
        YThur = later.dw.next(later.Y.prev(d, later.Y.val(wThur)-1), 5);

    // caculate the difference between the two dates in weeks
    return (d.wy = 1 + Math.ceil((wThur.getTime() - YThur.getTime()) / later.WEEK));
  },

  /**
  * The minimum and maximum valid ISO week values for the year indicated.
  *
  * @param {Date} d: The date indicating the year to find ISO values for
  */
  extent: function(d) {
    return d.wyExtent || (d.wyExtent = [1,
      later.dw.val(later.Y.start(d)) === 5 || later.dw.val(later.Y.end(d)) === 5 ? 53 : 52]);
  },

  /**
  * The start of the ISO week of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function(d) {
    return d.wyStart || (d.wyStart = later.date.next(
      later.Y.val(d),
      later.M.val(d),
      // jump to the Monday of the current week
      later.D.val(d) - (later.dw.val(d) > 1 ? later.dw.val(d) - 2 : 6)
    ));
  },

  /**
  * The end of the ISO week of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function(d) {
    return d.wyEnd || (d.wyEnd = later.date.prev(
      later.Y.val(d),
      later.M.val(d),
      // jump to the Saturday of the current week
      later.D.val(d) + (later.dw.val(d) > 1 ? 8 - later.dw.val(d) : 0)
    ));
  },

  /**
  * Returns the start of the next instance of the ISO week value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  next: function(d, val) {
    var wyStart = later.wy.start(d),
        wy = later.wy.val(d),
        year = (val && val <= wy) || (!val && wy == later.wy.extent(d)[1]) ?
          later.Y.next(d, later.Y.val(d)+1) :
          later.Y.start(d);

    val = Math.min(val || later.wy.extent(year)[1], later.wy.extent(year)[1]);
    var diff = val > wy ? val - wy : later.wy.extent(d)[1] - wy + val;

    return later.date.next(
        later.Y.val(wyStart),
        later.M.val(wyStart),
        later.D.val(wyStart) + 7 * diff
      );
  },

  /**
  * Returns the end of the previous instance of the ISO week value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  prev: function(d, val) {
    var wyEnd = later.wy.end(d),
        YPrev = later.Y.prev(wyEnd, later.Y.val(wyEnd)-1),
        wy = later.wy.val(d);

    val = Math.min(val || later.wy.extent(YPrev)[1], later.wy.extent(YPrev)[1]);
    var diff = val < wy ? wy - val : wy + (later.wy.extent(YPrev)[1] - val);

    return later.date.prev(
        later.Y.val(wyEnd),
        later.M.val(wyEnd),
        later.D.val(wyEnd) - 7 * diff
      );
  }
};