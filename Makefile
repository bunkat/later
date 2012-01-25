
SOURCE = lib/*.js
TESTS = test/*.js
REPORTER = dot

build:
		cat SOURCE > ./bin/scheduler.js \
		uglifyjs ./bin/scheduler.js > scheduler.min.js	
				

test:
		@NODE_ENV=test ./node_modules/.bin/mocha \
				--require should \
				--reporter $(REPORTER) \
				$(TESTS)

.PHONY:	build test 