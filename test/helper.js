const Crypto = require('crypto')

exports.generateSignature = function generateSignature(payload, secret, ts) {
  const Timestamp = ts || Math.floor(Date.now() / 1000)
  const Signature = Crypto.createHmac('sha256', secret)
    .update(`${Timestamp}.${JSON.stringify(payload)}`, 'utf8')
    .digest('hex')

  return `t=${Timestamp},s=${Signature}`
}
