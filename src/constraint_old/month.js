// Month constraint
later.constraint.M = function(values) {
  var inc, Y, M, range, date;

  function init(d, cache, reverse) {
    var UTC = later.option.UTC;
    Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()),
    M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()),
    range = reverse ? later.range.prev : later.range.next;
    date = reverse ? later.date.prev : later.date.next;
  }

  return {

    // Returns the constraint value for a particular date, mostly useful for
    // constraints that aren't available on the Date object
    value: function(curDate) {
      init(curDate, {});
      return M;
    },

    // See if the current date is invalid, if it is invalid, return the first date
    // when it will become valid
    isInvalid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if ((inc = range(M+1, values, 12)) !== M+1) {
        return date(Y, inc-1);
      }

      return false;
    },

    // See if the current date is valid, if it is valid, return the first
    // possible date when it will become invalid
    isValid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if ((inc = later.range.invalid(M+1, values, 1, 12, 12, true, reverse)) !== false) {
        return inc === undefined ? undefined : date(Y, inc-1);
      }

      return false;
    }

  };
};