#!/usr/bin/env node

var through2 = require('through2')
var concat = require('concat-stream')
var ndjson = require('ndjson')
var ubjson = require('ubjson')
var ubjsonStream = require('./index')

var usage = 'usage: ubjson -e <foo.json >foo.ubjson\n'
          + '       ubjson -d >foo.json <foo.ubjson'

var opt = require('optimist')
  .usage(usage)
  .describe('h', 'this help text')
  .describe('e', 'encode json to ubjson')
  .describe('d', 'decode ubjson to json')
  .describe('p', 'pretty json output')
  .describe('q', 'no unnecessary output (newline)')
  .describe('n', 'newline delimited json')
  .alias('h', 'help')
  .alias('e', 'encode')
  .alias('d', 'decode')
  .alias('p', 'pretty')
  .alias('q', 'quiet')
  .alias('n', 'ndjson')

var argv = opt.argv

if (opt.argv.h || !opt.argv.d && !opt.argv.e) {
  process.stdout.write(opt.help())
  process.exit(0)
}

if (opt.argv.e && opt.argv.d) {
  die("error: encode and decode options mutually exclusive\n\n" + opt.help())
}

if (opt.argv.n) {
  if (opt.argv.e) {

    process.stdin
      .pipe(ndjson.parse({strict:false}))
      .pipe(ubjsonStream.encodeStream())
      .pipe(process.stdout)

  } else if (opt.argv.d) {

    // hack to deal with fake stream
    addPipe(new ubjson.Stream(process.stdin))
      .pipe(ndjson.serialize({strict:false}))
      .pipe(process.stdout)

  } else {
    die("this should not be reached")
  }

} else { // not ndjson

  if (opt.argv.e) {

    process.stdin.pipe(concat(function(doc) {
      doc = JSON.parse(doc)
      ubjsonStream.encode(doc, function(err, buf) {
        if (err) die(err)
        process.stdout.write(buf)
      })
    }))

  } else if (opt.argv.d) {

    var done = false
    process.stdin.pipe(concat(function(buf) {
      ubjsonStream.decode(buf, function(err, doc) {
        if (err) die(err)
        if (done) die("error: multiple ubjects. use -n")
        done = true

        process.stdout.write(stringify(doc))
        endNewline()
      })
    }))

  }
}

function addPipe(s1) {
  s1.pipe = function(s2) {
    return pipe.call(s1, s2)
  }
  return s1
}

function pipe(s2) {
  this.on('value', function(data) {
    s2.write(data)
  })

  this.on('end', function() {
    s2.end()
  })

  this.on('data', function(remaining) {
    die("parse error")
  })

  this.on('error', function(err) {
    die(err)
  })

  return s2
}

function endNewline() {
  if (!opt.argv.q) {
    process.stdout.write('\n')
  }
}

function stringify(doc) {
  if (opt.argv.p) {
    return JSON.stringify(doc, null, 2)
  } else {
    return JSON.stringify(doc)
  }
}

function die(err) {
  process.stderr.write(err)
  process.stderr.write('\n')
  process.exit(1)
}
