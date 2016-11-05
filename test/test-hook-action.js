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

tap.test('hookAction script do not exist', (t) => {
  const options = {
    callbackUrl: 'wrongurl',
    script: 'dengalevandrer'
  }
  hookAction(options, (err) => {
    t.match(err, 'does not exist', 'runScript script do not exist ok')
    t.end()
  })
})

tap.test('hookAction dockerhubCallback fail', (t) => {
  const options = {
    callbackUrl: 'wrongurl',
    script: 'hello.sh'
  }
  hookAction(options, (err) => {
    t.equal(err.message, `Invalid URI "${options.callbackUrl}"`, 'Wrong URL ok')
    t.end()
  })
})

tap.test('hookAction ok', (t) => {
  const options = {
    callbackUrl: 'https://maccyber.io/api/test',
    script: 'hello.sh'
  }
  hookAction(options, (err, data) => {
    if (err) {
      throw err
    }
    t.equal(data.callback, `Callback sent to ${options.callbackUrl}`, 'hookAction dockerhubCallback ok')
    t.equal(data.script, 'Running dummy script\n', 'hookAction script ok')
    t.end()
  })
})

