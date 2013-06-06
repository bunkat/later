var should = require('should');

module.exports = runner = function (later, constraint) {

  function convertToUTC(d) {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(),
      d.getHours(), d.getMinutes(), d.getSeconds()));
  }

  function runBasicTest(fn, data, utc) {
    var date = utc ? convertToUTC(data.date) : data.date,
        dateString = utc ? date.toUTCString() : date,
        ex = utc && (data[fn] instanceof Date) ? convertToUTC(data[fn]) : data[fn],
        exString = utc && (ex instanceof Date) ? ex.toUTCString() : ex;

    it('should return ' + exString + ' for ' + dateString, function() {
      later.option.UTC = utc;
      constraint[fn](date).should.eql(ex);
    });
  }

  function runComplexTest(fn, data, utc) {
    var min = data.extent[0],
        max = data.extent[1],
        supportsLast = min === 1;

    if(supportsLast) {
      min = 0; // test 'last' value
    }

    for(var i = min; i <= max + 1; i++) { // test for overbounds
      if(fn === 'next') {
        testNext(data, i, supportsLast, utc); // test all values for amt
      }
      else {
        testPrev(data, i, supportsLast, utc); // test all values for amt
      }
    }
  }

  function testNext(data, amt, supportsLast, utc) {
    var date = utc ? convertToUTC(data.date) : data.date,
        dateString = utc ? date.toUTCString() : date;

    it('should return first date after ' + dateString + ' with val ' + amt, function() {
      later.option.UTC = utc;

      var next = constraint.next(date, amt),
          ex = supportsLast ? amt || constraint.extent(next)[1] : amt,
          outOfBounds = ex > constraint.extent(next)[1];

      // if amt is outside of extent, the constraint should rollover to the
      // first value of the following time period
      if (outOfBounds) ex = constraint.extent(next)[0];

      // result should match ex, should be greater than date, and should
      // be at the start of the time period
      // if check is hack to support year constraints which can return undefined
      if(amt < later.option.minYear || amt === '00:00:00' || (amt > constraint.val(date) && amt <= later.option.maxYear)) {
        constraint.val(next).should.eql(ex);
        next.getTime().should.be.above(date.getTime());
        constraint.start(next).getTime().should.eql(next.getTime());
      }
      else {
        should.not.exist(next);
      }

    });
  }

  function testPrev(data, amt, supportsLast, utc) {
    var date = utc ? convertToUTC(data.date) : data.date,
        dateString = utc ? date.toUTCString() : date;

    it('should return first date before ' + dateString + ' with val ' + amt, function() {
      later.option.UTC = utc;

      var prev = constraint.prev(date, amt),
          ex = supportsLast ? amt || constraint.extent(prev)[1] : amt,
          outOfBounds = ex > constraint.extent(prev)[1];

      // if amt is outside of extent, the constraint should rollover to the
      // first value of the following time period
      if (outOfBounds) ex = constraint.extent(prev)[1];

      // result should match ex, should be greater than date, and should
      // be at the start of the time period
      // if check is hack to support year constraints which can return undefined
      if(amt < later.option.minYear || amt === '00:00:00' || (amt < constraint.val(date) && amt >= later.option.minYear)) {
        constraint.val(prev).should.eql(ex);
        prev.getTime().should.be.below(date.getTime());
        constraint.end(prev).getTime().should.eql(prev.getTime());
      }
      else {
        should.not.exist(prev);
      }
    });
  }

  return {

    run: function (data, isYear) {
      var i = 0, len = data.length;

      // test both UTC and local times for all functions
      [true, false].forEach(function (utc) {

        // simple tests have the expected value passed in as data
        ['val', 'extent', 'start', 'end'].forEach(function (fn) {
          describe(fn, function() {
            for(i = 0; i < len; i++) {
              runBasicTest(fn, data[i], utc);
            }
          });
        });

        // complex tests do a sweep across all values and validate results
        // using checks verified by the simple tests
        ['next', 'prev'].forEach(function (fn) {
          describe(fn, function() {
            for(i = 0; i < len; i++) {
              runComplexTest(fn, data[i], utc);
            }
          });
        });

      });

    }

  };

};