// Second constraint
later.constraint.s = function(values, reverse, cache) {

  var lr = later.range,
      lds = later.date.second,
      range = reverse ? lr.prev : lr.next,
      rangeInvalid = reverse ? lr.prevInvalid : lr.nextInvalid,
      next = reverse ? lds.prev : lds.next,
      inc, s;

  return {

    // See if the current date is invalid, if it is invalid, return the first date
    // when it will become valid
    isInvalid: function(cur) {
      s = lsd.value(cur, cache);
      if ((inc = range(s, values, lds.offset)) !== s) {
        return next(cur, inc, cache);
      }

      return false;
    },

    // See if the current date is valid, if it is valid, return the first
    // possible date when it will become invalid
    isValid: function(cur) {
      s = lsd.value(cur, cache);
      if ((inc = rangeInvalid(s, values, lds.extent, lds.offset)) !== false) {
        return !inc ? undefined : next(cur, inc, cache);
      }

      return false;
    }

  };
};