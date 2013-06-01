/**
* Returns true if val is contained in values or if val is the max value and the
* range supports a 'last' value indicated with a 0.
*/
later.range.isValid = function(val, values, max, hasLast) {
  return values.indexOf(val) > -1 || (hasLast && val === max && values.indexOf(0) > -1);
};