// passthrough to ubjson
var ubjson = require('ubjson')
var through2 = require('through2')

function decodeStream() {
  return through2.obj(function (obj, enc, cb) {
    decode(obj, cb)
  })
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

var x = module.exports = {}
x.decodeStream = decodeStream
x.encodeStream = encodeStream
x.decode = decode
x.encode = encode
