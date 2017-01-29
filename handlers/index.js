'use strict'

const Boom = require('boom')
const config = require('../config')
const runScript = require('../lib/run-script')
const dockerhubCallback = require('../lib/dockerhub-callback')

module.exports = (request, reply) => {
  const hooks = require('../scripts')
  const token = request.params.token
  const payload = request.payload
  let err = false

  if (token !== config.token) {
    err = 'Invalid token'
  } else if (!payload) {
    err = 'Missing payload'
  } else if (!payload.repository) {
    err = 'Missing payload.repository'
  } else if (!payload.repository.name) {
    err = 'Missing payload.repository.name'
  } else if (!hooks[payload.repository.name]) {
    err = `${payload.repository.name} does not exist in scripts/index.js`
  }
  if (err) {
    request.log(['debug'], err)
    reply(Boom.badRequest(err))
  } else {
    reply(payload.repository.name).code(204)

    request.log(['debug'], 'Payload from docker hub:')
    request.log(['debug'], payload)
    request.log(['debug'], `Running hook on repo: ${payload.repository.name}`)

    const options = {
      script: hooks[payload.repository.name],
      callbackUrl: payload.callback_url
    }
    runScript(options)
      .then(dockerhubCallback)
      .then((data) => {
        console.log(data)
        request.log(['debug'], data.script.result)
        request.log(['debug'], data.callback)
      }).catch((err) => {
        console.log(err)
        request.log(['err'], err)
      })
  }
}
