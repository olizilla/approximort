const morton = require('morton')
const bytewise = require('bytewise')

// max morton input: 16777216
// sensible geo precision, 0.0001

// [123, 19] --> morton number encoded as byte string
function mortify (nums) {
  var nudged = nums.map(nudge)
  var mort = morton(nudged[0], nudged[1])
  return encode(mort)
}

// morton number encoded as byte string --> [123, 19]
function demortify (key) {
  var mort = decode(key)
  var nudged = morton.reverse(mort)
  return nudged.map(denudge)
}

function nudge (num) {
  return (num + 180) * 1000
}

function denudge (num) {
  return (num / 1000) - 180
}

function encode (mort) {
  return bytewise.encode(mort).toString('hex')
}

function decode (key) {
  var buffer = new Buffer(key, 'hex')
  return bytewise.decode(buffer)
}

// FIXME: need to respect the sign of the num!
function boundingBox (nums, dist) {
  var topLeft = mortify(nums.map(function(num){return num - dist}))
  var bottomRight = mortify(nums.map(function(num){return num + dist}))
  return [topLeft, bottomRight]
}

module.exports = mortify
module.exports.revese = demortify
module.exports.box = boundingBox
