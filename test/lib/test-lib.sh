# Test framework for ubjson
#
# Copyright (c) 2014 Christian Couder
# Copyright (c) 2015 Juan Batiz-Benet
# MIT Licensed; see the LICENSE file in this repository.
#
# We are using sharness (https://github.com/mlafeldt/sharness)
# which was extracted from the Git test framework.

# use the ipfs tool to test against

# add current directory to path, for ubjson tool
PATH=$(pwd)/bin:${PATH}

# set sharness verbosity. we set the env var directly as
# it's too late to pass in --verbose, and --verbose is harder
# to pass through in some cases.
test "$TEST_VERBOSE" = 1 && verbose=t

# assert the `ubjson` we're using is the right one.
if test `which ubjson` != $(pwd)/bin/ubjson; then
	echo >&2 "Cannot find the tests' local ubjson tool."
	echo >&2 "Please check test and ubjson tool installation."
	exit 1
fi

SHARNESS_LIB="lib/sharness/sharness.sh"

. "$SHARNESS_LIB" || {
	echo >&2 "Cannot source: $SHARNESS_LIB"
	echo >&2 "Please check Sharness installation."
	exit 1
}

# Please put ubjson specific shell functions below

if test "$TEST_VERBOSE" = 1; then
	echo '# TEST_VERBOSE='"$TEST_VERBOSE"
fi
