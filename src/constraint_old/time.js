// Time of day constraint
later.constraint.t = function(values) {
  var inc, Y, M, D, h, m, s, t, range, date;

  function init(d, cache, reverse) {
    var UTC = later.option.UTC;
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
      if ((inc = range(t, values)) !== t) {
        var x = inc.split(':'),
            dayInc = !reverse ? (t > inc ? 1 : 0) : (t < inc ? -1 : 0);

        return date(Y, M, D + dayInc, x[0], x[1], x[2]);
      }

      return false;
    },

    // See if the current date is valid, if it is valid, return the first
    // possible date when it will become invalid
    isValid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      var o = t;
      if (values.indexOf(t) > -1) {
        do {
          s = reverse ? s-1 : s+1;
          if(s === -1) { s = 59; m = m-1; }
          else if(s === 60) { s = 0; m = m+1; }

          if(m === -1) { m = 59; h = h-1; }
          else if(m === 60) { m = 0; h = h+1; }

          if(h === -1) { h = 23; }
          else if(h === 24) { h = 0; }

          t = later.date.time(h, m, s);
        }
        while(o !== t && values.indexOf(t) > -1);

        return t === o ? undefined :
               reverse ? date(Y, M, D - (t > o ? 1 : 0), h, m, s) :
                         date(Y, M, D + (t < o ? 1 : 0), h, m, s);
      }

      return false;
    }

  };
};