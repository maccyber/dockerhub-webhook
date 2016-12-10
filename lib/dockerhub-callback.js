'use strict'

const http = require('request')

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      throw Error('Missing required input: options')
    }
    if (!options.callbackUrl) {
      throw Error('Missing required input: options.callbackUrl')
    }
    const httpOptions = {
      json: true,
      body: {
        state: options.state || 'success', // (Required)
        description: options.description || 'Your body is beautiful',
        context: options.context || 'Continuous delivery by dockerhub-webhook'
        // The URL where the results of the operation can be found. Can be retrieved on the Docker Hub.
        // target_url: options.target_url || 'https://someawesomeurl.com'
      },
      method: 'post',
      uri: options.callbackUrl
    }
    http(httpOptions, (err, response, body) => {
      if (err) {
        reject(err)
      } else {
        const message = {
          callback: {
            code: response.statusCode,
            response: body,
            text: `Callback sent to ${options.callbackUrl}`
          },
          script: {
            result: options.description
          }
        }
        resolve(message)
      }
    })
  })
}
