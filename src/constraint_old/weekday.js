// Day of week constraint
later.constraint.dw = function(values) {
  var inc, Y, M, D, d, range, date;

  function init(val, cache, reverse) {
    var UTC = later.option.UTC;
    Y = cache.Y || (cache.Y = UTC ? val.getUTCFullYear() : val.getFullYear());
    M = cache.M || (cache.M = UTC ? val.getUTCMonth() : val.getMonth());
    D = cache.D || (cache.D = UTC ? val.getUTCDate() : val.getDate());
    d = cache.d || (cache.d = UTC ? val.getUTCDay() : val.getDay());
    range = reverse ? later.range.prev : later.range.next;
    date = reverse ? later.date.prev : later.date.next;
  }

  return {

    // Returns the constraint value for a particular date, mostly useful for
    // constraints that aren't available on the Date object
    value: function(curDate) {
      init(curDate, {});
      return d;
    },

    // See if the current date is invalid, if it is invalid, return the first date
    // when it will become valid
    isInvalid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if ((inc = range(d+1, values, 7)) !== d+1) {
          return date(Y, M, D + (inc-1) - d);
      }

      return false;
    },

    // See if the current date is valid, if it is valid, return the first
    // possible date when it will become invalid
    isValid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if ((inc = later.range.invalid(d+1, values, 1, 7, 7, true, reverse)) !== false) {
        return inc === undefined ? undefined : date(Y, M, D + (inc-1) - d);
      }

      return false;
    }

  };
};