const Expect = require('chai').expect
const webHookValidator = require('../lib/validator')
const GenerateSignature = require('./helper').generateSignature

describe('Unit => Validator', function() {
  it('throws an error if not given payload parameter', function() {
    Expect(function() {
      webHookValidator()
    }).to.throw('Parameter payload is required!')
  })

  it('throws an error if not given header parameter', function() {
    Expect(function() {
      webHookValidator({})
    }).to.throw('Parameter header is required!')
  })

  it('throws an error if not given secret parameter', function() {
    Expect(function() {
      webHookValidator({}, 'header', '')
    }).to.throw('Parameter secret is required!')
  })

  it('throws an error if payload parameter is not an object', function() {
    Expect(function() {
      webHookValidator('payload', 'header', '1234')
    }).to.throw('Parameter payload should be an object!')
  })

  it('throws an error if header parameter is not a string', function() {
    Expect(function() {
      webHookValidator({}, 1234, '1234')
    }).to.throw('Parameter header should be a string!')
  })

  it('throws an error if secret parameter is not a string', function() {
    Expect(function() {
      webHookValidator({}, 'header', 1234)
    }).to.throw('Parameter secret should be a string!')
  })

  it('throws an error if tolerance parameter is not a number', function() {
    Expect(function() {
      webHookValidator({}, 'header', '1234', 'lol')
    }).to.throw('Parameter tolerance should be a number!')
  })

  it('throws an error if unable to extract timestamp from header', function() {
    Expect(function() {
      webHookValidator({}, 'header', '1234')
    }).to.throw('Unable to extract timestamp from header!')
  })

  it('throws an error if unable to extract signature from header', function() {
    Expect(function() {
      webHookValidator({}, `t=${Date.now()}`, '1234')
    }).to.throw('Unable to extract signature from header!')
  })

  it('throws an error if signature not matching the expected signature for payload', function() {
    Expect(function() {
      webHookValidator(
        {
          status: 'paid'
        },
        GenerateSignature({ status: 'paid' }, '4321'),
        '1234'
      )
    }).to.throw('Signature not matching the expected signature for payload!')

    Expect(function() {
      webHookValidator(
        {
          status: 'paid'
        },
        GenerateSignature({ status: 'refused' }, '4321'),
        '1234'
      )
    }).to.throw('Signature not matching the expected signature for payload!')

    Expect(function() {
      webHookValidator(
        {
          status: 'paid'
        },
        GenerateSignature({ status: 'refused' }, '1234'),
        '1234'
      )
    }).to.throw('Signature not matching the expected signature for payload!')
  })

  it('returns true if signature match expected signature for payload', function() {
    Expect(
      webHookValidator(
        {
          status: 'paid'
        },
        GenerateSignature({ status: 'paid' }, '1234'),
        '1234'
      )
    ).to.equal(true)
  })

  it('throws an error if timestamp is outside the tolerance zone', function() {
    Expect(function() {
      const Signature = GenerateSignature(
        { status: 'paid' },
        '1234',
        Date.now() / 1000 - 15
      )

      webHookValidator(
        {
          status: 'paid'
        },
        Signature,
        '1234',
        10
      )
    }).to.throw('Timestamp outside the tolerance zone!')
  })
})
