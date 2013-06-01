// Minute constraint
later.constraint.m = function(values) {
  var inc, Y, M, D, h, m, range, date;

  function init(d, cache, reverse) {
    var UTC = later.option.UTC;
    Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()),
    M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()),
    D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate()),
    h = cache.h || (cache.h = UTC ? d.getUTCHours() : d.getHours()),
    m = cache.m || (cache.m = UTC ? d.getUTCMinutes() : d.getMinutes()),
    range = reverse ? later.range.prev : later.range.next;
    date = reverse ? later.date.prev : later.date.next;
  }

  return {

    // Returns the constraint value for a particular date, mostly useful for
    // constraints that aren't available on the Date object
    value: function(curDate) {
      init(curDate, {});
      return m;
    },

    // See if the current date is invalid, if it is invalid, return the first date
    // when it will become valid
    isInvalid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if ((inc = range(m, values, 60)) !== m) {
        return date(Y, M, D, h, inc);
      }

      return false;
    },

    // See if the current date is valid, if it is valid, return the first
    // possible date when it will become invalid
    isValid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if ((inc = later.range.invalid(m, values, 0, 59, 60, false, reverse)) !== false) {
        return inc === undefined ? undefined : date(Y, M, D, h, inc);
      }

      return false;
    }

  };
};