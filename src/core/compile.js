/**
* Compile
* (c) 2013 Bill, BunKat LLC.
*
* Compiles a schedule definition into a schedule from which instances can be
* efficiently calculated from.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/

later.compile = function(schedDef) {

  var constraints = [],
      constraintsLen = 0,
      tickConstraint;

  // create constraints for values in schedule (order matters!)
  for(var i = 0, len = later.constraintOrder.length; i < len; i++) {
    var constraintName = later.constraintOrder[i],
        vals = schedDef[constraintName];

    if(vals) {
      constraints.push({constraint: later[constraintName], vals: vals});
      constraintsLen++;
    }
  }

  // this is the smallest constraint which we will use to tick this schedule
  tickConstraint = constraints[constraintsLen-1].constraint;

  return {

    /**
    * Calculates the start of the next valid occurrence of a particular schedule
    * that occurs on or after the specified start time.
    *
    * @param {String} dir: Direction to search in ('next' or 'prev')
    * @param {Date} startDate: The first possible valid occurrence
    */
    start: function(dir, startDate) {
      var next = startDate,
          nextVal = later.array[dir],
          done = false;

      while(!done && next) {
        done = true;

        // verify all of the constraints in order since we want to make the
        // largest jumps possible to find the first valid value
        for(var i = 0; i < constraintsLen; i++) {
          var constraint = constraints[i].constraint,
              curVal = constraint.val(next),
              vals = constraints[i].vals,
              extent = constraint.extent(next),
              newVal = nextVal(curVal, vals, extent);

          if(curVal !== newVal) {
            next = constraint[dir](next, newVal);
            done = false;
            break;
          }
        }
      }

      return next;
    },

    /**
    * Given a valid start time, finds the next schedule that is invalid.
    * Returns the start time if it is actually invalid. Useful for finding the
    * end of a valid time range.
    *
    * @param {String} dir: Direction to search in ('next' or 'prev')
    * @param {Date} startDate: The first possible valid occurrence
    */
    end: function(dir, startDate) {
      var nextInvalidVal = later.array[dir + 'Invalid'],
          i = constraintsLen-1,
          next;

      // loop is only needed for case where a constraint is specified, but all
      // values are valid
      do {
        var constraint = constraints[i].constraint,
            curVal = constraint.val(startDate),
            vals = constraints[i].vals,
            extent = constraint.extent(startDate),
            nextVal = nextInvalidVal(curVal, vals, extent);

        if(nextVal === curVal) { // startDate is invalid, use that
          next = startDate;
        }
        else if(nextVal) { // constraint has invalid value, use that
          next = constraint[dir](startDate, nextVal);
        }

      } while(--i >= 0 && next === undefined);

      return next;
    },

    /**
    * Ticks the date by the minimum constraint in this schedule
    *
    * @param {String} dir: Direction to search in ('next' or 'prev')
    * @param {Date} date: The start date to tick from
    */
    tick: function(dir, date) {
      return new Date(dir === 'next' ?
        tickConstraint.end(date).getTime() + later.SEC :
        tickConstraint.start(date).getTime() - later.SEC);
    }

  };
};