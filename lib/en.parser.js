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
      rank: /^((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|([1-5]?[4-9]|[1-5]0|1[1-3])(th)?))\b/,
      time: /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,
      dayName: /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,
      monthName: /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
      yearIndex: /^(\d\d\d\d)\b/,
      every: /^every\b/,
      second: /^(s|sec(ond)?(s)?)\b/,
      minute: /^(m|min(ute)?(s)?)\b/,
      hour: /^(h|hour(s)?)\b/,
      day: /^(d|day(s)?)\b/,
      dayInstance: /^day instance\b/,
      dayOfWeek: /^day of the week\b/,
      dayOfYear: /^day of the year\b/,
      weekOfYear: /^week(s)? of year\b/,
      weekOfMonth: /^week(s)? of month\b/,
      weekday: /^weekday\b/,
      weekend: /^weekend\b/,
      month: /^month(s)?\b/,
      year: /^year\b/,
      ordinal: /^((first|1st)|(second|2nd)|(third|3rd)|(fourth|4th)|last)\b/,
      between: /^between (the)?\b/,
      start: /^(start(ing)? (at|on( the)?)?)\b/,
      at: /^(at|@)\b/,
      and: /^(,|and\b)/,
      except: /^(except\b)/,
      also: /(,)\b/,
      first: /^(first|1st)\b/,
      last: /^last\b/,
      "in": /^in\b/,
      of: /^of\b/,
      onthe: /^on the\b/,
      on: /^on\b/,
      through: /(-|^(to|through)\b)/
    };

    var NAMES = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, 
        aug: 7, sep: 8, oct: 9, nov: 10, dec: 11, sun: 0, mon: 1, tue: 2, 
        wed: 3, thu: 4, fri: 5, sat: 6, '1st': 1, fir: 1, '2nd': 2, sec: 2, 
        '3rd': 3, thi: 3, '4th': 4, for: 4, las: 5  
    };

    var EnParser = function () {
    
        var pos = 0;
        var input = '';
        var error;

        var t = function (start, end, text, type) {
            return {startPos: start, endPos: end, text: text, type: type};
        }

        var peek = function (expectedTokens) {
            var scanTokens = expectedTokens instanceof Array ? expectedTokens : [expectedTokens]
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
            //console.log(token);
            pos = token.endPos;
            return token;            
        }


        var parseThroughExpr = function(tokenType) {

            var start = parseTokenValue(tokenType);
            var end = checkAndParse(TOKENTYPES.through) ? 
                parseTokenValue(tokenType) : start;
            var nums = [];

            for (var i = +start; i <= +end; i++) {
                nums.push(i);
            }
            
            return nums;
        }


        var parseScheduleExpr = function () {
            
            var r = recur();
            while (pos < input.length && !error) {

                if (checkAndParse(TOKENTYPES.every)) {
                    
                    if (checkAndParse(TOKENTYPES.weekend)) {
                        r.on(0,6).dayOfWeek();
                    }
                    else if (checkAndParse(TOKENTYPES.weekday)) {
                        r.on(1,2,3,4,5).dayOfWeek();
                    }
                    else {
                        var num = parseTokenValue(TOKENTYPES.rank);
                        r.every(num);
                        var period = parseTimePeriod(r);

                        if (checkAndParse(TOKENTYPES.start)) {
                            num = parseTokenValue(TOKENTYPES.rank);
                            r.startingOn(num);
                            parseToken(period.type);
                        } else if (checkAndParse(TOKENTYPES.between)) {
                            var start = parseTokenValue(TOKENTYPES.rank);
                            if (checkAndParse(TOKENTYPES.and)) {
                                var end = parseTokenValue(TOKENTYPES.rank);
                                r.between(start,end);
                            }
                        }
                    }
                }

                else if (checkAndParse(TOKENTYPES.onthe)) {
                    
                    if (checkAndParse(TOKENTYPES.first)) {
                        r.first();
                    }
                    else if (checkAndParse(TOKENTYPES.last)) {
                        r.last();
                    }
                    else {
                        var nums = parseThroughExpr(TOKENTYPES.rank);
                        while (checkAndParse(TOKENTYPES.and)) {
                            nums = nums.concat(parseThroughExpr(TOKENTYPES.rank));
                        }

                        r.on(nums);
                    }
                    parseTimePeriod(r);
                }
                // on wednesday,thursday on the 1st day instance
                else if (checkAndParse(TOKENTYPES.on)) {
                    var nums = parseThroughExpr(TOKENTYPES.dayName);
                    while (checkAndParse(TOKENTYPES.and)) {
                        nums = nums.concat(parseThroughExpr(TOKENTYPES.dayName));
                    }
                    r.on(nums).dayOfWeek();
                }

                else if (checkAndParse(TOKENTYPES.of)) {
                    var nums = parseThroughExpr(TOKENTYPES.monthName);
                    while (checkAndParse(TOKENTYPES.and)) {
                        nums = nums.concat(parseThroughExpr(TOKENTYPES.monthName));
                    }
                    r.on(nums).month();
                }

                else if (checkAndParse(TOKENTYPES.in)) {
                    var nums = parseThroughExpr(TOKENTYPES.yearIndex);
                    while (checkAndParse(TOKENTYPES.and)) {
                        nums = nums.concat(parseThroughExpr(TOKENTYPES.yearIndex));
                    }
                    r.on(nums).year();
                }

                else if (checkAndParse(TOKENTYPES.at)) {
                    var time = parseTokenValue(TOKENTYPES.time);
                    r.at(time);
                }

                else if (checkAndParse(TOKENTYPES.and)) {
                    r.and();
                }

                else if (checkAndParse(TOKENTYPES.except)) {
                    r.except();
                }
                else  if (pos !== input.length) {
                    error = 'Unexpected token at position ' + pos;
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
                    error = [timePeriod.text];
            }

            return timePeriod;
        }

        var checkToken = function (tokenType, skipIfFound) {
            var found = (peek(tokenType)).type === tokenType;
            if (found && skipIfFound) {
                scan(tokenType);
            }
            return found;
        }

        var checkAndParse = function (tokenType) {
            return checkToken(tokenType, true);
        }

        var parseToken = function (tokenType) {
            var t = scan(tokenType);
            if (t.type) {
                t.text = convertString(t.text, tokenType)
            }
            else {
                error = 'Unexpected token at position ' + pos;
            }
            return t;
        }


        var parseTokenValue = function (tokenType) {
            return (parseToken(tokenType)).text;
        }

        var convertString = function (str, tokenType) {
            var output = str;

            if (tokenType === TOKENTYPES.time) {
                var parts = str.split(/(:|am|pm)/)
                  , hour = parts[3] === 'pm' ? parseInt(parts[0],10) + 12 : parts[0]
                  , min = parts[2].trim();

                  output = (hour.length === 1 ? '0' : '') + hour + ":" + min;
            }
            else if (tokenType === TOKENTYPES.rank) {
                
                output = parseInt((/^\d+/.exec(str))[0],10);   
            }
            else if (tokenType === TOKENTYPES.monthName || tokenType === TOKENTYPES.dayName ||
                     tokenType == TOKENTYPES.ordinal) {
                
                output = NAMES[str.substring(0,3)];
            }

            return output;
        }


        return {

            parse: function(str) {
                pos = 0;
                input = str;
                return parseScheduleExpr(str);
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


