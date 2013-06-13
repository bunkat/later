var Benchmark = require('benchmark'),
    later = require('../../index'),
    suite = new Benchmark.Suite('next');

var schedSimple = later.parse.cron().parse('* */5 * * * *'),
    compiledSimple = later.instancesOf(schedSimple);

var schedComplex = later.parse.cron().parse('0 5 15W * ?'),
    compiledComplex = later.instancesOf(schedComplex);

suite
.add('simple next', function() {
  compiledSimple.next();
})
.add('complex next', function() {
  compiledComplex.next();
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({async: true});