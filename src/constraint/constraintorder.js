/**
* Cosntraint Order
* (c) 2013 Bill, BunKat LLC.
*
* Defines the order that the constraints should be verified. Should be from
* largest time period to smallest time period for best performance.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.constraintOrder = [
  'Y', 'year',
  'dy', 'dayOfYear',
  'wy', 'weekOfYear',
  'M', 'month',
  'wm', 'weekOfMonth',
  'dwc', 'dayOfWeekCount',
  'D', 'day',
  'dw', 'dayOfWeek',
  't', 'time',
  'h', 'hour',
  'm', 'minute',
  's', 'second'];