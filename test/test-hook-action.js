'use strict'

const tap = require('tap')
const hookAction = require('../lib/hook-action')

tap.test('hookAction missing options', (t) => {
  const options = false
  hookAction(options, (err) => {
    t.equal(err, 'Missing required input: options', 'Missing options ok')
    t.end()
  })
})

tap.test('hookAction missing options.callbackUrl', (t) => {
  const options = {}
  hookAction(options, (err) => {
    t.equal(err, 'Missing required input: options.callbackUrl', 'Missing options.callbackUrl ok')
    t.end()
  })
})

tap.test('hookAction missing options.script', (t) => {
  const options = {
    callbackUrl: true
  }
  hookAction(options, (err) => {
    t.equal(err, 'Missing required input: options.script', 'Missing options.script ok')
    t.end()
  })
})

