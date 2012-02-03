
SOURCE = lib/*.js
TESTS = test/*.js
REPORTER = dot

build:
		cat $(SOURCE) > later.min.js
		cat lib/later.js > later-core.min.js
		cat lib/later.js lib/recur.js > later-recur.min.js
		cat lib/later.js lib/cron.parser.js > later-cron.min.js
		./node_modules/.bin/uglifyjs -nc --unsafe --overwrite later.min.js
		./node_modules/.bin/uglifyjs -nc --unsafe --overwrite later-core.min.js
		./node_modules/.bin/uglifyjs -nc --unsafe --overwrite later-recur.min.js
		./node_modules/.bin/uglifyjs -nc --unsafe --overwrite later-cron.min.js

		gzip -c later.min.js -9 > later.min.js.gz		
		gzip -c later-core.min.js -9 > later-core.min.js.gz
		gzip -c later-recur.min.js -9 > later-recur.min.js.gz
		gzip -c later-cron.min.js -9 > later-cron.min.js.gz
				
test:
		@NODE_ENV=test ./node_modules/.bin/mocha \
				--require should \
				--reporter $(REPORTER) \
				$(TESTS)

.PHONY:	build test 