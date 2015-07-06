#!/bin/sh

test_description="Test nsjson coding"

. lib/test-lib.sh

test_expect_success "test -h succeeds" '
  ubjson -h >actual_h
'

test_expect_success "test --help succeeds" '
  ubjson --help >actual_help
'

test_expect_success "test -h and --help are the same" '
  test_cmp actual_h actual_help
'

test_expect_success "test help includes basic usage" '
  grep "usage:" actual_h &&
  grep "ubjson -e <foo.json >foo.ubjson" actual_h &&
  grep "ubjson -d >foo.json <foo.ubjson" actual_h
'

test_expect_success "test help includes help option" '
  grep -- "-h, --help" actual_h
'

test_expect_success "test help includes encode option" '
  grep -- "-e, --encode" actual_h
'

test_expect_success "test help includes decode option" '
  grep -- "-d, --decode" actual_h
'

test_expect_success "test help includes pretty option" '
  grep -- "-p, --pretty" actual_h
'

test_expect_success "test help includes ndjson option" '
  grep -- "-n, --ndjson" actual_h
'

test_expect_success "test help includes quiet option" '
  grep -- "-q, --quiet" actual_h
'

test_done
