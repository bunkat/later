
SOURCE = lib/*.js
TESTS = test/*.js
REPORTER = dot

build:
		cat $(SOURCE) > later.min.js
		cat lib/later.js > later-core.min.js
		./node_modules/.bin/uglifyjs --overwrite later.min.js
		./node_modules/.bin/uglifyjs --overwrite later-core.min.js

		gzip -c later.min.js -9 > later.min.js.gz		
		gzip -c later-core.min.js -9 > later-core.min.js.gz
				
test:
		@NODE_ENV=test ./node_modules/.bin/mocha \
				--require should \
				--reporter $(REPORTER) \
				$(TESTS)

.PHONY:	build test 