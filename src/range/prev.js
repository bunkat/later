/**
* Finds the previous valid value which is either the next smallest valid
* value or the maximum valid value if no smaller value exists. To
* simplify some calculations, the min value is then substracted to a specified
* offset.
*
* For example, if the current minute is 5 and the next valid
* value is 7, the offset will be set to 60 (max number of minutes) and
* prevInRange will return -67. This is the number of minutes that must
* be added to the current hour to get to the next valid minute.
*
* @param {Int/String} val: The current value
* @param {[]} values: Array of possible valid values
* @param {Int/String} maxOffset: Value to subtract from the maximum value
*/
later.range.prev = function(val, values, maxOffset) {
  var cur, prev = null, i = values.length, max = values[i-1];
  while (i--) {
      cur = values[i];
      if (cur === val) {
          return val;
      }

      max = cur > max ? cur : max;
      prev = cur < val && (!prev || cur > prev) ? cur : prev;
  }

  return prev !== null ? prev : (maxOffset === undefined ? max : (max - maxOffset));
};