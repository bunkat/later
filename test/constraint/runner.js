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
      if(utc) later.date.UTC(); else later.date.localTime();
      constraint[fn](date).should.eql(ex);
    });
  }

  function runComplexTest(fn, data, utc) {
    var min = data.extent[0],
        max = data.extent[1],
        inc = Math.ceil((max-min)/200); // max 200 tests per constraint

    for(var i = min; i <= max; i = i + inc) { // test for overbounds
      if(fn === 'next') {
        testNext(data, i, utc); // test all values for amt
      }
      else {
        testPrev(data, i, utc); // test all values for amt
      }
    }
  }

  function testNext(data, amt, utc) {
    var date = utc ? convertToUTC(data.date) : data.date,
        dateString = utc ? date.toUTCString() : date;

    it('should return first date after ' + dateString + ' with val ' + amt, function() {
      if(utc) later.date.UTC(); else later.date.localTime();

      var next = constraint.next(date, amt),
          ex = amt,
          outOfBounds = ex > constraint.extent(next)[1];

      // if amt is outside of extent, the constraint should rollover to the
      // first value of the following time period
      if (outOfBounds) ex = constraint.extent(next)[0];

      // hack to pass hour test that crosses DST
      if (ex === 2 && constraint.val(next) === 3 && next.getTimezoneOffset() !== date.getTimezoneOffset()) {
        ex = 3;
      }

      // result should match ex, should be greater than date, and should
      // be at the start of the time period
      // if check is hack to support year constraints which can return undefined
      if(constraint.name === 'year' && (amt <= constraint.val(date) || amt > later.option.maxYear)) {
        should.not.exist(next);
      }
      else {
        constraint.val(next).should.eql(ex);
        next.getTime().should.be.above(date.getTime());
        constraint.start(next).getTime().should.eql(next.getTime());
      }

    });
  }

  function testPrev(data, amt, utc) {
    var date = utc ? convertToUTC(data.date) : data.date,
        dateString = utc ? date.toUTCString() : date;

    it('should return first date before ' + dateString + ' with val ' + amt, function() {
      if(utc) later.date.UTC(); else later.date.localTime();

      var prev = constraint.prev(date, amt),
          ex = amt,
          outOfBounds = ex > constraint.extent(prev)[1];

      // if amt is outside of extent, the constraint should rollover to the
      // first value of the following time period
      if (outOfBounds) ex = constraint.extent(prev)[1];

      // result should match ex, should be greater than date, and should
      // be at the start of the time period
      // if check is hack to support year constraints which can return undefined
      if(constraint.name === 'year' && (amt >= constraint.val(date) || amt < later.option.minYear)) {
        should.not.exist(prev);
      }
      else {
        constraint.val(prev).should.eql(ex);
        prev.getTime().should.be.below(date.getTime());
        constraint.end(prev).getTime().should.eql(prev.getTime());
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