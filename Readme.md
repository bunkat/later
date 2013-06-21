_Later_ is a library for describing recurring schedules and calculating their future occurrences.  It supports a very flexible schedule definition including support for composite schedules and schedule exceptions.  _Later_ also supports executing a callback on a provided schedule.

There are four ways that schedules can be defined: using the chainable _Recur_ api, using an English expression, using a Cron expression, or they can also be manually defined. _Later_ works in both the browser and [node](http://nodejs.org) and the core engine for calculating schedules is only 4kb minified and compressed.

Example _Later_ schedules:
* Run a report on the last day of every month at 12 AM except in December
* Install patches on the 2nd Tuesday of every month at 4 AM
* Gather CPU metrics every 10 mins Mon - Fri and every 30 mins Sat - Sun
* Send out a scary e-mail at 13:13:13 every Friday the 13th

## Full documentation

http://bunkat.github.io/later/

## Installation

Using npm:

    $ npm install later

Using bower:

    $ bower install later

## Building

To build the minified javascript files for _later_:

    $ make build

## Running tests

To run the tests for _later_, run `npm install` to install dependencies and then:

    $ make test