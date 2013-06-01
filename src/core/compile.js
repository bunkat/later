later.compile = function(sched) {

  var constraints = [],
      constraintsLen = 0,
      applyAfter = false,
      cache = {};

  // see if we need to apply after constraints
  for(var keys in sched) {
    if(keys[0] === 'a') {
      applyAfter = true;
      break;
    }
  }

  // create constraints for values in schedule (order matters!)
  // compile both a forward constraint and a reverse constraint
  // for improved performance (reduces branching significantly)
  later.constraint.priority.forEach(function(c) {
    var vals = sched[c];
    if(vals) {
      constraints.push([
        later.constraint[c](vals, later.dir.forward, cache),
        later.constraint[c](vals, later.dir.reverse, cache)
      ]);
    }
  });

  constraintsLen = constraints.length;

  /**
  * Increments a date by the amount of time specified by a schedules after
  * constraints.  Date returned is either using Local time or UTC based on
  * later.options.UTC.
  *
  * @param {Date} start: The date to apply the after constraints to
  */
  function after(start) {
    var Y = later.date.year.value(start) + val(sched.aY),
        M = later.date.month.value(start) + val(sched.aM),
        D = later.date.date.value(start) +
              Math.max(val(sched.aD), val(sched.ady), val(sched.ad),
              val(sched.awy) * 7, val(sched.awm) * 7),
        h = later.date.hour.value(start) + val(sched.ah),
        m = later.date.minute.value(start) + val(sched.am),
        s = later.date.second.value(start) + val(sched.as);

    return later.date.next(Y, M, D, h, m, s);
  }

  /**
  * Returns the value of an after constraint or 0 if not set.
  *
  * @param {Array} constraint: After constraint to check
  */
  function val(constraint) {
    return constraint && constraint[0] ? constraint[0] : 0;
  }

  return {

    /**
    * Calculates the next valid occurrence of a particular schedule that
    * occurs on or after the specified start time.
    *
    * @param {Date} start: The first possible valid occurrence
    * @param {Date} end: The last possible valid occurrence
    * @param {Later.dir} dir: Direction to search in
    */
    getValid: function(start, dir) {
      var next = (applyAfter && !dir) ? after(start) : start,
          maxLoopCount = 1000, done = false;

      while(!done && next && maxLoopCount--) {
        done = true;
        cache = {};

        // verify all of the constraints in order since we want to make the
        // largest jumps possible to find the first valid value
        for(var i = 0; i < constraintsLen; i++) {
          var tNext = constraints[i][dir].isInvalid(next);
          if(tNext !== false) {
            next = tNext;
            done = false;
            break;
          }
        }
      }

      return maxLoopCount ? next : null;
    },

    /**
    * Given a valid start time, finds the next schedule that is invalid.
    * Returns the start time if it is actually invalid. Useful for finding the
    * end of a valid time range.
    *
    * @param {Date} start: The first possible valid occurrence
    * @param {Later.dir} dir: Direction to search in
    */
    getInvalid: function(start, dir) {
      var cache = {};

      // verify all of the constraints in reverse order since we want to
      // increment by the smallest amount possible to make the date invalid
      for(var i = constraintsLen-1; i >= 0; i--) {
        var tNext = constraints[i][dir].isValid(start);
        if(tNext !== false) {
          return tNext;
        }
      }

      return start;
    }

  };
};