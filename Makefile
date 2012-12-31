
SOURCE = lib/*.js
TESTS = test/*.js
REPORTER = dot

build:
		cat $(SOURCE) > later.js
		cat lib/shims.js lib/later.js > later-core.js
		cat lib/shims.js lib/later.js lib/recur.js > later-recur.js
		cat lib/shims.js lib/later.js lib/cron.parser.js > later-cron.js
		cat lib/shims.js lib/later.js lib/recur.js lib/en.parser.js > later-en.js
		./node_modules/.bin/uglifyjs later.js -o later.min.js
		./node_modules/.bin/uglifyjs later-core.js -o later-core.min.js
		./node_modules/.bin/uglifyjs later-recur.js -o later-recur.min.js
		./node_modules/.bin/uglifyjs later-cron.js -o later-cron.min.js
		./node_modules/.bin/uglifyjs later-en.js -o later-en.min.js
		
test:
		@NODE_ENV=test ./node_modules/.bin/mocha \
				--require should \
				--reporter $(REPORTER) \
				$(TESTS)

lint:
		find lib/. -name "*.js" -print0 | xargs -0 ./node_modules/.bin/jslint \
				--white --vars --plusplus --continue

.PHONY:	build test lint 