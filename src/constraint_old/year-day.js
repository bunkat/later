// Day of year constraint
later.constraint.dy = function(values) {
  var inc, Y, M, D, dy, Jan1, Today, daysInYear, range, date;

  var SEC = 1000,
      MIN = SEC * 60,
      HOUR = MIN * 60,
      DAY = HOUR * 24;

  function calcDaysInYear(year) {
    return (new Date(Date.UTC(year,1,29)).getUTCMonth() === 1) ? 366 : 365;
  }

  function calcDayOfYear(year, month, day) {
    var first = new Date(Date.UTC(year, 0, 1)).getTime(),
        current = new Date(Date.UTC(year, month, day)).getTime();

    return Math.ceil(current - first)/DAY + 1;
  }

  function calcDiff() {
    var UTC = later.option.UTC,
        result = date(Y, 0, inc),
        expected = inc < 0 ? inc + daysInYear : inc > daysInYear ? inc - daysInYear : inc,
        actual = calcDayOfYear(
          UTC ? result.getUTCFullYear() : result.getFullYear(),
          UTC ? result.getUTCMonth() : result.getMonth(),
          UTC ? result.getUTCDate() : result.getDate()
        );
    return expected - actual;
  }

  function init(d, cache, reverse) {
    var UTC = later.option.UTC;
    Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear());
    M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth());
    D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate());
    dy = cache.dy || (cache.dy = calcDayOfYear(Y, M, D));
    daysInYear = cache.daysInYear || (cache.daysInYear = calcDaysInYear(Y));

    range = reverse ? later.range.prev : later.range.next;
    date = reverse ? later.date.prev : later.date.next;
  }

  return {

    // Returns the constraint value for a particular date, mostly useful for
    // constraints that aren't available on the Date object
    value: function(curDate) {
      init(curDate, {});
      return dy;
    },

    // See if the current date is invalid, if it is invalid, return the first date
    // when it will become valid
    isInvalid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if (((inc = range(dy, values, daysInYear)) || daysInYear) !== dy) {
        // need to be careful about crossing over leap days since they will
        // throw the day counts off. Best way is to just figure out what day
        // we were aiming for and then correct if needed
        return date(Y, 0, inc + calcDiff());
      }

      return false;
    },

    // See if the current date is valid, if it is valid, return the first
    // possible date when it will become invalid
    isValid: function(curDate, reverse, cache) {
      init(curDate || new Date(), cache || {}, reverse);
      if ((inc = later.range.invalid(dy, values, 1, daysInYear, daysInYear, true, reverse)) !== false) {
        if(!inc) return undefined;
        return date(Y, 0, inc + calcDiff());
      }

      return false;
    }

  };
};