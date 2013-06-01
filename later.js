later = function() {
  var later = {
    version: "0.1.0"
  };
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (;k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }
  later.constraint = {
    priority: [ "Y" ]
  };
  later.constraint.h = function(values) {
    var inc, Y, M, D, h, range, date;
    function init(d, cache, reverse) {
      var UTC = later.option.UTC;
      Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()), M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()), 
      D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate()), h = cache.h || (cache.h = UTC ? d.getUTCHours() : d.getHours()), 
      range = reverse ? later.range.prev : later.range.next;
      date = reverse ? later.date.prev : later.date.next;
    }
    return {
      value: function(curDate) {
        init(curDate, {});
        return h;
      },
      isInvalid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = range(h, values, 24)) !== h) {
          return date(Y, M, D, inc);
        }
        return false;
      },
      isValid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = later.range.invalid(h, values, 0, 23, 24, false, reverse)) !== false) {
          return inc === undefined ? undefined : date(Y, M, D, inc);
        }
        return false;
      }
    };
  };
  later.constraint.m = function(values) {
    var inc, Y, M, D, h, m, range, date;
    function init(d, cache, reverse) {
      var UTC = later.option.UTC;
      Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()), M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()), 
      D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate()), h = cache.h || (cache.h = UTC ? d.getUTCHours() : d.getHours()), 
      m = cache.m || (cache.m = UTC ? d.getUTCMinutes() : d.getMinutes()), range = reverse ? later.range.prev : later.range.next;
      date = reverse ? later.date.prev : later.date.next;
    }
    return {
      value: function(curDate) {
        init(curDate, {});
        return m;
      },
      isInvalid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = range(m, values, 60)) !== m) {
          return date(Y, M, D, h, inc);
        }
        return false;
      },
      isValid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = later.range.invalid(m, values, 0, 59, 60, false, reverse)) !== false) {
          return inc === undefined ? undefined : date(Y, M, D, h, inc);
        }
        return false;
      }
    };
  };
  later.constraint.M = function(values) {
    var inc, Y, M, range, date;
    function init(d, cache, reverse) {
      var UTC = later.option.UTC;
      Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()), M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()), 
      range = reverse ? later.range.prev : later.range.next;
      date = reverse ? later.date.prev : later.date.next;
    }
    return {
      value: function(curDate) {
        init(curDate, {});
        return M;
      },
      isInvalid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = range(M + 1, values, 12)) !== M + 1) {
          return date(Y, inc - 1);
        }
        return false;
      },
      isValid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = later.range.invalid(M + 1, values, 1, 12, 12, true, reverse)) !== false) {
          return inc === undefined ? undefined : date(Y, inc - 1);
        }
        return false;
      }
    };
  };
  later.constraint.s = function(values, reverse, cache) {
    var lr = later.range, lds = later.date.second, range = reverse ? lr.prev : lr.next, rangeInvalid = reverse ? lr.prevInvalid : lr.nextInvalid, next = reverse ? lds.prev : lds.next, inc, s;
    return {
      isInvalid: function(cur) {
        s = lsd.value(cur, cache);
        if ((inc = range(s, values, lds.offset)) !== s) {
          return next(cur, inc, cache);
        }
        return false;
      },
      isValid: function(cur) {
        s = lsd.value(cur, cache);
        if ((inc = rangeInvalid(s, values, lds.extent, lds.offset)) !== false) {
          return !inc ? undefined : next(cur, inc, cache);
        }
        return false;
      }
    };
  };
  later.constraint.t = function(values) {
    var inc, Y, M, D, h, m, s, t, range, date;
    function init(d, cache, reverse) {
      var UTC = later.option.UTC;
      Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()), M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()), 
      D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate()), h = cache.h || (cache.h = UTC ? d.getUTCHours() : d.getHours()), 
      m = cache.m || (cache.m = UTC ? d.getUTCMinutes() : d.getMinutes()), s = cache.s || (cache.s = UTC ? d.getUTCSeconds() : d.getSeconds()), 
      t = cache.t || (cache.t = later.date.time(h, m, s)), range = reverse ? later.range.prev : later.range.next;
      date = reverse ? later.date.prev : later.date.next;
    }
    return {
      value: function(curDate) {
        init(curDate, {});
        return t;
      },
      isInvalid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = range(t, values)) !== t) {
          var x = inc.split(":"), dayInc = !reverse ? t > inc ? 1 : 0 : t < inc ? -1 : 0;
          return date(Y, M, D + dayInc, x[0], x[1], x[2]);
        }
        return false;
      },
      isValid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        var o = t;
        if (values.indexOf(t) > -1) {
          do {
            s = reverse ? s - 1 : s + 1;
            if (s === -1) {
              s = 59;
              m = m - 1;
            } else if (s === 60) {
              s = 0;
              m = m + 1;
            }
            if (m === -1) {
              m = 59;
              h = h - 1;
            } else if (m === 60) {
              m = 0;
              h = h + 1;
            }
            if (h === -1) {
              h = 23;
            } else if (h === 24) {
              h = 0;
            }
            t = later.date.time(h, m, s);
          } while (o !== t && values.indexOf(t) > -1);
          return t === o ? undefined : reverse ? date(Y, M, D - (t > o ? 1 : 0), h, m, s) : date(Y, M, D + (t < o ? 1 : 0), h, m, s);
        }
        return false;
      }
    };
  };
  later.constraint.ta = function(values) {
    var value = values[0], x = value.split(":"), Y, M, D, h, m, s, t, range, date;
    function init(d, cache, reverse) {
      var UTC = later.options.UTC;
      Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()), M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()), 
      D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate()), h = cache.h || (cache.h = UTC ? d.getUTCHours() : d.getHours()), 
      m = cache.m || (cache.m = UTC ? d.getUTCMinutes() : d.getMinutes()), s = cache.s || (cache.s = UTC ? d.getUTCSeconds() : d.getSeconds()), 
      t = cache.t || (cache.t = later.date.time(h, m, s)), range = reverse ? later.range.prev : later.range.next;
      date = reverse ? later.date.prev : later.date.next;
    }
    return {
      value: function(curDate) {
        init(curDate, {});
        return t;
      },
      isInvalid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if (t < value) {
          return reverse ? date(Y, M, D - 1) : date(Y, M, D, x[0], x[1], x[2]);
        }
        return false;
      },
      isValid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if (t >= value) {
          return reverse ? date(Y, M, D, x[0], x[1], x[2] - 1) : date(Y, M, D + 1);
        }
        return false;
      }
    };
  };
  later.constraint.tb = function(values) {
    var value = values[0], x = value.split(":"), Y, M, D, h, m, s, t, range, date;
    function init(d, cache, reverse) {
      var UTC = later.options.UTC;
      Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear()), M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth()), 
      D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate()), h = cache.h || (cache.h = UTC ? d.getUTCHours() : d.getHours()), 
      m = cache.m || (cache.m = UTC ? d.getUTCMinutes() : d.getMinutes()), s = cache.s || (cache.s = UTC ? d.getUTCSeconds() : d.getSeconds()), 
      t = cache.t || (cache.t = later.date.time(h, m, s)), range = reverse ? later.range.prev : later.range.next;
      date = reverse ? later.date.prev : later.date.next;
    }
    return {
      value: function(curDate) {
        init(curDate, {});
        return t;
      },
      isInvalid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if (t >= value) {
          return reverse ? date(Y, M, D, x[0], x[1], x[2] - 1) : date(Y, M, D + 1);
        }
        return false;
      },
      isValid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if (t < value) {
          return reverse ? date(Y, M, D - 1, x[0], x[1], x[2] - 1) : date(Y, M, D, x[0], x[1], x[2]);
        }
        return false;
      }
    };
  };
  later.constraint.dw = function(values) {
    var inc, Y, M, D, d, range, date;
    function init(val, cache, reverse) {
      var UTC = later.option.UTC;
      Y = cache.Y || (cache.Y = UTC ? val.getUTCFullYear() : val.getFullYear());
      M = cache.M || (cache.M = UTC ? val.getUTCMonth() : val.getMonth());
      D = cache.D || (cache.D = UTC ? val.getUTCDate() : val.getDate());
      d = cache.d || (cache.d = UTC ? val.getUTCDay() : val.getDay());
      range = reverse ? later.range.prev : later.range.next;
      date = reverse ? later.date.prev : later.date.next;
    }
    return {
      value: function(curDate) {
        init(curDate, {});
        return d;
      },
      isInvalid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = range(d + 1, values, 7)) !== d + 1) {
          return date(Y, M, D + (inc - 1) - d);
        }
        return false;
      },
      isValid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = later.range.invalid(d + 1, values, 1, 7, 7, true, reverse)) !== false) {
          return inc === undefined ? undefined : date(Y, M, D + (inc - 1) - d);
        }
        return false;
      }
    };
  };
  later.constraint.Y = function(values, direction, cache) {
    var lr = later.range, ldy = later.date.year, range = direction ? lr.prev : lr.next, rangeInvalid = direction ? lr.prevInvalid : lr.nextInvalid, next = direction ? ldy.prev : ldy.next, inc, Y;
    return {
      isInvalid: function(cur) {
        Y = ldy.value(cur, cache);
        if ((inc = range(Y, values)) !== Y) {
          return direction ? inc < Y ? next(cur, inc) : undefined : inc > Y ? next(cur, inc) : undefined;
        }
        return false;
      },
      isValid: function(cur) {
        Y = ldy.value(cur, cache);
        if ((inc = rangeInvalid(Y, values, ldy.extent(), ldy.offset())) !== false) {
          return !inc ? undefined : next(cur, inc);
        }
        return false;
      }
    };
  };
  later.constraint.dy = function(values) {
    var inc, Y, M, D, dy, Jan1, Today, daysInYear, range, date;
    var SEC = 1e3, MIN = SEC * 60, HOUR = MIN * 60, DAY = HOUR * 24;
    function calcDaysInYear(year) {
      return new Date(Date.UTC(year, 1, 29)).getUTCMonth() === 1 ? 366 : 365;
    }
    function calcDayOfYear(year, month, day) {
      var first = new Date(Date.UTC(year, 0, 1)).getTime(), current = new Date(Date.UTC(year, month, day)).getTime();
      return Math.ceil(current - first) / DAY + 1;
    }
    function calcDiff() {
      var UTC = later.option.UTC, result = date(Y, 0, inc), expected = inc < 0 ? inc + daysInYear : inc > daysInYear ? inc - daysInYear : inc, actual = calcDayOfYear(UTC ? result.getUTCFullYear() : result.getFullYear(), UTC ? result.getUTCMonth() : result.getMonth(), UTC ? result.getUTCDate() : result.getDate());
      return expected - actual;
    }
    function init(d, cache, reverse) {
      var UTC = later.option.UTC;
      Y = cache.Y || (cache.Y = UTC ? d.getUTCFullYear() : d.getFullYear());
      M = cache.M || (cache.M = UTC ? d.getUTCMonth() : d.getMonth());
      D = cache.D || (cache.D = UTC ? d.getUTCDate() : d.getDate());
      dy = cache.dy || (cache.dy = calcDayOfYear(Y, M, D));
      daysInYear = cache.daysInYear || (cache.daysInYear = calcDaysInYear(Y));
      range = reverse ? later.range.prev : later.range.next;
      date = reverse ? later.date.prev : later.date.next;
    }
    return {
      value: function(curDate) {
        init(curDate, {});
        return dy;
      },
      isInvalid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if (((inc = range(dy, values, daysInYear)) || daysInYear) !== dy) {
          return date(Y, 0, inc + calcDiff());
        }
        return false;
      },
      isValid: function(curDate, reverse, cache) {
        init(curDate || new Date(), cache || {}, reverse);
        if ((inc = later.range.invalid(dy, values, 1, daysInYear, daysInYear, true, reverse)) !== false) {
          if (!inc) return undefined;
          return date(Y, 0, inc + calcDiff());
        }
        return false;
      }
    };
  };
  later.option = {
    resolution: 1,
    UTC: true,
    maxYear: 2050,
    minYear: 2e3
  };
  later.dir = {
    forward: 0,
    reverse: 1
  };
  later.compile = function(sched) {
    var constraints = [], constraintsLen = 0, applyAfter = false, cache = {};
    for (var keys in sched) {
      if (keys[0] === "a") {
        applyAfter = true;
        break;
      }
    }
    later.constraint.priority.forEach(function(c) {
      var vals = sched[c];
      if (vals) {
        constraints.push([ later.constraint[c](vals, later.dir.forward, cache), later.constraint[c](vals, later.dir.reverse, cache) ]);
      }
    });
    constraintsLen = constraints.length;
    function after(start) {
      var Y = later.date.year.value(start) + val(sched.aY), M = later.date.month.value(start) + val(sched.aM), D = later.date.date.value(start) + Math.max(val(sched.aD), val(sched.ady), val(sched.ad), val(sched.awy) * 7, val(sched.awm) * 7), h = later.date.hour.value(start) + val(sched.ah), m = later.date.minute.value(start) + val(sched.am), s = later.date.second.value(start) + val(sched.as);
      return later.date.next(Y, M, D, h, m, s);
    }
    function val(constraint) {
      return constraint && constraint[0] ? constraint[0] : 0;
    }
    return {
      getValid: function(start, dir) {
        var next = applyAfter && !dir ? after(start) : start, maxLoopCount = 1e3, done = false;
        while (!done && next && maxLoopCount--) {
          done = true;
          cache = {};
          for (var i = 0; i < constraintsLen; i++) {
            var tNext = constraints[i][dir].isInvalid(next);
            if (tNext !== false) {
              next = tNext;
              done = false;
              break;
            }
          }
        }
        return maxLoopCount ? next : null;
      },
      getInvalid: function(start, dir) {
        var cache = {};
        for (var i = constraintsLen - 1; i >= 0; i--) {
          var tNext = constraints[i][dir].isValid(start);
          if (tNext !== false) {
            return tNext;
          }
        }
        return start;
      }
    };
  };
  later.schedule = function(sched, resolution) {
    resolution = resolution === undefined ? later.option.resolution : resolution;
    var schedules = [], schedulesLen = sched && sched.schedules ? sched.schedules.length : 0, exceptions = [], exceptionsLen = sched && sched.exceptions ? sched.exceptions.length : 0;
    for (var i = 0; i < schedulesLen; i++) {
      schedules.push(later.compile(sched.schedules[i]));
    }
    for (var j = 0; j < exceptionsLen; j++) {
      exceptions.push(later.compile(sched.exceptions[j]));
    }
    function tick(date, reverse) {
      return !reverse ? new Date(date.getTime() + resolution * 1e3) : new Date(date.getTime() - resolution * 1e3);
    }
    function compare(a, b, reverse) {
      return reverse ? a.getTime() < b.getTime() : a.getTime() > b.getTime();
    }
    function isValid(sched, except, date) {
      date.setMilliseconds(0);
      var next = getNext(sched, except, date);
      return next ? date.getTime() === next.getTime() : false;
    }
    function get(startDate, endDate, count, reverse) {
      var result;
      if (count === 1) {
        result = getNext(schedules, exceptions, startDate, endDate, reverse);
      } else {
        result = [];
        while (count--) {
          var tDate = getNext(schedules, exceptions, startDate, endDate, reverse);
          if (!tDate) break;
          result.push(tDate);
          startDate = tick(tDate, reverse);
        }
      }
      return result;
    }
    function getNext(sched, except, startDate, endDate, reverse) {
      var start = startDate || new Date(), result;
      while (start) {
        var tDate;
        if (sched.length) {
          for (var i = 0, len = sched.length; i < len; i++) {
            tDate = sched[i].getValid(start, reverse);
            if (tDate && (!result || compare(result, tDate, reverse))) {
              result = tDate;
            }
          }
        } else {
          result = start;
        }
        start = null;
        if (result && except.length) {
          tDate = getNextInvalid(except, [], result, reverse);
          if (tDate.getTime() !== result.getTime()) {
            start = tDate;
            result = undefined;
          }
        }
        if (result && endDate && compare(result, endDate, reverse)) {
          result = undefined;
          break;
        }
      }
      return result;
    }
    function getNextInvalid(sched, except, startDate, reverse) {
      var start = startDate || new Date();
      while (start && isValid(sched, except, start)) {
        var nextExcep, nextInvalid;
        for (var i = 0, len = sched.length; i < len; i++) {
          var tDate = sched[i].getInvalid(start, reverse);
          if (tDate && (!nextInvalid || compare(tDate, nextInvalid, reverse))) {
            nextInvalid = tDate;
          }
        }
        if (except.length) {
          nextExcep = getNext(except, [], start, null, reverse);
        }
        if (!nextInvalid && !nextExcep) {
          start = undefined;
        } else {
          start = new Date(nextInvalid && nextExcep ? Math.min(nextInvalid.getTime(), nextExcep.getTime()) : nextExcep || nextInvalid);
        }
      }
      return start;
    }
    return {
      isValid: function(date) {
        return isValid(schedules, exceptions, date);
      },
      next: function(start, end, count) {
        return get(start, end, count || 1, false);
      },
      nextRange: function(start, end) {
        var tStart = getNext(schedules, exceptions, start, end, false), tEnd = getNextInvalid(schedules, exceptions, tStart, false);
        return [ tStart, tEnd ];
      },
      prev: function(start, end, count) {
        return get(start, end, count || 1, true);
      },
      prevRange: function(start) {
        var tStart = getNext(schedules, exceptions, start, null, true), tEnd = getNextInvalid(schedules, exceptions, tStart, true);
        return [ tStart, tEnd ];
      }
    };
  };
  later.date = {};
  later.date.constant = {
    SEC: 1e3,
    MIN: 6e4,
    HOUR: 36e5,
    DAY: 864e5,
    WEEK: 6048e5
  };
  later.date.next = function(Y, M, D, h, m, s) {
    var len = arguments.length;
    M = len < 2 ? 0 : M - 1;
    D = len < 3 ? 1 : D;
    h = len < 4 ? 0 : h;
    m = len < 5 ? 0 : m;
    s = len < 6 ? 0 : s;
    return later.option.UTC ? new Date(Date.UTC(Y, M, D, h, m, s)) : new Date(Y, M, D, h, m, s);
  };
  later.date.prev = function(Y, M, D, h, m, s) {
    var len = arguments.length;
    M = len < 2 ? 11 : M - 1;
    D = len < 3 ? new Date(Date.UTC(Y, M + 1, 0)).getUTCDate() : D;
    h = len < 4 ? 23 : h;
    m = len < 5 ? 59 : m;
    s = len < 6 ? 59 : s;
    return later.option.UTC ? new Date(Date.UTC(Y, M, D, h, m, s)) : new Date(Y, M, D, h, m, s);
  };
  later.date.day = {
    extent: function(d, cache) {
      var t = cache.daysInMonth || (cache.daysInMonth = later.date.day.value(later.date.month.end(d, cache), {}));
      return [ 1, t ];
    },
    start: function(d, cache) {
      return cache.dayStart || (cache.dayStart = later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache)));
    },
    end: function(d, cache) {
      return cache.dayEnd || (cache.dayEnd = later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache)));
    },
    value: function(d, cache) {
      return cache.day || (cache.day = later.option.UTC ? d.getUTCDate() : d.getDate());
    },
    next: function(d, val, cache) {
      if (val > later.date.day.extent(d, cache)[1]) {
        return later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache) + 1, 1);
      }
      var month = later.date.month.value(d, cache) + (val < later.date.day.value(d, cache) ? 1 : 0), md = later.date.month.next(d, month, cache), days = later.date.day.extent(md, {})[1];
      return later.date.next(later.date.year.value(d, cache), month, val > days ? 1 : val);
    },
    prev: function(d, val, cache) {
      var month = later.date.month.value(d, cache) + (val > later.date.day.value(d, cache) ? -1 : 0), md = later.date.month.prev(d, month, cache), days = later.date.day.extent(md, {})[1];
      return later.date.prev(later.date.year.value(d, cache), month, val > days ? days : val);
    }
  };
  later.date.hour = {
    extent: function(d, cache) {
      return [ 0, 23 ];
    },
    start: function(d, cache) {
      return cache.hourStart || (cache.hourStart = later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache), later.date.hour.value(d, cache)));
    },
    end: function(d, cache) {
      return cache.hourEnd || (cache.hourEnd = later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache), later.date.hour.value(d, cache)));
    },
    value: function(d, cache) {
      return cache.hours || (cache.hours = later.option.UTC ? d.getUTCHours() : d.getHours());
    },
    next: function(d, val, cache) {
      return later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache) + (val < later.date.hour.value(d, cache) ? 1 : 0), val);
    },
    prev: function(d, val, cache) {
      return later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache) + (val > later.date.hour.value(d, cache) ? -1 : 0), val);
    }
  };
  later.date.minute = {
    extent: function(d, cache) {
      return [ 0, 59 ];
    },
    start: function(d, cache) {
      return cache.minuteStart || (cache.minuteStart = later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache), later.date.hour.value(d, cache), later.date.minute.value(d, cache)));
    },
    end: function(d, cache) {
      return cache.minuteEnd || (cache.minuteEnd = later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache), later.date.hour.value(d, cache), later.date.minute.value(d, cache)));
    },
    value: function(d, cache) {
      return cache.minutes || (cache.minutes = later.option.UTC ? d.getUTCMinutes() : d.getMinutes());
    },
    next: function(d, val, cache) {
      return later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache), later.date.hour.value(d, cache) + (val < later.date.minute.value(d, cache) ? 1 : 0), val);
    },
    prev: function(d, val, cache) {
      return later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache), later.date.hour.value(d, cache) + (val > later.date.minute.value(d, cache) ? -1 : 0), val);
    }
  };
  later.date.month = {
    extent: function(d, cache) {
      return [ 1, 12 ];
    },
    start: function(d, cache) {
      return cache.hourStart || (cache.hourStart = later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache)));
    },
    end: function(d, cache) {
      return cache.hourEnd || (cache.hourEnd = later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache)));
    },
    value: function(d, cache) {
      return cache.month || (cache.month = later.option.UTC ? d.getUTCMonth() + 1 : d.getMonth() + 1);
    },
    next: function(d, val, cache) {
      return later.date.next(later.date.year.value(d, cache) + (val < later.date.month.value(d, cache) ? 1 : 0), val);
    },
    prev: function(d, val, cache) {
      return later.date.prev(later.date.year.value(d, cache) + (val > later.date.month.value(d, cache) ? -1 : 0), val);
    }
  };
  later.date.second = {
    extent: function(d, cache) {
      return [ 0, 59 ];
    },
    start: function(d, cache) {
      return d;
    },
    end: function(d, cache) {
      return d;
    },
    value: function(d, cache) {
      return cache.seconds || (cache.seconds = later.option.UTC ? d.getUTCSeconds() : d.getSeconds());
    },
    next: function(d, val, cache) {
      return later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache), later.date.hour.value(d, cache), later.date.minute.value(d, cache) + (val < later.date.second.value(d, cache) ? 1 : 0), val);
    },
    prev: function(d, val, cache) {
      return later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache), later.date.hour.value(d, cache), later.date.minute.value(d, cache) + (val > later.date.second.value(d, cache) ? -1 : 0), val);
    }
  };
  later.date.time = {
    pad: function(val) {
      return val < 10 ? "0" + val : val;
    },
    extent: function(d, cache) {
      return [ "00:00:00", "23:59:59" ];
    },
    start: function(d, cache) {
      return d;
    },
    end: function(d, cache) {
      return d;
    },
    value: function(d, cache) {
      return cache.time || (cache.time = later.date.time.pad(later.date.hour.value(d, cache)) + ":" + later.date.time.pad(later.date.minute.value(d, cache)) + ":" + later.date.time.pad(later.date.second.value(d, cache)));
    },
    next: function(d, val, cache) {
      var x = val.split(":");
      return later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache) + (val < later.date.time.value(d, cache) ? 1 : 0), x[0], x[1], x[2]);
    },
    prev: function(d, val, cache) {
      var x = val.split(":");
      return later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache) + (val > later.date.time.value(d, cache) ? -1 : 0), x[0], x[1], x[2]);
    }
  };
  later.date.weekdayCount = {
    extent: function(d, cache) {
      return [ 1, Math.ceil(later.date.day.extent(d, cache)[1] / 7) ];
    },
    start: function(d, cache) {
      return cache.weekdayCountStart || (cache.weekdayCountStart = later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), (later.date.weekdayCount.value(d, cache) - 1) * 7 + 1 || 1));
    },
    end: function(d, cache) {
      return cache.weekdayCountEnd || (cache.weekdayCountEnd = later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.weekdayCount.value(d, cache) * 7));
    },
    value: function(d, cache) {
      return cache.weekdaycount || (cache.weekdaycount = Math.floor((later.date.day.value(d, cache) - 1) / 7) + 1);
    },
    next: function(d, val, cache) {
      return later.date.day.next(d, 1 + 7 * (val - 1), cache);
    },
    prev: function(d, val, cache) {
      return later.date.day.prev(d, 7 + 7 * (val - 1), cache);
    }
  };
  later.date.weekday = {
    extent: function(d, cache) {
      return [ 1, 7 ];
    },
    start: function(d, cache) {
      return later.date.day.start(d, cache);
    },
    end: function(d, cache) {
      return later.date.day.end(d, cache);
    },
    value: function(d, cache) {
      return cache.weekday || (cache.weekday = later.option.UTC ? d.getUTCDay() + 1 : d.getDay() + 1);
    },
    next: function(d, val, cache) {
      var wd = later.date.weekday.value(d, cache);
      return later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache) + (val - wd) + (val < wd ? 7 : 0));
    },
    prev: function(d, val, cache) {
      var wd = later.date.weekday.value(d, cache);
      return later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache) + (val - wd) + (val > wd ? -7 : 0));
    }
  };
  later.date.week = {
    extent: function(d, cache) {
      return [ 1, cache.weekCount || (cache.weekCount = (later.date.day.extent(d, cache)[1] + (later.date.weekday.value(later.date.month.start(d, cache), {}) - 1) + (7 - later.date.weekday.value(later.date.month.end(d, cache), {}))) / 7) ];
    },
    start: function(d, cache) {
      return cache.weekStart || (cache.weekStart = later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), Math.max(later.date.day.value(d, cache) - later.date.weekday.value(d, cache) + 1, 1)));
    },
    end: function(d, cache) {
      return cache.weekEnd || (cache.weekEnd = later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), Math.min(later.date.day.value(d, cache) + (7 - later.date.weekday.value(d, cache)), later.date.day.extent(d, cache)[1])));
    },
    value: function(d, cache) {
      return cache.week || (cache.week = (later.date.day.value(d, cache) + (later.date.weekday.value(later.date.month.start(d, cache), {}) - 1) + (7 - later.date.weekday.value(d, {}))) / 7);
    },
    next: function(d, val, cache) {
      var w = later.date.week.value(d, cache), month = val > w ? later.date.month.start(d, cache) : later.date.month.next(d, later.date.month.value(d, cache) + 1, cache);
      return later.date.next(later.date.year.value(d, cache), later.date.month.value(month, {}), Math.max(1, (val - 1) * 7 - (later.date.weekday.value(month, {}) - 2)));
    },
    prev: function(d, val, cache) {
      var w = later.date.week.value(d, cache), month = val < w ? later.date.month.start(d, cache) : later.date.month.start(later.date.month.prev(d, later.date.month.value(d, cache) - 1, cache), {});
      return later.date.week.end(later.date.next(later.date.year.value(d, cache), later.date.month.value(month, {}), Math.max(1, (val - 1) * 7 - (later.date.weekday.value(month, {}) - 2))), {});
    }
  };
  later.date.weekyear = {
    extent: function(d, cache) {
      if (cache.weekyearCount) return [ 1, cache.weekyearCount ];
      var firstWeekdayOfYear = cache.firstWeekdayOfYear || (cache.firstWeekdayOfYear = later.date.weekday.value(later.date.year.start(d, cache), {}));
      var lastWeekdayOfYear = cache.lastWeekdayOfYear || (cache.lastWeekdayOfYear = later.date.weekday.value(later.date.year.end(d, cache), {}));
      return [ 1, cache.weekyearCount = firstWeekdayOfYear === 5 || lastWeekdayOfYear === 5 ? 53 : 52 ];
    },
    start: function(d, cache) {
      return cache.weekyearStart || (cache.weekyearStart = later.date.next(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache) - (later.date.weekday.value(d, cache) > 1 ? later.date.weekday.value(d, cache) - 2 : 6)));
    },
    end: function(d, cache) {
      return cache.weekyearEnd || (cache.weekyearEnd = later.date.prev(later.date.year.value(d, cache), later.date.month.value(d, cache), later.date.day.value(d, cache) + (later.date.weekday.value(d, cache) > 1 ? 8 - later.date.weekday.value(d, cache) : 0)));
    },
    value: function(d, cache) {
      if (cache.weekyear) return cache.weekyear;
      var thursWeek = later.date.weekday.next(later.date.weekyear.start(d, cache), 5, {});
      var thursYear = later.date.weekday.next(later.date.year.prev(d, later.date.year.value(thursWeek, {}) - 1, cache), 5, {});
      return cache.weekyear || (cache.weekyear = 1 + Math.ceil((thursWeek.getTime() - thursYear.getTime()) / later.date.constant.WEEK));
    },
    next: function(d, val, cache) {
      var wStart = later.date.weekyear.start(d, cache), w = later.date.weekyear.value(d, cache), diff = val > w ? val - w : later.date.weekyear.extent(d, cache)[1] - w + val;
      return later.date.next(later.date.year.value(wStart, {}), later.date.month.value(wStart, {}), later.date.day.value(wStart, {}) + 7 * diff);
    },
    prev: function(d, val, cache) {
      var wEnd = later.date.weekyear.end(d, cache), w = later.date.weekyear.value(d, cache), diff = val < w ? w - val : w + (later.date.weekyear.extent(later.date.year.prev(wEnd, later.date.year.value(wEnd, {}) - 1, {}), {})[1] - val);
      return later.date.prev(later.date.year.value(wEnd, {}), later.date.month.value(wEnd, {}), later.date.day.value(wEnd, {}) - 7 * diff);
    }
  };
  later.date.yearday = {
    extent: function(d, cache) {
      if (cache.yeardayCount) return [ 1, cache.yeardayCount ];
      var y = later.date.year.value(d, cache), yeardayCount = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 366 : 365;
      return [ 1, cache.yeardayCount = yeardayCount ];
    },
    start: function(d, cache) {
      return later.date.year.start(d, cache);
    },
    end: function(d, cache) {
      return later.date.year.end(d, cache);
    },
    value: function(d, cache) {
      if (cache.yearday) return cache.yearday;
      var dayCounts = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ], month = later.date.month.value(d, cache) - 1, offset = month > 1 && later.date.yearday.extent(d, cache)[1] === 366 ? 1 : 0, day = dayCounts[month] + later.date.day.value(d, cache) + offset;
      return cache.yearday = day;
    },
    next: function(d, val, cache) {
      return later.date.next(later.date.year.value(d, cache) + (val < later.date.yearday.value(d, cache) ? 1 : 0), 1, val);
    },
    prev: function(d, val, cache) {
      return later.date.prev(later.date.year.value(d, cache) + (val > later.date.yearday.value(d, cache) ? -1 : 0), 1, val);
    }
  };
  later.date.year = {
    extent: function(d, cache) {
      return [ later.option.minYear, later.option.maxYear ];
    },
    start: function(d, cache) {
      return cache.yearStart || (cache.yearStart = later.date.next(later.date.year.value(d, cache)));
    },
    end: function(d, cache) {
      return cache.yearEnd || (cache.yearEnd = later.date.prev(later.date.year.value(d, cache)));
    },
    value: function(d, cache) {
      return cache.year || (cache.year = later.option.UTC ? d.getUTCFullYear() : d.getFullYear());
    },
    next: function(d, val, cache) {
      return val < later.date.year.extent()[1] ? later.date.next(val) : undefined;
    },
    prev: function(d, val, cache) {
      return val > later.date.year.extent()[0] ? later.date.prev(val) : undefined;
    }
  };
  later.date.mod = function(val, mod, min) {
    return val > mod ? min || 0 : val < (min || 0) ? mod : val;
  };
  later.parse = {};
  later.parse.cron = function() {
    var NAMES = {
      JAN: 1,
      FEB: 2,
      MAR: 3,
      APR: 4,
      MAY: 5,
      JUN: 6,
      JUL: 7,
      AUG: 8,
      SEP: 9,
      OCT: 10,
      NOV: 11,
      DEC: 12,
      SUN: 1,
      MON: 2,
      TUE: 3,
      WED: 4,
      THU: 5,
      FRI: 6,
      SAT: 7
    };
    var FIELDS = {
      s: [ 0, 0, 59 ],
      m: [ 1, 0, 59 ],
      h: [ 2, 0, 23 ],
      D: [ 3, 1, 31 ],
      M: [ 4, 1, 12 ],
      Y: [ 6, 1970, 2099 ],
      d: [ 5, 1, 7, 1 ]
    };
    function getValue(value, offset) {
      return isNaN(value) ? NAMES[value] || null : +value + (offset || 0);
    }
    function cloneSchedule(sched) {
      var clone = {}, field;
      for (field in sched) {
        if (field !== "dc" && field !== "d") {
          clone[field] = sched[field].slice(0);
        }
      }
      return clone;
    }
    function add(sched, name, min, max, inc) {
      var i = min;
      if (!sched[name]) {
        sched[name] = [];
      }
      while (i <= max) {
        if (sched[name].indexOf(i) < 0) {
          sched[name].push(i);
        }
        i += inc || 1;
      }
    }
    function addHash(schedules, curSched, value, hash) {
      if (curSched.d && !curSched.dc || curSched.dc && curSched.dc.indexOf(hash) < 0) {
        schedules.push(cloneSchedule(curSched));
        curSched = schedules[schedules.length - 1];
      }
      add(curSched, "d", value, value);
      add(curSched, "dc", hash, hash);
    }
    function addWeekday(s, curSched, value) {
      var except1 = {}, except2 = {};
      if (value === 1) {
        add(curSched, "D", 1, 3);
        add(curSched, "d", NAMES.MON, NAMES.FRI);
        add(except1, "D", 2, 2);
        add(except1, "d", NAMES.TUE, NAMES.FRI);
        add(except2, "D", 3, 3);
        add(except2, "d", NAMES.TUE, NAMES.FRI);
      } else {
        add(curSched, "D", value - 1, value + 1);
        add(curSched, "d", NAMES.MON, NAMES.FRI);
        add(except1, "D", value - 1, value - 1);
        add(except1, "d", NAMES.MON, NAMES.THU);
        add(except2, "D", value + 1, value + 1);
        add(except2, "d", NAMES.TUE, NAMES.FRI);
      }
      s.exceptions.push(except1);
      s.exceptions.push(except2);
    }
    function addRange(item, curSched, name, min, max, offset) {
      var incSplit = item.split("/"), inc = +incSplit[1], range = incSplit[0];
      if (range !== "*" && range !== "0") {
        var rangeSplit = range.split("-");
        min = getValue(rangeSplit[0], offset);
        max = getValue(rangeSplit[1], offset);
      }
      add(curSched, name, min, max, inc);
    }
    function parse(item, s, name, min, max, offset) {
      var value, split, schedules = s.schedules, curSched = schedules[schedules.length - 1];
      if (item === "L") {
        item = min - 1;
      }
      if ((value = getValue(item, offset)) !== null) {
        add(curSched, name, value, value);
      } else if ((value = getValue(item.replace("W", ""), offset)) !== null) {
        addWeekday(s, curSched, value);
      } else if ((value = getValue(item.replace("L", ""), offset)) !== null) {
        addHash(schedules, curSched, value, min - 1);
      } else if ((split = item.split("#")).length === 2) {
        value = getValue(split[0], offset);
        addHash(schedules, curSched, value, getValue(split[1]));
      } else {
        addRange(item, curSched, name, min, max, offset);
      }
    }
    function isHash(item) {
      return item.indexOf("#") > -1 || item.indexOf("L") > 0;
    }
    function itemSorter(a, b) {
      return isHash(a) && !isHash(b) ? 1 : 0;
    }
    function parseExpr(expr) {
      var schedule = {
        schedules: [ {} ],
        exceptions: []
      }, components = expr.split(" "), field, f, component, items;
      for (field in FIELDS) {
        f = FIELDS[field];
        component = components[f[0]];
        if (component && component !== "*" && component !== "?") {
          items = component.split(",").sort(itemSorter);
          var i, length = items.length;
          for (i = 0; i < length; i++) {
            parse(items[i], schedule, field, f[1], f[2], f[3]);
          }
        }
      }
      return schedule;
    }
    return {
      parse: function(expr, hasSeconds) {
        var e = expr.toUpperCase();
        return parseExpr(hasSeconds ? e : "0 " + e);
      }
    };
  };
  later.parse.recur = function() {
    var schedules = [], exceptions = [], cur, curArr = schedules, curName, values, every, after, applyMin, applyMax, i, last;
    function add(name, min, max) {
      name = after ? "a" + name : name;
      if (!cur) {
        curArr.push({});
        cur = curArr[0];
      }
      if (!cur[name]) {
        cur[name] = [];
      }
      curName = cur[name];
      if (every) {
        values = [];
        for (i = min; i <= max; i += every) {
          values.push(i);
        }
        last = {
          n: name,
          x: every,
          c: curName.length,
          m: max
        };
      }
      values = applyMin ? [ min ] : applyMax ? [ max ] : values;
      var length = values.length;
      for (i = 0; i < length; i += 1) {
        if (curName.indexOf(values[i]) < 0) {
          curName.push(values[i]);
        }
      }
      values = every = after = applyMin = applyMax = 0;
    }
    return {
      schedules: schedules,
      exceptions: exceptions,
      on: function() {
        values = arguments[0] instanceof Array ? arguments[0] : arguments;
        return this;
      },
      every: function(x) {
        every = x;
        return this;
      },
      after: function(x) {
        after = true;
        values = [ x ];
        return this;
      },
      first: function() {
        applyMin = 1;
        return this;
      },
      last: function() {
        applyMax = 1;
        return this;
      },
      at: function() {
        values = arguments;
        for (var i = 0, len = values.length; i < len; i++) {
          var split = values[i].split(":");
          if (split.length < 3) {
            values[i] += ":00";
          }
        }
        add("t");
        return this;
      },
      afterTime: function() {
        values = arguments;
        for (var i = 0, len = values.length; i < len; i++) {
          var split = values[i].split(":");
          if (split.length < 3) {
            values[i] += ":00";
          }
        }
        add("ta");
        return this;
      },
      beforeTime: function() {
        values = arguments;
        for (var i = 0, len = values.length; i < len; i++) {
          var split = values[i].split(":");
          if (split.length < 3) {
            values[i] += ":00";
          }
        }
        add("tb");
        return this;
      },
      second: function() {
        add("s", 0, 59);
        return this;
      },
      minute: function() {
        add("m", 0, 59);
        return this;
      },
      hour: function() {
        add("h", 0, 23);
        return this;
      },
      dayOfMonth: function() {
        add("D", 1, applyMax ? 0 : 31);
        return this;
      },
      dayOfWeek: function() {
        add("d", 1, 7);
        return this;
      },
      onWeekend: function() {
        values = [ 1, 7 ];
        return this.dayOfWeek();
      },
      onWeekday: function() {
        values = [ 2, 3, 4, 5, 6 ];
        return this.dayOfWeek();
      },
      dayOfWeekCount: function() {
        add("dc", 1, applyMax ? 0 : 5);
        return this;
      },
      dayOfYear: function() {
        add("dy", 1, applyMax ? 0 : 366);
        return this;
      },
      weekOfMonth: function() {
        add("wm", 1, applyMax ? 0 : 5);
        return this;
      },
      weekOfYear: function() {
        add("wy", 1, applyMax ? 0 : 53);
        return this;
      },
      month: function() {
        add("M", 1, 12);
        return this;
      },
      year: function() {
        add("Y", 1970, 2450);
        return this;
      },
      startingOn: function(start) {
        return this.between(start, last.m);
      },
      between: function(start, end) {
        cur[last.n] = cur[last.n].splice(0, last.c);
        every = last.x;
        add(last.n, start, end);
        return this;
      },
      and: function() {
        cur = curArr[curArr.push({}) - 1];
        return this;
      },
      except: function() {
        curArr = exceptions;
        cur = null;
        return this;
      }
    };
  };
  later.parse.text = function() {
    var recur = later.parse.recur, pos = 0, input = "", error;
    var TOKENTYPES = {
      eof: /^$/,
      rank: /^((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|(0|[1-5]?[4-9]|[1-5]0|1[1-3])(th)?))\b/,
      time: /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,
      dayName: /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,
      monthName: /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
      yearIndex: /^(\d\d\d\d)\b/,
      every: /^every\b/,
      after: /^after\b/,
      second: /^(s|sec(ond)?(s)?)\b/,
      minute: /^(m|min(ute)?(s)?)\b/,
      hour: /^(h|hour(s)?)\b/,
      day: /^(day(s)?( of the month)?)\b/,
      dayInstance: /^day instance\b/,
      dayOfWeek: /^day(s)? of the week\b/,
      dayOfYear: /^day(s)? of the year\b/,
      weekOfYear: /^week(s)?( of the year)?\b/,
      weekOfMonth: /^week(s)? of the month\b/,
      weekday: /^weekday\b/,
      weekend: /^weekend\b/,
      month: /^month(s)?\b/,
      year: /^year(s)?\b/,
      between: /^between (the)?\b/,
      start: /^(start(ing)? (at|on( the)?)?)\b/,
      at: /^(at|@)\b/,
      and: /^(,|and\b)/,
      except: /^(except\b)/,
      also: /(also)\b/,
      first: /^(first)\b/,
      last: /^last\b/,
      "in": /^in\b/,
      of: /^of\b/,
      onthe: /^on the\b/,
      on: /^on\b/,
      through: /(-|^(to|through)\b)/
    };
    var NAMES = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
      sun: 1,
      mon: 2,
      tue: 3,
      wed: 4,
      thu: 5,
      fri: 6,
      sat: 7,
      "1st": 1,
      fir: 1,
      "2nd": 2,
      sec: 2,
      "3rd": 3,
      thi: 3,
      "4th": 4,
      "for": 4
    };
    function t(start, end, text, type) {
      return {
        startPos: start,
        endPos: end,
        text: text,
        type: type
      };
    }
    function peek(expected) {
      var scanTokens = expected instanceof Array ? expected : [ expected ], whiteSpace = /\s+/, token, curInput, m, scanToken, start, len;
      scanTokens.push(whiteSpace);
      start = pos;
      while (!token || token.type === whiteSpace) {
        len = -1;
        curInput = input.substring(start);
        token = t(start, start, input.split(whiteSpace)[0]);
        var i, length = scanTokens.length;
        for (i = 0; i < length; i++) {
          scanToken = scanTokens[i];
          m = scanToken.exec(curInput);
          if (m && m.index === 0 && m[0].length > len) {
            len = m[0].length;
            token = t(start, start + len, curInput.substring(0, len), scanToken);
          }
        }
        if (token.type === whiteSpace) {
          start = token.endPos;
        }
      }
      return token;
    }
    function scan(expectedToken) {
      var token = peek(expectedToken);
      pos = token.endPos;
      return token;
    }
    function parseThroughExpr(tokenType) {
      var start = +parseTokenValue(tokenType), end = checkAndParse(TOKENTYPES.through) ? +parseTokenValue(tokenType) : start, nums = [];
      for (var i = start; i <= end; i++) {
        nums.push(i);
      }
      return nums;
    }
    function parseRanges(tokenType) {
      var nums = parseThroughExpr(tokenType);
      while (checkAndParse(TOKENTYPES.and)) {
        nums = nums.concat(parseThroughExpr(tokenType));
      }
      return nums;
    }
    function parseEvery(r) {
      var num, period, start, end;
      if (checkAndParse(TOKENTYPES.weekend)) {
        r.on(NAMES.sun, NAMES.sat).dayOfWeek();
      } else if (checkAndParse(TOKENTYPES.weekday)) {
        r.on(NAMES.mon, NAMES.tue, NAMES.wed, NAMES.thu, NAMES.fri).dayOfWeek();
      } else {
        num = parseTokenValue(TOKENTYPES.rank);
        r.every(num);
        period = parseTimePeriod(r);
        if (checkAndParse(TOKENTYPES.start)) {
          num = parseTokenValue(TOKENTYPES.rank);
          r.startingOn(num);
          parseToken(period.type);
        } else if (checkAndParse(TOKENTYPES.between)) {
          start = parseTokenValue(TOKENTYPES.rank);
          if (checkAndParse(TOKENTYPES.and)) {
            end = parseTokenValue(TOKENTYPES.rank);
            r.between(start, end);
          }
        }
      }
    }
    function parseOnThe(r) {
      if (checkAndParse(TOKENTYPES.first)) {
        r.first();
      } else if (checkAndParse(TOKENTYPES.last)) {
        r.last();
      } else {
        r.on(parseRanges(TOKENTYPES.rank));
      }
      parseTimePeriod(r);
    }
    function parseScheduleExpr(str) {
      pos = 0;
      input = str;
      error = -1;
      var r = recur();
      while (pos < input.length && error < 0) {
        var token = parseToken([ TOKENTYPES.every, TOKENTYPES.after, TOKENTYPES.onthe, TOKENTYPES.on, TOKENTYPES.of, TOKENTYPES["in"], TOKENTYPES.at, TOKENTYPES.and, TOKENTYPES.except, TOKENTYPES.also ]);
        switch (token.type) {
         case TOKENTYPES.every:
          parseEvery(r);
          break;

         case TOKENTYPES.after:
          r.after(parseTokenValue(TOKENTYPES.rank));
          parseTimePeriod(r);
          break;

         case TOKENTYPES.onthe:
          parseOnThe(r);
          break;

         case TOKENTYPES.on:
          r.on(parseRanges(TOKENTYPES.dayName)).dayOfWeek();
          break;

         case TOKENTYPES.of:
          r.on(parseRanges(TOKENTYPES.monthName)).month();
          break;

         case TOKENTYPES["in"]:
          r.on(parseRanges(TOKENTYPES.yearIndex)).year();
          break;

         case TOKENTYPES.at:
          r.at(parseTokenValue(TOKENTYPES.time));
          while (checkAndParse(TOKENTYPES.and)) {
            r.at(parseTokenValue(TOKENTYPES.time));
          }
          break;

         case TOKENTYPES.also:
          r.and();
          break;

         case TOKENTYPES.except:
          r.except();
          break;

         default:
          error = pos;
        }
      }
      return {
        schedules: r.schedules,
        exceptions: r.exceptions,
        error: error
      };
    }
    function parseTimePeriod(r) {
      var timePeriod = parseToken([ TOKENTYPES.second, TOKENTYPES.minute, TOKENTYPES.hour, TOKENTYPES.dayOfYear, TOKENTYPES.dayOfWeek, TOKENTYPES.dayInstance, TOKENTYPES.day, TOKENTYPES.month, TOKENTYPES.year, TOKENTYPES.weekOfMonth, TOKENTYPES.weekOfYear ]);
      switch (timePeriod.type) {
       case TOKENTYPES.second:
        r.second();
        break;

       case TOKENTYPES.minute:
        r.minute();
        break;

       case TOKENTYPES.hour:
        r.hour();
        break;

       case TOKENTYPES.dayOfYear:
        r.dayOfYear();
        break;

       case TOKENTYPES.dayOfWeek:
        r.dayOfWeek();
        break;

       case TOKENTYPES.dayInstance:
        r.dayOfWeekCount();
        break;

       case TOKENTYPES.day:
        r.dayOfMonth();
        break;

       case TOKENTYPES.weekOfMonth:
        r.weekOfMonth();
        break;

       case TOKENTYPES.weekOfYear:
        r.weekOfYear();
        break;

       case TOKENTYPES.month:
        r.month();
        break;

       case TOKENTYPES.year:
        r.year();
        break;

       default:
        error = pos;
      }
      return timePeriod;
    }
    function checkAndParse(tokenType) {
      var found = peek(tokenType).type === tokenType;
      if (found) {
        scan(tokenType);
      }
      return found;
    }
    function parseToken(tokenType) {
      var t = scan(tokenType);
      if (t.type) {
        t.text = convertString(t.text, tokenType);
      } else {
        error = pos;
      }
      return t;
    }
    function parseTokenValue(tokenType) {
      return parseToken(tokenType).text;
    }
    function convertString(str, tokenType) {
      var output = str;
      switch (tokenType) {
       case TOKENTYPES.time:
        var parts = str.split(/(:|am|pm)/), hour = parts[3] === "pm" ? parseInt(parts[0], 10) + 12 : parts[0], min = parts[2].trim();
        output = (hour.length === 1 ? "0" : "") + hour + ":" + min;
        break;

       case TOKENTYPES.rank:
        output = parseInt(/^\d+/.exec(str)[0], 10);
        break;

       case TOKENTYPES.monthName:
       case TOKENTYPES.dayName:
        output = NAMES[str.substring(0, 3)];
        break;
      }
      return output;
    }
    return {
      parse: function(str) {
        return parseScheduleExpr(str.toLowerCase());
      }
    };
  };
  later.range = {};
  later.range.isValid = function(val, values, max, hasLast) {
    return values.indexOf(val) > -1 || hasLast && val === max && values.indexOf(0) > -1;
  };
  later.range.next = function(val, values, minOffset) {
    var cur, next = null, min = values[0], i = values.length;
    while (i--) {
      cur = values[i];
      if (cur === val) {
        return val;
      }
      min = cur < min ? cur : min;
      next = cur > val && (!next || cur < next) ? cur : next;
    }
    return next || (minOffset === undefined ? min : min + minOffset);
  };
  later.range.nextInvalid = function(val, values, extent, offset, hasLast) {
    var min = extent[0], max = extent[1];
    if (later.range.isValid(val, values, max, hasLast)) {
      var orig = val;
      do {
        val = later.date.mod(val + 1, max, min);
      } while (val !== orig && later.range.isValid(val, values, max, hasLast));
      return val === orig ? undefined : val > orig ? val : val + offset;
    }
    return false;
  };
  later.range.prev = function(val, values, maxOffset) {
    var cur, prev = null, i = values.length, max = values[i - 1];
    while (i--) {
      cur = values[i];
      if (cur === val) {
        return val;
      }
      max = cur > max ? cur : max;
      prev = cur < val && (!prev || cur > prev) ? cur : prev;
    }
    return prev !== null ? prev : maxOffset === undefined ? max : max - maxOffset;
  };
  later.range.prevInvalid = function(val, values, extent, offset, hasLast) {
    var min = extent[0], max = extent[1];
    if (later.range.isValid(val, values, max, hasLast)) {
      var orig = val;
      do {
        val = later.date.mod(val - 1, max, min);
      } while (val !== orig && later.range.isValid(val, values, max, hasLast));
      return val === orig ? undefined : val < orig ? val : val - offset;
    }
    return false;
  };
  return later;
}();