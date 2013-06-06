var later = require('../../index'),
    schedule = later.schedule,
    should = require('should');

describe('Schedule', function() {
  later.option.UTC = true;

  describe('isValid', function() {
    var d = new Date('2013-03-21T00:00:05Z');

    it('should return true if date is valid', function() {
      var s = {schedules: [{Y:[2013]}]};
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

    it('should return the start date if there are no constraints', function() {
      schedule().next(d).should.eql(d);
    });

    it('should return the start date if it is valid', function() {
      var s = {schedules: [{Y:[2013]}]};
      schedule(s).next(d).should.eql(d);
    });

    it('should return next valid date if one exists', function() {
      var s = {schedules: [{Y:[2015]}]};
      schedule(s).next(d).should.eql(new Date('2015-01-01T00:00:00Z'));
    });

    it('should return next valid date if one exists with composite', function() {
      var s = {schedules: [{Y:[2017]},{Y:[2015]}]};
      schedule(s).next(d).should.eql(new Date('2015-01-01T00:00:00Z'));
    });

    it('should return next valid date if one exists with exceptions', function() {
      var s = {schedules: [{Y:[2015,2016,2017]}], exceptions: [{Y:[2015]}]};
      schedule(s).next(d).should.eql(new Date('2016-01-01T00:00:00Z'));
    });

    it('should return count valid dates if they exist', function() {
      var s = {schedules: [{Y:[2015]}]};
      schedule(s).next(d, null, 3).should.eql([
        new Date('2015-01-01T00:00:00Z'),
        new Date('2015-01-01T00:00:01Z'),
        new Date('2015-01-01T00:00:02Z')
        ]);
    });

    it('should return undefined if no next valid date exists', function() {
      var s = {schedules: [{Y:[2012]}]};
      should.equal(schedule(s).next(d), undefined);
    });

    it('should return undefined if end date precludes a valid schedule', function() {
      var s = {schedules: [{Y:[2017]}]};
      should.equal(schedule(s).next(d, e), undefined);
    });

  });

  describe('prev', function() {
    var d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2010-01-01T00:00:05Z');

    it('should return the start date if it is valid', function() {
      var s = {schedules: [{Y:[2013]}]};
      schedule(s).prev(d).should.eql(d);
    });

    it('should return prev valid date if one exists', function() {
      var s = {schedules: [{Y:[2012]}]};
      schedule(s).prev(d).should.eql(new Date('2012-12-31T23:59:59Z'));
    });

    it('should return prev valid date if one exists with exceptions', function() {
      var s = {schedules: [{Y:[2012,2013,2014]}], exceptions: [{Y:[2013]}]};
      schedule(s).prev(d).should.eql(new Date('2012-12-31T23:59:59Z'));
    });

    it('should return count valid dates if they exist', function() {
      var s = {schedules: [{Y:[2012]}]};
      schedule(s).prev(d, null, 3).should.eql([
        new Date('2012-12-31T23:59:59Z'),
        new Date('2012-12-31T23:59:58Z'),
        new Date('2012-12-31T23:59:57Z')
        ]);
    });

    it('should return undefined if no prev valid date exists', function() {
      var s = {schedules: [{Y:[2017]}]};
      should.equal(schedule(s).prev(d), undefined);
    });

    it('should return undefined if end date precludes a valid schedule', function() {
      var s = {schedules: [{Y:[2009]}]};
      should.equal(schedule(s).prev(d, e), undefined);
    });

  });

  describe('nextRange', function() {
    var d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2016-01-01T00:00:05Z');

    it('should return next valid range if one exists', function() {
      var s = {schedules: [{Y:[2015,2016,2017]}]};
      schedule(s).nextRange(d).should.eql([
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
      schedule(s).prevRange(d).should.eql([
        new Date('2012-12-31T23:59:59Z'),
        new Date('2010-12-31T23:59:59Z')
      ]);
    });

  });

});