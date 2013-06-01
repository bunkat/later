/**
* Returns the modulus of the value specified, wrapping around at -1
*
*/
later.date.mod = function(val, mod, min) {
  return val > mod ? (min || 0) : (val < (min || 0) ? mod : val);
};