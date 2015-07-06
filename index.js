// passthrough to ubjson
var ubjson = require('ubjson')
var duplexify = require('duplexify')
var through2 = require('through2')
var Readable = require('stream').Readable
var PassThrough = require('stream').PassThrough

var x = module.exports = {}
x.decodeStream = decodeStream
x.encodeStream = encodeStream
x.decode = decode
x.encode = encode

// we use two passthroughs because the original ubjson stream doesnt even
// have pipe. probably should just rewrite ubjson/ubjson-stream.js
function decodeStream() {
  var ins = new PassThrough
  var outs = new PassThrough({ objectMode: true })
  var ubs = new ubjson.Stream(ins)
  pipeUBS(ubs, outs)
  return duplexify.obj(ins, outs)
}

function encodeStream() {
  return through2.obj(function (obj, enc, cb) {
    encode(obj, cb)
  })
}


var limit = 33554432 // 32MB
function encode(doc, cb) {
  for (var size = 128; size <= limit; size *= 2) {
    var buf = new Buffer(size)
    try {
      var offset = ubjson.packToBufferSync(doc, buf)
      buf = buf.slice(0, offset)

      return cb(null, buf)
    } catch(e) {
      if (e.toString().indexOf("is not a function") !== -1) {
        // ubjson.packToBufferSync throws if buffer isnt big enough...
        // try a larger buffer...
        // this is nasty.
        continue
      }

      return cb(e) // some other error
    }
  }
  return cb(new Error("buffer size reached limit: " + limit))
}

function decode(buf, cb) {
  ubjson.unpackBuffer(buf, cb)
}

function pipeUBS(ubs, pst) {
  ubs.on('value', function(data) {
    pst.write(data)
  })

  ubs.on('end', function() {
    pst.end()
  })

  ubs.on('data', function(remaining) {
    pst.emit('error', "remaining data")
  })

  // fwd the error in this case.
  ubs.on('error', function(err) {
    pst.emit('error', err)
  })

  return pst
}