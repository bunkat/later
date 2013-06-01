// Year constraint
later.constraint.Y = function(values, direction, cache) {

  var lr = later.range,
      ldy = later.date.year,
      range = direction ? lr.prev : lr.next,
      rangeInvalid = direction ? lr.prevInvalid : lr.nextInvalid,
      next = direction ? ldy.prev : ldy.next,
      inc, Y;

  return {

    // See if the current date is invalid, if it is invalid, return the first date
    // when it will become valid
    isInvalid: function(cur) {
      Y = ldy.value(cur, cache);

      if ((inc = range(Y, values)) !== Y ) {
        return direction ?
          inc < Y ? next(cur, inc) : undefined :
          inc > Y ? next(cur, inc) : undefined;
      }

      return false;
    },

    // See if the current date is valid, if it is valid, return the first
    // possible date when it will become invalid
    isValid: function(cur) {
      Y = ldy.value(cur, cache);

      if ((inc = rangeInvalid(Y, values, ldy.extent(), ldy.offset())) !== false) {
        return !inc ? undefined : next(cur, inc);
      }

      return false;
    }

  };
};