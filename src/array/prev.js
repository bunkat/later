/**
* Previous
* (c) 2013 Bill, BunKat LLC.
*
* Returns the previous valid value in a range of values, wrapping as needed. Assumes
* the array has already been sorted.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/

later.array.prev = function (val, values, extent) {

  var cur, len = values.length,
      zeroVal = extent[0] === 0 ? 0 : extent[1],
      prev = values[len-1] || zeroVal;

  for(var i = 0; i < len; i++) {
    cur = values[i] || zeroVal;

    if(cur < val) {
      prev = cur;
      continue;
    }

    if(cur === val) {
      return cur;
    }

    break;
  }

  return prev;
};