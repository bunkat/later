/**
* Later.js 0.0.1
* (c) 2012 Bill, BunKat LLC.
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://bunkat.github.com/later
*/

var recur = require('./recur');

(function () {

    "use strict";

    var TOKENTYPES = {
      eof: /^$/,
      rank: /^((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|(0|[1-5]?[4-9]|[1-5]0|1[1-3])(th)?))\b/,
      time: /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,
      dayName: /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,
      monthName: /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
      yearIndex: /^(\d\d\d\d)\b/,
      every: /^every\b/,
      second: /^(s|sec(ond)?(s)?)\b/,
      minute: /^(m|min(ute)?(s)?)\b/,
      hour: /^(h|hour(s)?)\b/,
      day: /^(day(s)? of the month)\b/,
      dayInstance: /^day instance\b/,
      dayOfWeek: /^day(s)? of the week\b/,
      dayOfYear: /^day(s)? of the year\b/,
      weekOfYear: /^week(s)? of year\b/,
      weekOfMonth: /^week(s)? of month\b/,
      weekday: /^weekday\b/,
      weekend: /^weekend\b/,
      month: /^month(s)?\b/,
      year: /^year\b/,
      between: /^between (the)?\b/,
      start: /^(start(ing)? (at|on( the)?)?)\b/,
      at: /^(at|@)\b/,
      and: /^(,|and\b)/,
      except: /^(except\b)/,
      also: /(also)\b/,
      first: /^(first)\b/,
      last: /^last\b/,
      "in": /^in\b/,
      of: /^of\b/,
      onthe: /^on the\b/,
      on: /^on\b/,
      through: /(-|^(to|through)\b)/
    };

    var NAMES = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, 
        aug: 8, sep: 9, oct: 10, nov: 11, dec: 12, sun: 1, mon: 2, tue: 3, 
        wed: 4, thu: 5, fri: 6, sat: 7, '1st': 1, fir: 1, '2nd': 2, sec: 2, 
        '3rd': 3, thi: 3, '4th': 4, for: 4  
    };

    var EnParser = function () {
    
        var pos = 0;
        var input = '';
        var error;

        var t = function (start, end, text, type) {
            return {startPos: start, endPos: end, text: text, type: type};
        }

        var peek = function (expected) {
            var scanTokens = expected instanceof Array ? expected : [expected]
              , whiteSpace = /\s+/
              , token, curInput, m, scanToken, start, len
            
            scanTokens.push(whiteSpace);

            // loop past any skipped tokens and only look for expected tokens
            start = pos;
            while (!token || token.type === whiteSpace) {
                len = -1;
                curInput = input.substring(start);
                token = t(start, start, input.split(whiteSpace)[0]);
                
                for(var i = 0; i < scanTokens.length; i++) {
                    scanToken = scanTokens[i];
                    m = scanToken.exec(curInput);
                    if (m && m.index === 0 && m[0].length > len) {
                        len = m[0].length;
                        token = t(start, start + len, curInput.substring(0, len), scanToken);
                    }
                } 

                // update the start position if this token should be skipped
                if (token.type === whiteSpace) {
                    start = token.endPos;
                }
            }

            return token;
        }

        var scan = function (expectedToken) {
            var token = peek(expectedToken);
            pos = token.endPos;
            return token;            
        }


        var parseThroughExpr = function(tokenType) {

            var start = +parseTokenValue(tokenType)
              , end = checkAndParse(TOKENTYPES.through) ? 
                       +parseTokenValue(tokenType) : start
              , nums = [];

            for (var i = start; i <= end; i++) {
                nums.push(i);
            }
            
            return nums;
        }

        var parseRanges = function(tokenType) {
            var nums = parseThroughExpr(tokenType);
            while (checkAndParse(TOKENTYPES.and)) {
                nums = nums.concat(parseThroughExpr(tokenType));
            }
            return nums;         
        }

        var parseEvery = function(r) {
            var num, period, start, end;

            if (checkAndParse(TOKENTYPES.weekend)) {
                r.on(NAMES.sun,NAMES.sat).dayOfWeek();
            }
            else if (checkAndParse(TOKENTYPES.weekday)) {
                r.on(NAMES.mon,NAMES.tue,NAMES.wed,NAMES.thu,NAMES.fri).dayOfWeek();
            }
            else {
                num = parseTokenValue(TOKENTYPES.rank);
                r.every(num);
                period = parseTimePeriod(r);

                if (checkAndParse(TOKENTYPES.start)) {
                    num = parseTokenValue(TOKENTYPES.rank);
                    r.startingOn(num);
                    parseToken(period.type);
                } 
                else if (checkAndParse(TOKENTYPES.between)) {
                    start = parseTokenValue(TOKENTYPES.rank);
                    if (checkAndParse(TOKENTYPES.and)) {
                        end = parseTokenValue(TOKENTYPES.rank);
                        r.between(start,end);
                    }
                }
            }            
        }


        var parseOnThe = function(r) {
            
            if (checkAndParse(TOKENTYPES.first)) {
                r.first();
            }
            else if (checkAndParse(TOKENTYPES.last)) {
                r.last();
            }
            else {
                r.on(parseRanges(TOKENTYPES.rank));
            }

            parseTimePeriod(r);
        }


        var parseScheduleExpr = function (str) {
            pos = 0;
            input = str;

            var r = recur();
            while (pos < input.length && !error) {

                var token = parseToken([TOKENTYPES.every, TOKENTYPES.onthe,
                    TOKENTYPES.on, TOKENTYPES.of, TOKENTYPES.in,
                    TOKENTYPES.at, TOKENTYPES.and, TOKENTYPES.except,
                    TOKENTYPES.also]);

                switch (token.type) {
                    case TOKENTYPES.every:
                        parseEvery(r);
                        break;
                    case TOKENTYPES.onthe:
                        parseOnThe(r);
                        break;
                    case TOKENTYPES.on:
                        r.on(parseRanges(TOKENTYPES.dayName)).dayOfWeek();
                        break;
                    case TOKENTYPES.of:
                        r.on(parseRanges(TOKENTYPES.monthName)).month();
                        break;
                    case TOKENTYPES.in:
                        r.on(parseRanges(TOKENTYPES.yearIndex)).year();
                        break;
                    case TOKENTYPES.at:
                        r.at(parseTokenValue(TOKENTYPES.time));
                        while (checkAndParse(TOKENTYPES.and)) {
                            r.at(parseTokenValue(TOKENTYPES.time));
                        }
                        break;
                    case TOKENTYPES.also:
                        r.and();
                        break;
                    case TOKENTYPES.except:
                        r.except();
                        break;
                    default:
                        error = pos;
                }
            }

            return {schedules: r.schedules, exceptions: r.exceptions};
        }


        var parseTimePeriod = function (r) {
            var timePeriod = parseToken([TOKENTYPES.second, TOKENTYPES.minute, 
                TOKENTYPES.hour, TOKENTYPES.dayOfYear, TOKENTYPES.dayOfWeek, 
                TOKENTYPES.dayInstance, TOKENTYPES.day, TOKENTYPES.month, 
                TOKENTYPES.year, TOKENTYPES.weekOfMonth, TOKENTYPES.weekOfYear]);

            switch (timePeriod.type) {
                case TOKENTYPES.second:
                    r.second();
                    break;         
                case TOKENTYPES.minute:
                    r.minute();
                    break;
                case TOKENTYPES.hour:
                    r.hour();
                    break;
                case TOKENTYPES.dayOfYear:
                    r.dayOfYear();
                    break;             
                case TOKENTYPES.dayOfWeek:
                    r.dayOfWeek();
                    break;
                case TOKENTYPES.dayInstance:
                    r.dayOfWeekCount();
                    break;
                case TOKENTYPES.day:
                    r.dayOfMonth();
                    break;
                case TOKENTYPES.weekOfMonth:
                    r.weekOfMonth();
                    break;
                case TOKENTYPES.weekOfYear:
                    r.weekOfYear();
                    break;
                case TOKENTYPES.month:
                    r.month();
                    break;
                case TOKENTYPES.year:
                    r.year();
                    break;
                default:
                    error = pos;
            }

            return timePeriod;
        }

        var checkAndParse = function (tokenType) {
            var found = (peek(tokenType)).type === tokenType;
            if (found) {
                scan(tokenType);
            }
            return found;
        }

        var parseToken = function (tokenType) {
            var t = scan(tokenType);
            if (t.type) {
                t.text = convertString(t.text, tokenType)
            }
            else {
                error = pos;
            }
            return t;
        }

        var parseTokenValue = function (tokenType) {
            return (parseToken(tokenType)).text;
        }

        var convertString = function (str, tokenType) {
            var output = str;

            switch (tokenType) {
                case TOKENTYPES.time:
                    var parts = str.split(/(:|am|pm)/)
                      , hour = parts[3] === 'pm' ? parseInt(parts[0],10) + 12 : parts[0]
                      , min = parts[2].trim();

                    output = (hour.length === 1 ? '0' : '') + hour + ":" + min;
                    break;

                case TOKENTYPES.rank:
                    output = parseInt((/^\d+/.exec(str))[0],10);
                    break;

                case TOKENTYPES.monthName:
                case TOKENTYPES.dayName:
                    output = NAMES[str.substring(0,3)];
                    break;
            }

            return output;
        }

        return {

            parse: function(str) {
                return parseScheduleExpr(str.toLowerCase());
            }
        };
    };

    /**
    * Allow library to be used within both the browser and node.js
    */
    if (typeof exports !== 'undefined') {
        module.exports = EnParser;
    } else {
        this.recur = EnParser;
    }   

}).call(this);


