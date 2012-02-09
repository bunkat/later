_Later_ is a simple library for describing recurring schedules and calculating their future occurrences.  It supports a very flexible schedule definition including support for composite schedules and schedule exceptions.  _Later_ also supports executing a callback on a provided schedule. 

There are four ways that schedules can be defined: using the chainable _Recur_ api, using an English expression, using a Cron expression, or they can also be manually defined. _Later_ works in both the browser and [node](http://nodejs.org) and the core engine for calculating schedules is only 1.3k minified and compressed.

## Node Example

```js
var recur = require('later').recur
  , cron = require('later').cronParser
  , text = require('later').enParser
  , later = require('later').later
  , rSched, cSched, tSched, mSched, results;

// equivalent schedules for every 5 minutes
rSched = recur().every(5).minute();
cSched = cron().parse('* */5 * * * *', true);
tSched = text().parse('every 5 minutes');
mSched = {schedules: [ {m: [0,5,10,15,20,25,30,35,40,45,50,55]}]};

// calculate the next occurrence, using a minimum resolution of 60 seconds
// otherwise every second of every minute would be valid occurrences
results = later(60).getNext(rSched);
```

## Browser Example

    <script src="later.min.js" type="text/javascript"></script>
    <script type="text/javascript">

    // create the desired schedule
    var schedule = enParser().parse('every 5 minutes');

    // calculate the next 5 occurrences with a minimum resolution of 60 seconds, using local time
    var results = later(60, true).get(schedule, 5);

    </script>

## Installation

    $ npm install later

## Time Periods

_Later_ works as a very primitive constraints solver.  A _Later_ schedule is simply a set of constraints indicating the valid values for a set of time periods.  _Later_ then finds the first date and time (or any number of occurrences) that meets all of the constraints.  _Later_ supports constraints using following time periods (Note: Not all of these are supported when using Cron expressions):

#### Seconds (s)

Denotes seconds within each minute.  
Minimum value is 0, maximum value is 59. Specify 59 for last.  

#### Minutes (m)

Denotes minutes within each hour.  
Minimum value is 0, maximum value is 59. Specify 59 for last.  

#### Hours (h)

Denotes hours within each day.  
Minimum value is 0, maximum value is 23. Specify 23 for last.  

#### Days Of Month (D)

Denotes number of days within a month.  
Minimum value is 1, maximum value is 31.  Specify 0 for last.  

#### Days Of Week (dw)

Denotes the days within a week.  
Minimum value is 1, maximum value is 7.  Specify 0 for last.
    
    1 - Sunday
    2 - Monday
    3 - Tuesday
    4 - Wednesday
    5 - Thursday
    6 - Friday
    7 - Saturday  

#### Day of Week Count (dc)

Denotes the number of times a particular day has occurred within a month.  Used to specify things like second Tuesday, or third Friday in a month.  
Minimum value is 1, maximum value is 5.  Specify 0 for last.
    
    1 - First occurrence
    2 - Second occurrence
    3 - Third occurrence
    4 - Fourth occurrence
    5 - Fifth occurrence
    0 - Last occurrence  

#### Day of Year (dy)

Denotes number of days within a year.  
Minimum value is 1, maximum value is 366.  Specify 0 for last.  

#### Week of Month (wm)

Denotes number of weeks within a month. The first week is the week that includes the 1st of the month. Subsequent weeks start on Sunday.     
Minimum value is 1, maximum value is 5.  Specify 0 for last.  

For example, February of 2012:

    Week 1 - February 2nd,  2012
    Week 2 - February 5th,  2012
    Week 3 - February 12th, 2012 
    Week 4 - February 19th, 2012 
    Week 5 - February 26th, 2012

#### Week of Year (wy)

Denotes the ISO 8601 week date. For more information see: [http://en.wikipedia.org/wiki/ISO_week_date](http://en.wikipedia.org/wiki/ISO_week_date).  
Minimum value is 1, maximum value is 53.  Specify 0 for last.

#### Month of Year (M)

Denotes the months within a year.  
Minimum value is 1, maximum value is 12.  Specify 0 for last.

    1 - January
    2 - February
    3 - March
    4 - April
    5 - May
    6 - June
    7 - July
    8 - August
    9 - September
    10 - October
    11 - November
    12 - December  

#### Year (Y)

Denotes the four digit year.  
Minimum value is 1970, maximum value is 2450 (arbitrary).  

## Composite Schedules

Other than Cron expressions, all other types of schedules support composite schedules.  A composite schedule can include multiple sets of constraints.  An occurrence is considered valid if it meets all of the constraints within any one set of the constraints defined.

    var s = enParser().parse('every 5 mins also at 11:07 am');

This schedule will produce occurrences on the five minute boundaries (11:00 am, 11:05 am, etc) but will also have a valid occurrence at 11:07 am.

## Schedule Exceptions

Other than Cron expressions, all other types of schedules support exception schedules (which can be composite shedules).  An occurrence is considered invalid if it meets all of the constraints within any exception schedule that has been defined.

    var s = recur().every(1).hour().except().onWeekends().and().at('13:00:00');

This schedule will produce occurrences on the hour (make sure to set the minimum resolution when calculating schedules to 3600 seconds or every second of every minute would also be valid).  No valid occurrences will ever occur on weekends or at 1:00 pm.

## Creating Schedules using Recur

_Recur_ provides a simple, chainable API for creating schedules.  All valid schedules can be produced using this API. See the example folder and the test folder for lots of examples of valid schedules.

#### Time periods

Recur uses the following:

    second();
    minute();
    hour();
    dayOfWeek();
    dayOfWeekCount();
    dayOfMonth();
    dayOfYear();
    weekOfMonth();
    weekOfYear();
    month();
    year();

#### on(_args_)

Specifies one or more specific occurrences of a time period.

    recur().on(2).minute();
    recur().on(4,6).dayOfWeek();

#### onWeekend()

Shorthand for `on(1,7).dayOfWeek()`.

#### onWeekday()

Shorthand for `on(2,3,4,5,6).dayOfWeek()`.

#### every(x)

Specifies an interval `x` of occurrences of a time period.  By default, intervals start at the minimum value of the time period and go until the maximum value of the time period. 

For example:

    recur().every(2).month();

Will include months 1,3,5,7,9,11.

#### startingOn(x)

Specifies the starting occurrence `x` of a time period.  Must be chained after an `every` call.

    recur().every(4).weeksOfYear().startingOn(2);

#### between(x, y)

Specifies the starting occurrence `x` and ending occurrence `y` of a time period.  Must be chained after an `every` call.

    recur().every(6).dayOfYear().between(10,200);

#### at(time)

Specifies a specific time for the schedule.  The time must be in 24 hour time and time zone agnostic.

    recur().at('11:00:00');

#### and()

Creates a composite schedule.

    recur().every(2).hour().onWeekend().and().every(5).minute().every(2).hour().onWeekday();

### except()

Creates an exception schedule.

    recur().every(2).hour().except().onWeekday().and().on(25).dayOfMonth().on(12).month();


## Creating Schedules using Text Expression

Schedules can also be created using an English text expression syntax.  All valid schedules can be produced in this manner.  See the example folder and the test folder for lots of examples of valid schedules.

    var s = enParser().parse('every 5 minutes');

If the text expression could not be parsed, `s.Error` will contain the position in the string where parsing failed.

#### _timePeriod_

The valid time period expressions are:

* (s|sec(ond)?(s)?),  
* (m|min(ute)?(s)?),  
* (h|hour(s)?),  
* (day(s)? of the month),  
* day instance,  
* day(s)? of the week,  
* day(s)? of the year,  
* week(s)? of year,  
* week(s)? of month,  
* month(s)?,  
* year  

#### _num_

((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|(0|[1-5]?[4-9]|[1-5]0|1[1-3])(th)?))

#### _time_

((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d)),

#### _monthName_

(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)

#### _dayName_

((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)

#### _numRange_ 

_num_((-|through)_num_)?((,|and)_numRange)\*

#### _monthRange_ 

_monthName_((-|through)_monthName_)?((,|and)_monthName_)\*

#### _dayRange_ 

_dayName_((-|through)_dayName_)?((,|and)_dayName_)\*

#### _specificTime_

on the ( first | last | _numRange_ _timePeriod_ )

#### _startingOn_

(start(ing)? (at|on( the)?)?) _num_ _timePeriod_

#### _between_

between (the)? _num_ and _num_

#### _recurringTime_

every ( weekend | weekday | _num_ _timePeriod_ ( _startingOn_ | _between_ ))

#### _onDayOfWeek_

on _dayRange_

#### _ofMonth_

of _monthRange_

#### _inYear_

in _numRange_

#### _schedule_

( _specificTime_ | _recurringTime_ | _onDayOfWeek_ | _ofMonth_ | _inYear_ )\*

#### _compositeSchedule_

( _schedule_ )( also _schedule_ )\*( except )( _schedule_ )( also _schedule_ )\*

## Creating Schedules using Cron

A valid schedule can be generated from any valid Cron expression. For more information on the Cron expression format, see: [http://en.wikipedia.org/wiki/Cron](http://en.wikipedia.org/wiki/Cron).  Currently Cron expressions are the most compact way to describe a schedule, but are slightly less flexible (no direct support for composite or exception schedules) and can be harder to read.

#### parse(expr [,_hasSeconds_])

Parses the Cron expression `expr` and returns a valid schedule that can be used with _Later_.  If `expr` contains the seconds component (optionally appears before the minutes component), then `hasSeconds` must be set to true.

    var s = cronParser().parse('* */5 * * * *', true);

## Creating Schedules Manually

Schedules are basic `json` objects that can be constructed directly if desired. The schedule object has the following form:

```js
{
  schedules: [
    {
      // constraints
    },
    {
      // constraints
    },

  ],
  exceptions: [
    {
      // constraints
    },
    {
      // constraints
    },

  ]
}
```

where `constraints` are of the form:

```js
{constraint_id: [
  //valid values
],
constraint_id: [
  //valid values
],
```

The `constraint_id`s can be found in the _Time Periods_ section above following the constraint name along with the valid values.

For example, the schedule _every hour on weekdays and every other hour on weekends_ would be defined as:

```js
{schedules: [ 
  {
    h: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 
    d: [2,3,4,5,6]
  },
  {
    h: [0,2,4,6,8,10,12,14,16,18,20,22], 
    d: [1,7]}
  ]
};
```

## Calculating Occurrences

#### later(_[resolution[, useLocalTime]]_)

Configures _later_ to calculate future occurrences. `Resolution` is the minimum amount of time in seconds between valid occurrences. The default is 1 second which may produce undesirable results when calcuating multiple occurrences into the future. 

To calculate occurrences for a schedule that occurs every five minutes, either of the following would produce the expected results:

    var s = recur().every(5).minute();
    var r = later(60).get(s,10);

    var s = recur().every(5).minute().first().second();
    var r = later().get(s,10);

By default, all schedules are calculated using UTC time. Set `useLocalTime` to true to do calculations using local time instead. This makes hour, minute, and time constraints fall on the expected values on a local machine.  Schedule definitions are always time zone agnostic. 

#### getNext(recur, _[startDate[, endDate]]_)

Returns the next valid occurrence of the schedule definition, `recur`, that is passed in or null if no occurrences exist. Pass in `Date` objects to `startDate` and `endDate` to define the time range to find the next valid occurrence.  By default `startDate` is the current date and time and there is no `endDate`.

    var s = cronParser().parse(* */5 * * * *);
    later().getNext(s, new Date('1/1/2012'), new Date('1/1/2013'));

#### get(recur, count, _[startDate[, endDate]]_)

Returns the next `count` occurrences of the schedule definition, `recur`, that is passed in or null if no occurrences exist. Pass in `Date` objects to `startDate` and `endDate` to define the time range to find the next valid occurrences.  By default `startDate` is the current date and time and there is no `endDate`.

    var s = cronParser().parse(* */5 * * * *);
    later().get(sched, 10, new Date('1/1/2012'), new Date('1/1/2013'));

#### isValid(recur, date)

Returns true if `date` is a valid occurrence of the schedule defined by `recur`.

#### exec(recur, startDate, callback, arg)

Executes `callback` on the schedule defined by `recur` starting on `startDate`. The callback will be called with whatever is passed in as `arg`. The callback will continue to be called until either `stopExec` is called or there are no more valid occurrences of the schedule.  Only one schedule should be executed per `later` object to make stoping execution simpler.

Do this:

```js
var s1 = cronParser().parse('* */5 * * * *'');  
var every5 = later();  
ever5.exec(s1, new Date(), cb);    

var s2 = cronParser().parse('* */6 * * * *'');
var every6 = later();
every6.exec(s2, new Date(), cb);
```

Not this:

```js
var s1 = cronParser().parse('* */5 * * * *'');
var s2 = cronParser().parse('* */6 * * * *'');
var l = later();
l.exec(s1, new Date(), cb);  
l.exec(s2, new Date(), cb);
```

#### stopExec()

Immediately stops the execution of any schedule execution created using `exec`.

## Building

To build the minified javascript files for _later_:

    $ make build

There are 5 different javascript files that are built.

* __later.min.js__ contains all of the library files
* __later-core.min.js__ contains only the core engine for calculating occurrences
* __later-recur.min.js__ contains only the files needed to use Recur based scheduling
* __later-cron.min.js__ contains only the files needed to use Cron based scheduling
* __later-en.min.js__ contains only the files need to use English text based scheduling

## Running tests

To run the tests for _later_, run `npm install` to install dependencies and then:

    $ make test

## Performance

Some basic performance tests are available on __jsperf__:

* [Schedule Definition](http://jsperf.com/later-schedule-def)
* [Recurrence Calculation](http://jsperf.com/later-schedule-calc)

## License 

(The MIT License)

Copyright (c) 2011 BunKat LLC &lt;bill@bunkat.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WIT