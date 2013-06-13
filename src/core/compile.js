/**
* Compile
* (c) 2013 Bill, BunKat LLC.
*
* Compiles a schedule definition into a form from which instances can be
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

  for(var key in schedDef) {
    var nameParts = key.split('_'),
        name = nameParts[0],
        mod = nameParts[1],
        vals = schedDef[key],
        constraint = mod ? later.modifier[mod](later[name], vals[0]) : later[name];

    constraints.push({constraint: constraint, vals: vals});
    constraintsLen++;
  }

  // sort constraints based on their range for best performance (we want to
  // always skip the largest block of time possible to find the next valid
  // value)
  constraints.sort(function(a,b) {
    return a.constraint.range < b.constraint.range;
  });

  console.log(constraints);

  // this is the smallest constraint which we will use to tick this schedule
  tickConstraint = constraints[constraintsLen-1].constraint;

  function compareFn(dir) {
    return dir === 'next' ?
      function(a,b) { return a > b; } :
      function(a,b) { return b > a; };
  }

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
        console.log('start next=' + next.toUTCString());
        done = true;

        // verify all of the constraints in order since we want to make the
        // largest jumps possible to find the first valid value
        for(var i = 0; i < constraintsLen; i++) {
          var constraint = constraints[i].constraint,
              curVal = constraint.val(next),
              vals = constraints[i].vals,
              extent = constraint.extent(next),
              newVal = nextVal(curVal, vals, extent);

          console.log('curVal=' + curVal);
          console.log('newVal=' + newVal);


          if(curVal !== newVal) {
            next = constraint[dir](next, newVal);
            done = false;
            break;
          }
        }
      }

      console.log('next=' + next.toUTCString());
      console.log('next start=' + tickConstraint.start(next).toUTCString());
      return next ? tickConstraint.start(next) : undefined;
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
      dir = 'next';

      var nextInvalidVal = later.array[dir + 'Invalid'],
          compare = compareFn(dir),
          result;

      for(var i = constraintsLen-1; i >= 0; i--) {
        var constraint = constraints[i].constraint,
            curVal = constraint.val(startDate),
            vals = constraints[i].vals,
            extent = constraint.extent(startDate),
            nextVal = nextInvalidVal(curVal, vals, extent),
            next;

        if(nextVal === curVal) { // startDate is invalid, use that
          next = startDate;
        }
        else if(nextVal) { // constraint has invalid value, use that
          next = constraint[dir](startDate, nextVal);
        }

        if(next && (!result || compare(result, next))) {
          result = next;
        }
      }

      return result;
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