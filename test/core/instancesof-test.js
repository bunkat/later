var later = require('../../index'),
    should = require('should');

describe('Instances of', function() {

  describe('next', function() {

    it.skip('should do stuff', function() {

      var sched = {
            schedules: [
              {
                m: [5, 10, 15, 20, 25, 30],
                s: [30]
              },
              {
                m: [3, 6, 15, 20, 25, 30]
              }
            ],
            exceptions: [
              {
                m: [15, 20, 30]
              },
              {
                D: [10, 11, 12]
              }
            ]
          };

      console.log(later.instancesOf(sched).next(10, new Date(), new Date('2013-06-13T00:25:00Z')));

      var time = process.hrtime();
      later.instancesOf(sched).next(10000);
      var diff = process.hrtime(time);
      console.log('benchmark took %d milliseconds', (diff[0] * 1e9 + diff[1])/1e6);

    });

    it('should do range stuff', function() {

      var sched = {
            schedules: [
              {
                h: [2,3,4,5,6,7]
              }
            ],
            exceptions: [
              {
                m: [0,1,2,3,4,5,6,7,8,9,10]
              }
            ]
          };

      later.date.localTime();
      console.log(later.instancesOf(sched).nextRange(10, new Date()));

      var time = process.hrtime();
      later.instancesOf(sched).nextRange(100000, new Date());
      var diff = process.hrtime(time);
      console.log('benchmark took %d milliseconds', (diff[0] * 1e9 + diff[1])/1e6);

    });

  });

});