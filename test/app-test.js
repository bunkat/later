var app = require('../app');
var should = require('should');

describe('Default app', function() {

  it('should include all entry points', function() {
    console.log(app);

    should.exist(app.later);
    should.exist(app.enParser);
    should.exist(app.cronParser);
    should.exist(app.recur);
  });

});