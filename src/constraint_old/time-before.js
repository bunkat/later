// Time before constraint
later.constraint.tb = function(values) {
  var value = values[0], x = value.split(':'),
      Y, M, D, h, m, s, t, range, date;

  function init(d, cache, reverse) {
    var UTC = later.options.UTC;
    Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()),
    M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()),
    D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate()),
    h = cache.h || (cache.h = UTC ? d.getUTCHours() : d.getHours()),
    m = cache.m || (cache.m = UTC ? d.getUTCMinutes() : d.getMinutes()),
    s = cache.s || (cache.s = UTC ? d.getUTCSeconds() : d.getSeconds()),
    t = cache.t || (cache.t = later.date.time(h, m, s)),
    range = reverse ? later.range.prev : later.range.next;
    date = reverse ? later.date.prev : later.date.next;
  }

  return {

    // Returns the constraint value for a particular date, mostly useful for
    // constraints that aren't available on the Date object
    value: function(curDate) {
      init(curDate, {});
      return t;
    },

    // See if the current date is invalid, if it is invalid, return the first date
    // when it will become valid
    isInvalid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if (t >= value) {
        return reverse ? date(Y, M, D, x[0], x[1], x[2]-1) : date(Y, M, D+1);
      }

      return false;
    },

    // See if the current date is valid, if it is valid, return the first
    // possible date when it will become invalid
    isValid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if (t < value) {
        return reverse ? date(Y, M, D-1, x[0], x[1], x[2]-1) :
                         date(Y, M, D, x[0], x[1], x[2]);
      }

      return false;
    }

  };
};