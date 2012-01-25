
SOURCE = lib/*.js
TESTS = test/*.js
REPORTER = dot

build:
		cat $(SOURCE) > scheduler.min.js
		./node_modules/.bin/uglifyjs --overwrite scheduler.min.js
		gzip -c scheduler.min.js -9 > scheduler.min.js.gz
				

test:
		@NODE_ENV=test ./node_modules/.bin/mocha \
				--require should \
				--reporter $(REPORTER) \
				$(TESTS)

.PHONY:	build test 