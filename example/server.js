var recur = require('../../lib/recur').recur
  , cron = require('../../lib/cron.parser').cronParser
  , text = require('../../lib/en.parser').enParser
  , later = require('../../lib/later').later
  , rSched, cSched, tSched, mSched, results;

// every 5 minutes (make sure to set schedule resolution to 60 seconds)
rSched = recur().every(5).minute();
cSched = cron().parse('* */5 * * * *', true);
tSched = text().parse('every 5 minutes');
mSched = {schedules: [ {m: [0,5,10,15,20,25,30,35,40,45,50,55]}]};

results = later(60).getNext(rSched);

// every 5 minutes starting on the 3rd minute (make sure to set schedule resolution to 60 seconds)
rSched = recur().every(5).minute().startingOn(3);
cSched = cron().parse('* 3-59/5 * * * *', true);
tSched = text().parse('every 5 minutes starting on the 3rd minute');
mSched = {schedules: [ {m: [3,8,13,18,23,28,33,38,43,48,53,58]}]};

results = later(60).getNext(rSched);

// every 5 minutes between the 3rd and 20th minute (make sure to set schedule resolution to 60 seconds)
rSched = recur().every(5).minute().between(3,20);
cSched = cron().parse('* 3-20/5 * * * *', true);
tSched = text().parse('every 5 minutes between the 3rd and 20th minute');
mSched = {schedules: [ {m: [3,8,13,18]}]};

results = later(60).getNext(rSched);

// every 5 minutes between the 3rd and 20th minute except 8th (make sure to set schedule resolution to 60 seconds)
rSched = recur().every(5).minute().between(3,20).except().on(8).minute();
cSched = cron().parse('* 3-7,9-20/5 * * * *', true);
tSched = text().parse('every 5 minutes between the 3rd and 20th minute except on the 8th minute');
mSched = {schedules: [ {m: [3,8,13,18]}]};

results = later(60).getNext(rSched);

// every 5 minutes on the 0th second (schedule resolution can be 1 seconds)
rSched = recur().every(5).minute().first().second();
cSched = cron().parse('0 */5 * * * *', true);
tSched = text().parse('every 5 minutes on the first second');
mSched = {schedules: [ {s: [0], m: [0,5,10,15,20,25,30,35,40,45,50,55]}]};

results = later().getNext(rSched);

// every Tuesday at at 11 am
rSched = recur().on(3).dayOfWeek().at('11:00');
cSched = cron().parse('* 0 11 * * 2');
tSched = text().parse('on tuesday at 11:00 am');

results = later(1, true).getNext(rSched); // 11 am local time
results = later().getNext(rSched); // 11 am UTC

// every hour on weekdays and every other hour on weekends (set resolution to 3600 seconds)
rSched = recur().every(1).hour().onWeekday().and().every(2).hour().onWeekend();
tSched = text().parse('every 1 hour every weekday also every 2 hours every weekend');
mSched = {schedules: [ 
	{h: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 
	 d:[2,3,4,5,6]},
	{h: [0,2,4,6,8,10,12,14,16,18,20,22], 
	 d:[1,7]}]};

// get next 10 occurrences
results = later().get(rSched, 10);

// at 6 pm every day except on Christmas (Dec 25th)
rSched = recur().at('18:00').except().on(12).month().on(25).dayOfMonth();
tSched = text().parse('at 6:00 pm except on the 12th month on the 25th day');

// get next 10 occurrences starting in october
results = later().get(rSched, 10, new Date('9/1/2012'), new Date('1/1/2013'));
