var later = require('../../index'),
    runner = require('../runner')(later, later.year),
    should = require('should');

describe('Later.year', function() {

  var tests = [
    {
      date: new Date(2009, 2, 1),
      val: 2009,
      extent: [2000,2050],
      start: new Date(2009, 0, 1),
      end: new Date(2009, 11, 31)
    }
  ];

  runner.run(tests, true);

});