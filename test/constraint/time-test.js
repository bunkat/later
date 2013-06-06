var later = require('../../index'),
    runner = require('./runner')(later, later.time),
    should = require('should');

describe('Later.time', function() {

  var tests = [
    {
      // first second of year
      date: new Date(2008, 0, 1),
      val: '00:00:00',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2008, 0, 1),
      end: new Date(2008, 0, 1)
    },
    {
      // last second of year
      date: new Date(2009, 11, 31, 23, 59, 59),
      val: '23:59:59',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2009, 11, 31, 23, 59, 59),
      end: new Date(2009, 11, 31, 23, 59, 59)
    },
    {
      // first second of month starting on Sunday
      date: new Date(2010, 7, 1),
      val: '00:00:00',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2010, 7, 1),
      end: new Date(2010, 7, 1)
    },
    {
      // last second of month ending on Saturday
      date: new Date(2011, 3, 30, 23, 59, 59),
      val: '23:59:59',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2011, 3, 30, 23, 59, 59),
      end: new Date(2011, 3, 30, 23, 59, 59)
    },
    {
      // first second of day
      date: new Date(2012, 1, 28),
      val: '00:00:00',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2012, 1, 28),
      end: new Date(2012, 1, 28)
    },
    {
      // last second of day on leap day
      date: new Date(2012, 1, 29, 23, 59, 59),
      val: '23:59:59',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2012, 1, 29, 23, 59, 59),
      end: new Date(2012, 1, 29, 23, 59, 59)
    },
    {
      // first second of hour
      date: new Date(2012, 10, 8, 14),
      val: '14:00:00',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2012, 10, 8, 14),
      end: new Date(2012, 10, 8, 14)
    },
    {
      // last second of hour (start DST)
      date: new Date(2013, 2, 10, 1, 59, 59),
      val: '01:59:59',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2013, 2, 10, 1, 59, 59),
      end: new Date(2013, 2, 10, 1, 59, 59)
    },
    {
      // first second of hour (end DST)
      date: new Date(2013, 10, 3, 2),
      val: '02:00:00',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2013, 10, 3, 2),
      end: new Date(2013, 10, 3, 2)
    },
    {
      // last second of hour
      date: new Date(2014, 1, 22, 6, 59, 59),
      val: '06:59:59',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2014, 1, 22, 6, 59, 59),
      end: new Date(2014, 1, 22, 6, 59, 59)
    },
    {
      // first second of minute
      date: new Date(2015, 5, 19, 18, 22),
      val: '18:22:00',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2015, 5, 19, 18, 22),
      end: new Date(2015, 5, 19, 18, 22)
    },
    {
      // last second of minute
      date: new Date(2016, 7, 29, 2, 56, 59),
      val: '02:56:59',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2016, 7, 29, 2, 56, 59),
      end: new Date(2016, 7, 29, 2, 56, 59)
    },
    {
      // second
      date: new Date(2017, 8, 4, 10, 31, 22),
      val: '10:31:22',
      extent: ['00:00:00', '23:59:59'],
      start: new Date(2017, 8, 4, 10, 31, 22),
      end: new Date(2017, 8, 4, 10, 31, 22)
    }
  ];

  runner.run(tests);

});