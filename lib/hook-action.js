'use strict'

const runScript = require('../lib/run-script')
const dockerhubCallback = require('../lib/dockerhub-callback')

module.exports = (options, callback) => {
  if (!options) {
    return callback('Missing required input: options')
  }
  if (!options.callbackUrl) {
    return callback('Missing required input: options.callbackUrl')
  }
  if (!options.script) {
    return callback('Missing required input: options.script')
  }
  runScript(options, (err, data) => {
    if (err) {
      return callback(err)
    } else {
      dockerhubCallback(data.options, (err, result) => {
        if (err) {
          return callback(err)
        } else {
          return callback(null, { callback: result.text, script: data.result })
        }
      })
    }
  })
}
