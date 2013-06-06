var later = require('../../index'),
    should = require('should');

describe('Option', function() {

  it('UTC should be true by default', function() {
    later.option.UTC.should.eql(true);
  });

  it('resolution should be 1 by default', function() {
    later.option.resolution.should.eql(1);
  });
});