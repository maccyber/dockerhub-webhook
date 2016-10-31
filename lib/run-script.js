'use strict'

const path = require('path')
const fileExists = require('file-exists')
const dockerhubCallback = require('./dockerhub-callback')
const exec = require('child_process').exec

module.exports = (options) => {
  if (!options) {
    return new Error('Missing required input: options')
  }
  if (!options.request) {
    return new Error('Missing required input: options.request')
  }
  if (!options.script) {
    return new Error('Missing required input: options.script')
  }
  const request = options.request
  const cmd = path.resolve('scripts/' + options.script)
  if (!fileExists(cmd)) {
    request.log(['debug'], `File: ${cmd} does not exist`)
    return new Error(`File: ${cmd} does not exist`)
  }
  request.log(['debug'], `Running script: ${cmd}`)
  exec(cmd, (err, stdout, stderr) => {
    if (err || stderr) {
      options.state = 'error'
    }
    const result = err || stderr || stdout
    if (result) {
      options.description = result.substring(0, 200)
      request.log(['debug'], result)
    }
    if (options.callbackUrl) {
      dockerhubCallback(options, (err, data) => {
        if (err) {
          request.log(['error'], err)
        }
        request.log(['debug'], data.text)
        request.log(['debug'], data.response)
        return
      })
    } else {
      return
    }
  })
}

