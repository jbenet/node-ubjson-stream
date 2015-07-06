#!/bin/sh

test_description="Test nsjson coding"

. lib/test-lib.sh

test_expect_success "test single encoding fails" '
  test_must_fail ubjson -e <../data/b.ndjson
'

test_expect_success "test single decoding fails" '
  test_must_fail ubjson -d <../data/b.ubjsons
'

test_expect_success "test encoding succeeds" '
  ubjson -e -n <../data/b.ndjson >actual
'

test_expect_success "test encoding worked" '
  test_cmp actual ../data/b.ubjsons
'

test_expect_success "test decoding succeeds" '
  ubjson -d -n <../data/b.ubjsons >actual
'

test_expect_success "test decoding worked" '
  test_cmp actual ../data/b.ndjson
'

test_expect_success "test JUJ roundtrip succeeds" '
  ubjson -en <../data/b.ndjson | ubjson -dn >actual
'

test_expect_success "test JUJ roundtrip worked" '
  test_cmp actual ../data/b.ndjson
'

test_expect_success "test JUJ roundtrip (pretty) succeeds" '
  ubjson -en <../data/b.ndjson | ubjson -dn -p >actual
'

test_expect_success "test JUJ roundtrip (pretty) did nothing" '
  test_cmp actual ../data/b.ndjson
'

test_expect_success "test UJU roundtrip succeeds" '
  ubjson -dn <../data/b.ubjsons | ubjson -en >actual
'

test_expect_success "test UJU roundtrip worked" '
  test_cmp actual ../data/b.ubjsons
'

test_expect_success "test UJU roundtrip (pretty) succeeds" '
  ubjson -dn <../data/b.ubjsons | ubjson -en -p >actual
'

test_expect_success "test UJU roundtrip (pretty) worked" '
  test_cmp actual ../data/b.ubjsons
'

test_done
