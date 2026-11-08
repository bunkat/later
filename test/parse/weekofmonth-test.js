var later = require('../../index'),
    recur = later.parse.recur,
    should = require('should');

describe('Week of month recurrence', function() {

  it('should include all six possible weeks', function() {
    recur().every(1).weekOfMonth().schedules[0].wm.should.eql([1, 2, 3, 4, 5, 6]);
  });

  it('should include the sixth week when offsetting an interval', function() {
    recur().every(2).weekOfMonth().startingOn(2).schedules[0].wm.should.eql([2, 4, 6]);
  });

  it('should preserve the last week sentinel', function() {
    recur().last().weekOfMonth().schedules[0].wm.should.eql([0]);
  });

  it('should include all six weeks in text schedules', function() {
    var parsed = later.parse.text('every 1 week of the month');
    parsed.error.should.eql(-1);
    parsed.schedules[0].wm.should.eql([1, 2, 3, 4, 5, 6]);
  });

  [true, false].forEach(function(utc) {
    describe(utc ? 'UTC' : 'local time', function() {
      var wasUTC;

      beforeEach(function() {
        wasUTC = later.date.isUTC;
        later.date.timezone(!utc);
      });

      afterEach(function() {
        later.date.timezone(!wasUTC);
      });

      function date(year, month, day) {
        return utc ? new Date(Date.UTC(year, month - 1, day)) :
          new Date(year, month - 1, day);
      }

      it('should find every Sunday in a six-week month', function() {
        var sched = later.schedule(recur().every(1).weekOfMonth().on(1).dayOfWeek());
        sched.next(5, date(2016, 7, 1)).should.eql([
          date(2016, 7, 3), date(2016, 7, 10), date(2016, 7, 17),
          date(2016, 7, 24), date(2016, 7, 31)
        ]);
      });

      it('should find the sixth week when searching backwards', function() {
        var sched = later.schedule(recur().every(1).weekOfMonth().on(1).dayOfWeek());
        sched.prev(3, date(2016, 8, 1)).should.eql([
          date(2016, 7, 31), date(2016, 7, 24), date(2016, 7, 17)
        ]);
      });

      it('should cross a year boundary without skipping the sixth week', function() {
        var sched = later.schedule(recur().every(1).weekOfMonth().on(1).dayOfWeek());
        sched.next(3, date(2017, 12, 24)).should.eql([
          date(2017, 12, 24), date(2017, 12, 31), date(2018, 1, 7)
        ]);
      });

      it('should cross months with fewer than six weeks', function() {
        var sched = later.schedule(recur().every(1).weekOfMonth().on(1).dayOfWeek());
        sched.next(6, date(2015, 2, 1)).should.eql([
          date(2015, 2, 1), date(2015, 2, 8), date(2015, 2, 15),
          date(2015, 2, 22), date(2015, 3, 1), date(2015, 3, 8)
        ]);
      });

      it('should find Mondays in the sixth week', function() {
        var sched = later.schedule(recur().every(1).weekOfMonth().on(2).dayOfWeek());
        sched.next(2, date(2020, 8, 30)).should.eql([
          date(2020, 8, 31), date(2020, 9, 7)
        ]);
      });

      it('should include the sixth week in offset interval ranges', function() {
        var sched = later.schedule(recur().every(2).weekOfMonth().startingOn(2));
        sched.nextRange(1, date(2016, 7, 30)).should.eql([
          date(2016, 7, 31), date(2016, 8, 1)
        ]);
      });
    });
  });
});
