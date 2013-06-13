/**
* Next
* (c) 2013 Bill, BunKat LLC.
*
* Returns the next valid value in a range of values, wrapping as needed. Assumes
* the array has already been sorted.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/

later.array.next = function (val, values, extent) {

  // skip UNDEFINED values...


  var cur,
      zeroVal = extent[0] === 0 ? 0 : extent[1],
      next = values[0] || zeroVal;

  for(var i = values.length-1; i > -1; --i) {
    cur = values[i] || zeroVal;

    if(cur > val) {
      next = cur;
      continue;
    }

    if(cur === val) {
      return cur;
    }

    break;
  }

  return next <= extent[1] ? next : values[0] || zeroVal;
};