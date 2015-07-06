#!/bin/sh

test_description="Test single document coding"

. lib/test-lib.sh

test_expect_success "test encoding succeeds" '
  ubjson -e <../data/a.json >actual
'

test_expect_success "test encoding worked" '
  test_cmp actual ../data/a.ubjson
'

test_expect_success "test decoding succeeds" '
  ubjson -d <../data/a.ubjson >actual
'

test_expect_success "test decoding worked" '
  test_cmp actual ../data/a2.json
'

test_expect_success "test JUJ roundtrip succeeds" '
  ubjson -e <../data/a.json | ubjson -d >actual
'

test_expect_success "test JUJ roundtrip worked" '
  test_cmp actual ../data/a2.json
'

test_expect_success "test JUJ roundtrip (pretty) succeeds" '
  ubjson -e <../data/a.json | ubjson -d -p >actual
'

test_expect_success "test JUJ roundtrip (pretty) worked" '
  test_cmp actual ../data/a3.json
'

test_expect_success "test UJU roundtrip succeeds" '
  ubjson -d <../data/a.ubjson | ubjson -e >actual
'

test_expect_success "test UJU roundtrip worked" '
  test_cmp actual ../data/a.ubjson
'

test_expect_success "test UJU roundtrip (pretty) succeeds" '
  ubjson -d <../data/a.ubjson | ubjson -e >actual
'

test_expect_success "test UJU roundtrip (pretty) worked" '
  test_cmp actual ../data/a.ubjson
'

test_done
