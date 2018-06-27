const Crypto = require('crypto')
const Utils = require('./utils')

module.exports = function webHookValidator(payload, header, secret, tolerance) {
  tolerance = tolerance || 300

  if (!payload) {
    throw new Error('Parameter payload is required!')
  }

  if (!header) {
    throw new Error('Parameter header is required!')
  }

  if (!secret) {
    throw new Error('Parameter secret is required!')
  }

  if (typeof payload !== 'object') {
    throw new Error('Parameter payload should be an object!')
  }

  if (typeof header !== 'string') {
    throw new Error('Parameter header should be a string!')
  }

  if (typeof secret !== 'string') {
    throw new Error('Parameter secret should be a string!')
  }

  if (typeof tolerance !== 'number') {
    throw new Error('Parameter tolerance should be a number!')
  }

  const JsonPayload = JSON.stringify(payload)

  const ParsedHeader = header.split(',').reduce(
    (accum, item) => {
      var kv = item.split('=')

      if (kv[0] === 't') {
        accum.timestamp = kv[1]
      }

      if (kv[0] === 's') {
        accum.signature = kv[1]
      }

      return accum
    },
    {
      timestamp: -1,
      signature: ''
    }
  )

  if (ParsedHeader.timestamp === -1) {
    throw new Error('Unable to extract timestamp from header!')
  }

  if (ParsedHeader.signature === '') {
    throw new Error('Unable to extract signature from header!')
  }

  const GeneratedSignature = Crypto.createHmac('sha256', secret)
    .update(ParsedHeader.timestamp + '.' + JsonPayload, 'utf8')
    .digest('hex')

  if (!Utils.secureCompare(ParsedHeader.signature, GeneratedSignature)) {
    throw new Error(
      'Signature not matching the expected signature for payload!'
    )
  }

  const TimestampAge = Math.floor(Date.now() / 1000) - ParsedHeader.timestamp

  if (tolerance > 0 && TimestampAge > tolerance) {
    throw new Error('Timestamp outside the tolerance zone!')
  }

  return true
}
