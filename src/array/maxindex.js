

later.array.maxIndex = function(arr) {
  var max = arr[0],
      maxIdx = 0;

  for(var i = 1; i < arr.length; i++) {
    if(arr[i] > max) {
      max = arr[i];
      maxIdx = i;
    }
  }

  return maxIdx;
};