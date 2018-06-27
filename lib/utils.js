const Crypto = require('crypto')

exports.secureCompare = function secureCompare(expected, actual) {
  // Inspired by https://github.com/stripe/stripe-node/blob/edea14167f77b85b741b90b012e0d2e5061f11d2/lib/utils.js#L156
  expected = Buffer.from(expected)
  actual = Buffer.from(actual)

  // return early here if buffer lengths are not equal since timingSafeEqual
  // will throw if buffer lengths are not equal
  if (expected.length !== actual.length) {
    return false
  }

  // use crypto.timingSafeEqual if available (since Node.js v6.6.0),
  // otherwise use our own scmp-internal function.
  if (Crypto.timingSafeEqual) {
    return Crypto.timingSafeEqual(expected, actual)
  }

  let len = expected.length
  let result = 0

  for (let i = 0; i < len; ++i) {
    result |= expected[i] ^ actual[i]
  }

  return result === 0
}
