

later.array.minIndex = function(arr) {
  var min = arr[0],
      minIdx = 0;

  for(var i = 1; i < arr.length; i++) {
    if(arr[i] < min) {
      min = arr[i];
      minIdx = i;
    }
  }

  return minIdx;
};