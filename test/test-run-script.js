'use strict'

const tap = require('tap')
const Hapi = require('hapi')
const runScript = require('../lib/run-script')
const server = new Hapi.Server()

tap.test('runScript missing options', (t) => {
  const options = false
  const result = runScript(options)
  t.equal(result.message, 'Missing required input: options', 'runScript missing options ok')
  t.end()
})

tap.test('runScript missing options.request', (t) => {
  const options = {}
  const result = runScript(options)
  t.equal(result.message, 'Missing required input: options.request', 'runScript missing options.request ok')
  t.end()
})

tap.test('runScript missing options.script', (t) => {
  const options = {
    request: server
  }
  const result = runScript(options)
  t.equal(result.message, 'Missing required input: options.script', 'runScript missing options.script ok')
  t.end()
})

tap.test('runScript script do not exist', (t) => {
  const options = {
    request: server,
    script: 'dengalevandrer'
  }
  const result = runScript(options)
  t.match(result.message, 'does not exist', 'runScript script do not exist ok')
  t.end()
})
