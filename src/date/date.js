later.date = {};

later.date.UTC = function() {

  later.date.build = function(Y, M, D, h, m, s) {
    return new Date(Date.UTC(Y, M, D, h, m, s));
  };

  later.date.isUTC = true;
  later.date.getYear = Date.prototype.getUTCFullYear;
  later.date.getMonth = Date.prototype.getUTCMonth;
  later.date.getDate = Date.prototype.getUTCDate;
  later.date.getDay = Date.prototype.getUTCDay;
  later.date.getHour = Date.prototype.getUTCHours;
  later.date.getMin = Date.prototype.getUTCMinutes;
  later.date.getSec = Date.prototype.getUTCSeconds;
};

later.date.localTime = function() {

  later.date.build = function(Y, M, D, h, m, s) {
    return new Date(Y, M, D, h, m, s);
  };

  later.date.isUTC = false;
  later.date.getYear = Date.prototype.getFullYear;
  later.date.getMonth = Date.prototype.getMonth;
  later.date.getDate = Date.prototype.getDate;
  later.date.getDay = Date.prototype.getDay;
  later.date.getHour = Date.prototype.getHours;
  later.date.getMin = Date.prototype.getMinutes;
  later.date.getSec = Date.prototype.getSeconds;
};

// utc by default
later.date.UTC();

later.date.nextRollover = function(d, val, constraint, period) {
  return val <= constraint.val(d) || val > constraint.extent(d)[1] ?
            period.next(d, period.val(d)+1) :
            period.start(d);


/*  return (val && val <= constraint.val(d)) ||
         (val > constraint.extent(d)[1]) ||
         (!val && constraint.val(d) === constraint.extent(d)[1]) ?
            period.next(d, period.val(d)+1) :
            period.start(d);*/
};



later.date.prevRollover = function(d, val, constraint, period) {
  return val >= constraint.val(d) ?
            period.start(period.prev(d, period.val(d)-1)) :
            period.start(d);

/*  return (val >= constraint.val(d)) || !val ?
            period.start(period.prev(d, period.val(d)-1)) :
            period.start(d);*/
};



later.date.daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];