'use strict'

const config = require('../config')
const runScript = require('../lib/run-script')
const Boom = require('boom')

module.exports = (request, reply) => {
  const hooks = require('../scripts')
  const token = request.params.token
  const payload = request.payload
  let err

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
    request.log(['debug'], 'Payload from docker hub:')
    request.log(['debug'], payload)
    request.log(['debug'], `Updating repo: ${payload.repository.name}`)
    const options = {
      script: hooks[payload.repository.name],
      callbackUrl: payload.callback_url,
      request: request
    }
    reply(payload.repository.name).code(204)
    runScript(options)
  }
}
