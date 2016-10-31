'use strict'

const tap = require('tap')
const runScript = require('../lib/run-script')

tap.test('runScript missing options', (t) => {
  const options = false
  runScript(options, (err) => {
    t.equal(err, 'Missing required input: options', 'runScript missing options ok')
    t.end()
  })
})

tap.test('runScript missing options.script', (t) => {
  const options = {}
  runScript(options, (err) => {
    t.equal(err, 'Missing required input: options.script', 'runScript missing options.script ok')
    t.end()
  })
})

tap.test('runScript script do not exist', (t) => {
  const options = {
    script: 'dengalevandrer'
  }
  runScript(options, (err) => {
    t.match(err, 'does not exist', 'runScript script do not exist ok')
    t.end()
  })
})

tap.test('runScript run fail script', (t) => {
  const options = {
    script: 'fail.sh'
  }
  runScript(options, (err, data) => {
    t.equal(err.code, 1, 'runScript fails ok')
    t.end()
  })
})

tap.test('runScript run through', (t) => {
  const options = {
    script: 'hello.sh'
  }
  runScript(options, (err, data) => {
    if (err) {
      throw err
    }
    t.equal(data.result, 'Running dummy script\n', 'runScript runs ok')
    t.end()
  })
})
