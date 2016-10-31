'use strict'

const tap = require('tap')
const dockerhubCallback = require('../lib/dockerhub-callback')

tap.test('dockerhubCallback missing options', (t) => {
  const options = false
  dockerhubCallback(options, (err) => {
    t.equal(err, 'Missing required input: options', 'Missing options ok')
    t.end()
  })
})

tap.test('dockerhubCallback missing options.callbackUrl', (t) => {
  const options = {}
  dockerhubCallback(options, (err) => {
    t.equal(err, 'Missing required input: options.callbackUrl', 'Missing options.callbackUrl ok')
    t.end()
  })
})

tap.test('dockerhubCallback invalid URI', (t) => {
  const options = {
    callbackUrl: 'wrongurl'
  }
  dockerhubCallback(options, (err) => {
    t.equal(err.message, `Invalid URI "${options.callbackUrl}"`, 'Wrong URL ok')
    t.end()
  })
})

tap.test('dockerhubCallback', (t) => {
  const options = {
    callbackUrl: 'https://maccyber.io/api/test'
  }
  dockerhubCallback(options, (err, data) => {
    if (err) {
      throw err
    }
    t.equal(data.text, `Callback successfully sent to ${options.callbackUrl}`, 'dockerhubCallback ok')
    t.equal(data.response.test, 'ok', 'dockerhubCallback response ok')
    t.end()
  })
})
