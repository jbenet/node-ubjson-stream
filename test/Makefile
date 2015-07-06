# Run tests
#
# Copyright (c) 2014 Christian Couder
# MIT Licensed; see the LICENSE file in this repository.
#

# NOTE: run with TEST_VERBOSE=1 for verbose sharness tests.

BINS = bin/ubjson
T = $(sort $(wildcard t[0-9][0-9][0-9][0-9]-*.sh))
SHARNESS = lib/sharness/sharness.sh

all: aggregate

clean: clean-test-results
	@echo "*** $@ ***"
	-rm -rf bin/ipfs

clean-test-results:
	@echo "*** $@ ***"
	-rm -rf test-results

$(T): clean-test-results $(BINS) deps
	@echo "*** $@ ***"
	./$@

aggregate: clean-test-results $(T)
	@echo "*** $@ ***"
	lib/test-aggregate-results.sh

deps: $(SHARNESS)

bin/ubjson:
	@echo "*** linking $@ ***"
	ln -s ../../bin.js bin/ubjson

$(SHARNESS): FORCE
	@echo "*** checking $@ ***"
	lib/install-sharness.sh

bin/%: FORCE
	cd .. && make GOFLAGS=$(GOFLAGS) $@

.PHONY: all clean $(T) aggregate FORCE
