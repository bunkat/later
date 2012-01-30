
SOURCE = lib/*.js
TESTS = test/*.js
REPORTER = dot

build:
		cat lib/scheduler.js > scheduler-core.min.js
		cat lib/sched2.js > schedule.min.js
		cat $(SOURCE) > scheduler.min.js
		./node_modules/.bin/uglifyjs --overwrite scheduler.min.js
		./node_modules/.bin/uglifyjs --overwrite schedule.min.js
		./node_modules/.bin/uglifyjs --overwrite scheduler-core.min.js

		gzip -c schedule.min.js -9 > schedule.min.js.gz		
		gzip -c scheduler.min.js -9 > scheduler.min.js.gz
		gzip -c scheduler-core.min.js -9 > scheduler-core.min.js.gz
				

test:
		@NODE_ENV=test ./node_modules/.bin/mocha \
				--require should \
				--reporter $(REPORTER) \
				$(TESTS)

.PHONY:	build test 