'use strict'

const path = require('path')
const fileExists = require('file-exists')
const exec = require('child_process').exec

module.exports = (options, callback) => {
  if (!options) {
    return callback('Missing required input: options')
  }
  if (!options.script) {
    return callback('Missing required input: options.script')
  }
  const scriptPath = path.resolve('scripts/' + options.script)
  if (!fileExists(scriptPath)) {
    return callback(`File: ${scriptPath} does not exist`)
  }
  exec(scriptPath, (err, stdout, stderr) => {
    if (err) {
      return callback(err)
    } else if (stderr) {
      options.state = 'error'
    }
    const result = err || stderr || stdout
    if (result) {
      options.description = result.substring(0, 200)
      return callback(null, { options: options, result: result })
    }
    return callback(null, true)
  })
}
