/**
* Pad
* (c) 2013 Bill, BunKat LLC.
*
* Simple padding of integer values to two digits.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.date.pad = function (val) {
  return val < 10 ? '0' + val : val;
};