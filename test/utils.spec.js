const Utils = require('../lib/utils')
const Expect = require('chai').expect

describe('Unit => Utils', function() {
  it('returns true given two equal things', function() {
    Expect(Utils.secureCompare('Bloom', 'Bloom')).to.equal(true)
  })

  it('returns false given two unequal things', function() {
    Expect(Utils.secureCompare('Bloom', 'Stella')).to.equal(false)
  })

  it('throws an error if not given two things to compare', function() {
    Expect(function() {
      Utils.secureCompare('Bloom')
    }).to.throw()
  })
})
