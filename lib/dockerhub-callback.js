'use strict'

const http = require('request')

module.exports = (options, callback) => {
  if (!options) {
    return callback(new Error('Missing required input: options'), null)
  }
  if (!options.callbackUrl) {
    return callback(new Error('Missing required input: options.callbackUrl'), null)
  }
  const httpOptions = {
    json: true,
    body: {
      state: options.state || 'success', // (Required)
      description: options.description || 'Your body is beautiful',
      context: options.context || 'Continuous delivery by dockerhub-webhook-api'
      // The URL where the results of the operation can be found. Can be retrieved on the Docker Hub.
      // target_url: options.target_url || 'https://someawesomeurl.com'
    },
    method: 'post',
    uri: options.callbackUrl
  }
  http(httpOptions, (err, response, body) => {
    if (err) {
      return callback(err)
    }
    const message = {
      response: body,
      text: `Callback sent to ${options.callbackUrl}`
    }
    return callback(null, message)
  })
}

