later.date = {};


later.date.nextRollover = function(d, val, constraint, period) {
  return (val && val <= constraint.val(d)) ||
         (val > constraint.extent(d)[1]) ||
         (!val && constraint.val(d) === constraint.extent(d)[1]) ?
            period.next(d, period.val(d)+1) :
            period.start(d);
};



later.date.prevRollover = function(d, val, constraint, period) {
  return (val >= constraint.val(d)) || !val ?
            period.start(period.prev(d, period.val(d)-1)) :
            period.start(d);
};

