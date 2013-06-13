var later = require('../../index'),
    should = require('should');

describe('Recur Examples', function() {

  it('Every 5 minutes', function() {
    later.date.UTC();

    var sched = later.parse.recur().every(5).minute();

    var start = new Date('2013-03-21T03:05:23Z'),
        end = new Date('2013-03-21T03:40:10Z'),
        expected = [
          new Date('2013-03-21T03:10:00'),
          new Date('2013-03-21T03:15:00'),
          new Date('2013-03-21T03:20:00'),
          new Date('2013-03-21T03:25:00'),
          new Date('2013-03-21T03:30:00'),
          new Date('2013-03-21T03:35:00'),
          new Date('2013-03-21T03:40:00')
        ];

    var next = later.schedule(sched).next(7, start, end);
    next.should.eql(expected);

    var prev = later.schedule(sched).prev(7, end, start);
    prev.should.eql(expected.reverse());
  });


  it('Every weekday between 8:30AM and 5:30PM', function() {
    later.date.UTC();

    var sched = later.parse.recur().after('8:30').time().before('17:30').time().onWeekday();

    var start = new Date('2013-01-01T00:00:00Z'),
        end = new Date('2013-01-10T00:00:00Z'),
        expected = [
          [new Date('2013-01-01T08:30:00Z'), new Date('2013-01-01T17:30:00Z')],
          [new Date('2013-01-02T08:30:00Z'), new Date('2013-01-02T17:30:00Z')],
          [new Date('2013-01-03T08:30:00Z'), new Date('2013-01-03T17:30:00Z')],
          [new Date('2013-01-04T08:30:00Z'), new Date('2013-01-04T17:30:00Z')],
          [new Date('2013-01-07T08:30:00Z'), new Date('2013-01-07T17:30:00Z')],
          [new Date('2013-01-08T08:30:00Z'), new Date('2013-01-08T17:30:00Z')],
          [new Date('2013-01-09T08:30:00Z'), new Date('2013-01-09T17:30:00Z')]
        ];

    var next = later.schedule(sched).nextRange(7, start, end);
    next.should.eql(expected);

    var prev = later.schedule(sched).prevRange(7, end, start);
    prev.should.eql(expected.reverse());
  });

  it('Every weekend between 8AM and 5PM', function() {
    later.date.UTC();

    var sched = later.parse.recur().after(8).hour().before(17).hour().onWeekend();

    var start = new Date('2013-02-01T00:00:00Z'),
        end = new Date('2013-02-24T00:00:00Z'),
        expected = [
          [new Date('2013-02-02T08:00:00Z'), new Date('2013-02-02T17:00:00Z')],
          [new Date('2013-02-03T08:00:00Z'), new Date('2013-02-03T17:00:00Z')],
          [new Date('2013-02-09T08:00:00Z'), new Date('2013-02-09T17:00:00Z')],
          [new Date('2013-02-10T08:00:00Z'), new Date('2013-02-10T17:00:00Z')],
          [new Date('2013-02-16T08:00:00Z'), new Date('2013-02-16T17:00:00Z')],
          [new Date('2013-02-17T08:00:00Z'), new Date('2013-02-17T17:00:00Z')],
          [new Date('2013-02-23T08:00:00Z'), new Date('2013-02-23T17:00:00Z')]
        ];

    var next = later.schedule(sched).nextRange(7, start, end);
    next.should.eql(expected);

    var prev = later.schedule(sched).prevRange(7, end, start);
    prev.should.eql(expected.reverse());
  });

  it('Every second Tuesday at 4AM and 10PM', function() {
    later.date.UTC();

    var sched = later.parse.recur().on(2).dayOfWeekCount().on(3).dayOfWeek().on('4:00', '22:00').time();

    var start = new Date('2013-02-01T00:00:00Z'),
        end = new Date('2013-05-01T00:00:00Z'),
        expected = [
          new Date('2013-02-12T04:00:00Z'),
          new Date('2013-02-12T22:00:00Z'),
          new Date('2013-03-12T04:00:00Z'),
          new Date('2013-03-12T22:00:00Z'),
          new Date('2013-04-09T04:00:00Z'),
          new Date('2013-04-09T22:00:00Z')
        ];

    var next = later.schedule(sched).next(6, start, end);
    next.should.eql(expected);

    var prev = later.schedule(sched).prev(6, end, start);
    prev.should.eql(expected.reverse());
  });

  it.only('Last day of every month', function() {
    later.date.UTC();

    var sched = later.parse.recur().last().dayOfMonth();

    var start = new Date('2012-01-01T00:00:00Z'),
        end = new Date('2013-01-01T00:00:00Z'),
        expected = [
          new Date('2012-01-31T00:00:00Z'),
          new Date('2012-02-29T00:00:00Z'),
          new Date('2012-03-31T00:00:00Z'),
          new Date('2012-04-30T00:00:00Z'),
          new Date('2012-05-31T00:00:00Z'),
          new Date('2012-06-30T00:00:00Z'),
          new Date('2012-07-31T00:00:00Z'),
          new Date('2012-08-31T00:00:00Z'),
          new Date('2012-09-30T00:00:00Z'),
          new Date('2012-10-31T00:00:00Z'),
          new Date('2012-11-30T00:00:00Z'),
          new Date('2012-12-31T00:00:00Z')
        ];

    var next = later.schedule(sched).next(12, start, end);
    next.should.eql(expected);

    var prev = later.schedule(sched).prev(3, end, start);
    console.log(prev);
    prev.should.eql(expected.reverse());

  });

  it('All 31st numbered days of the year', function() {
    later.date.UTC();

    var sched = later.parse.recur().on(31).dayOfMonth();

    var start = new Date('2013-01-01T00:00:00Z'),
        end = new Date('2014-01-01T00:00:00Z'),
        expected = [
          new Date('2013-01-31T00:00:00Z'),
          new Date('2013-03-31T00:00:00Z'),
          new Date('2013-05-31T00:00:00Z'),
          new Date('2013-07-31T00:00:00Z'),
          new Date('2013-08-31T00:00:00Z'),
          new Date('2013-10-31T00:00:00Z'),
          new Date('2013-12-31T00:00:00Z')
        ];

    var next = later.schedule(sched).next(7, start, end);
    next.should.eql(expected);

    var prev = later.schedule(sched).prev(7, end, start);
    prev.should.eql(expected.reverse());

  });

  it('Friday the 13th', function() {
    later.date.UTC();

    var sched = later.parse.recur().on(13).dayOfMonth().on(6).dayOfWeek();

    var start = new Date('2010-01-01T00:00:00Z'),
        end = new Date('2014-01-01T00:00:00Z'),
        expected = [
          new Date('2010-08-13T00:00:00Z'),
          new Date('2011-05-13T00:00:00Z'),
          new Date('2012-01-13T00:00:00Z'),
          new Date('2012-04-13T00:00:00Z'),
          new Date('2012-07-13T00:00:00Z'),
          new Date('2013-09-13T00:00:00Z'),
          new Date('2013-12-13T00:00:00Z')
        ];

    var next = later.schedule(sched).next(7, start, end);
    next.should.eql(expected);

    var prev = later.schedule(sched).prev(7, end, start);
    prev.should.eql(expected.reverse());

  });

  it('Every hour passing over DST', function() {
    later.date.localTime();

    var sched = later.parse.recur().every(1).hour();

    var start = new Date(2013, 2, 10),
        end = new Date(2013, 2, 10, 5),
        expected = [
          new Date(2013, 2, 10, 0),
          new Date(2013, 2, 10, 1),
          new Date(2013, 2, 10, 3),
          new Date(2013, 2, 10, 4),
          new Date(2013, 2, 10, 5)
        ];

    var next = later.schedule(sched).next(5, start, end);
    next.should.eql(expected);

    var prev = later.schedule(sched).prev(5, end, start);
    prev.should.eql(expected.reverse());

  });





});