/**
* Compile
* (c) 2013 Bill, BunKat LLC.
*
* Compiles a single schedule definition into a form from which instances can be
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
        constraint = mod ? later.modifier[mod](later[name], vals) : later[name];

    constraints.push({constraint: constraint, vals: vals});
    constraintsLen++;
  }

  // sort constraints based on their range for best performance (we want to
  // always skip the largest block of time possible to find the next valid
  // value)
  constraints.sort(function(a,b) {
    return a.constraint.range < b.constraint.range;
  });

  // this is the smallest constraint, we use this one to tick the schedule when
  // finding multiple instances
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
          done;

/*      console.log('start ---------------------');*/

      while(!done && next) {
        done = true;

        // verify all of the constraints in order since we want to make the
        // largest jumps possible to find the first valid value
        for(var i = 0; i < constraintsLen; i++) {
          var constraint = constraints[i].constraint,
              curVal = constraint.val(next),
              extent = constraint.extent(next),
              newVal = nextVal(curVal, constraints[i].vals, extent);

/*          console.log('constraint = ' + constraint.name);
          console.log('next = ' + next.toUTCString());
          console.log('curVal = ' + curVal);
          console.log('extent = ' + extent);
          console.log('newVal = ' + newVal);
          console.log('is valid = ' + constraint.isValid(next, newVal));*/

          if(!constraint.isValid(next, newVal)) {
            next = constraint[dir](next, newVal);
            done = false;
            break; // need to retest all constraints with new date
          }
        }
      }

/*      console.log('return = ' + (next ? tickConstraint.start(next) : undefined));*/

      // if next, move to start of time period. needed when moving backwards
      return next ? tickConstraint.start(next) : undefined;
    },

    /**
    * Given a valid start time, finds the next schedule that is invalid.
    * Returns the start time if it is actually invalid. Useful for finding the
    * end of a valid time range.
    *
    * @param {Date} startDate: The first possible valid occurrence
    */
    end: function(startDate) {

      var result;

/*      console.log('end ---------------------');*/

      for(var i = constraintsLen-1; i >= 0; i--) {
        var constraint = constraints[i].constraint,
            curVal = constraint.val(startDate),
            extent = constraint.extent(startDate),
            nextVal = later.array.nextInvalid(curVal, constraints[i].vals, extent),
            next;

/*        console.log('constraint = ' + constraint.name);
        console.log('start = ' + startDate.toUTCString());
        console.log('curVal = ' + curVal);
        console.log('extent = ' + extent);
        console.log('nextVal = ' + nextVal);
        console.log('is valid = ' + constraint.isValid(startDate, nextVal));*/

        if(constraint.isValid(startDate, nextVal)) {
          return startDate;
        }

        if(nextVal !== undefined) { // constraint has invalid value, use that
          next = constraint.next(startDate, nextVal);
          if(!result || result > next) {
            result = next;
          }
        }
      }

/*      console.log('return = ' + result);*/

      return result;
    },

    /**
    * Ticks the date by the minimum constraint in this schedule
    *
    * @param {String} dir: Direction to tick in ('next' or 'prev')
    * @param {Date} date: The start date to tick from
    */
    tick: function(dir, date) {
/*      console.log('TICK');
      console.log('date=' + date);
      console.log('next=' + new Date(tickConstraint.end(date).getTime() + later.SEC));*/

      return new Date(dir === 'next' ?
        tickConstraint.end(date).getTime() + later.SEC :
        tickConstraint.start(date).getTime() - later.SEC);
    }

  };
};