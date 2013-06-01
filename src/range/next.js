/**
* Finds the next valid value which is either the next largest valid
* value or the minimum valid value if no larger value exists. To
* simplify some calculations, the min value is then added to a specified
* offset.
*
* For example, if the current minute is 5 and the next valid
* value is 1, the offset will be set to 60 (max number of minutes) and
* nextInRange will return 61. This is the number of minutes that must
* be added to the current hour to get to the next valid minute.
*
* @param {Int/String} val: The current value
* @param {[]} values: Array of possible valid values
* @param {Int/String} minOffset: Value to add to the minimum value
*/
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

  return next || (minOffset === undefined ? min : (min + minOffset));
};