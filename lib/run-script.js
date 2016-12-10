'use strict'

const path = require('path')
const fileExists = require('file-exists')
const exec = require('child_process').exec

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      throw Error('Missing required input: options')
    }
    if (!options.script) {
      throw Error('Missing required input: options.script')
    }
    const scriptPath = path.resolve('scripts/' + options.script)
    if (!fileExists(scriptPath)) {
      throw Error(`File: ${scriptPath} does not exist`)
    }
    exec(scriptPath, (err, stdout, stderr) => {
      if (err || stderr) {
        options.state = 'error'
      }
      const result = stderr || stdout
      options.description = result ? result.substring(0, 200) : 'Empty result'
      resolve(options)
    })
  })
}
