/**
* Finds the next invalid value.
*
*/
later.range.nextInvalid = function(val, values, extent, offset, hasLast) {
  var min = extent[0], max = extent[1];

  if (later.range.isValid(val, values, max, hasLast)) {
    var orig = val;

    do { val = later.date.mod(val+1, max, min); }
    while(val !== orig && later.range.isValid(val, values, max, hasLast));

    return val === orig ? undefined : val > orig ? val : val + offset;
  }

  return false;
};