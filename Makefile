REPORTER ?= dot
TESTS ?= $(shell find test -name "*-test.js")

all: \
	later.js \
	later.min.js \
	component.json \
	package.json

.PHONY: clean all test

test: later.js
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(TESTS)

test-cov: later-cov.js
	@LATER_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html-cov

later-cov.js: src-cov $(shell node_modules/.bin/smash --list src-cov/later.js)
	@rm -f $@
  node_modules/.bin/smash src/later.js
	@chmod a-w $@

src-cov: all
	@jscoverage --no-highlight src src-cov

benchmark: all
	@node benchmark/core/instanceof-bench.js

later.js: $(shell node_modules/.bin/smash --list src/later.js)
	@rm -f $@
	node_modules/.bin/smash src/later.js | node_modules/.bin/uglifyjs - -b indent-level=2 -o $@
	@chmod a-w $@

later.min.js: later.js
	@rm -f $@
	node_modules/.bin/uglifyjs $< -c -m -o $@

component.json: src/component.js later.js
	@rm -f $@
	node src/component.js > $@
	@chmod a-w $@

package.json: src/package.js later.js
	@rm -f $@
	node src/package.js > $@
	@chmod a-w $@

clean:
	rm -f later*.js package.json component.json