var later = require('../../index'),
    schedule = later.schedule,
    should = require('should');

describe('Schedule', function() {
  later.date.UTC();

  describe('isValid', function() {
    var d = new Date('2013-03-21T00:00:05Z');

    it('should return true if date is valid', function() {
      var s = {schedules: [{Y:[2013], M:[3], D:[21], s:[5]}]};
      schedule(s).isValid(d).should.eql(true);
    });

    it('should return false if date is invalid', function() {
      var s = {schedules: [{Y:[2012]}]};
      schedule(s).isValid(d).should.eql(false);
    });

  });

  describe('next', function() {
    var d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2016-01-01T00:00:05Z');

    it('should return the start date if it is valid', function() {
      var s = {schedules: [{Y:[2013], M:[3], D:[21], s:[5]}]};
      schedule(s).next(1, d).should.eql(d);
    });

    it('should return next valid date if one exists', function() {
      var s = {schedules: [{Y:[2015]}]};
      schedule(s).next(1, d).should.eql(new Date('2015-01-01T00:00:00Z'));
    });

    it('should return next valid date if one exists with composite', function() {
      var s = {schedules: [{Y:[2017]},{Y:[2015]}]};
      schedule(s).next(1, d).should.eql(new Date('2015-01-01T00:00:00Z'));
    });

    it('should return next valid date if one exists with exceptions', function() {
      var s = {schedules: [{Y:[2015,2016,2017]}], exceptions: [{Y:[2015]}]};
      schedule(s).next(1, d).should.eql(new Date('2016-01-01T00:00:00Z'));
    });

    it('should return count valid dates if they exist', function() {
      var s = {schedules: [{Y:[2015,2016,2017]}]};
      schedule(s).next(3, d).should.eql([
        new Date('2015-01-01T00:00:00Z'),
        new Date('2016-01-01T00:00:00Z'),
        new Date('2017-01-01T00:00:00Z')
        ]);
    });

    it('should return undefined if no next valid date exists', function() {
      var s = {schedules: [{Y:[2012]}]};
      should.equal(schedule(s).next(1, d), undefined);
    });

    it('should return undefined if end date precludes a valid schedule', function() {
      var s = {schedules: [{Y:[2017]}]};
      should.equal(schedule(s).next(1, d, e), undefined);
    });

  });

  describe('prev', function() {
    var d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2010-01-01T00:00:05Z');

    it('should return the start date if it is valid', function() {
      var s = {schedules: [{Y:[2013], M:[3], D:[21], s:[5]}]};
      schedule(s).prev(1,d).should.eql(d);
    });

    it('should return prev valid date if one exists', function() {
      var s = {schedules: [{Y:[2012]}]};
      schedule(s).prev(1,d).should.eql(new Date('2012-01-01T00:00:00Z'));
    });

    it('should return prev valid date if one exists with exceptions', function() {
      var s = {schedules: [{Y:[2012,2013,2014]}], exceptions: [{Y:[2013]}]};
      schedule(s).prev(1,d).should.eql(new Date('2012-01-01T00:00:00Z'));
    });

    it('should return count valid dates if they exist', function() {
      var s = {schedules: [{Y:[2010, 2011,2012]}]};
      schedule(s).prev(3,d).should.eql([
        new Date('2012-01-01T00:00:00Z'),
        new Date('2011-01-01T00:00:00Z'),
        new Date('2010-01-01T00:00:00Z')
        ]);
    });

    it('should return undefined if no prev valid date exists', function() {
      var s = {schedules: [{Y:[2017]}]};
      should.equal(schedule(s).prev(1,d), undefined);
    });

    it('should return undefined if end date precludes a valid schedule', function() {
      var s = {schedules: [{Y:[2009]}]};
      should.equal(schedule(s).prev(1,d, e), undefined);
    });

  });

  describe('nextRange', function() {
    var d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2016-01-01T00:00:05Z');

    it('should return next valid range if one exists', function() {
      var s = {schedules: [{Y:[2015,2016,2017]}]};
      schedule(s).nextRange(1, d).should.eql([
        new Date('2015-01-01T00:00:00Z'),
        new Date('2018-01-01T00:00:00Z')
      ]);
    });

  });

  describe('prevRange', function() {
    var d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2016-01-01T00:00:05Z');

    it('should return next valid range if one exists', function() {
      var s = {schedules: [{Y:[2011,2012]}]};
      schedule(s).prevRange(1, d).should.eql([
        new Date('2011-01-01T00:00:00Z'),
        new Date('2013-01-01T00:00:00Z')
      ]);
    });

  });

});