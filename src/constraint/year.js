/**
* Year Constraint (Y)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a year constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.year = later.Y = {

  /**
  * The year value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function(d) {
    return d.Y || (d.Y = later.option.UTC ? d.getUTCFullYear() : d.getFullYear());
  },

  /**
  * The minimum and maximum valid values for the year constraint.
  */
  extent: function() {
    return [later.option.minYear, later.option.maxYear];
  },

  /**
  * The start of the year of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function(d) {
    return d.YStart || (d.YStart = later.date.next(later.Y.val(d)));
  },

  /**
  * The end of the year of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function(d) {
    return d.YEnd || (d.YEnd = later.date.prev(later.Y.val(d)));
  },

  /**
  * Returns the start of the next instance of the year value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  next: function(d, val) {
    return val < later.Y.extent()[1] ? later.date.next(val) : undefined;
  },

  /**
  * Returns the end of the previous instance of the year value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value
  */
  prev: function(d, val) {
    return val > later.Y.extent()[0] ? later.date.prev(val) : undefined;
  }

};