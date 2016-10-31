'use strict'

const Boom = require('boom')
const config = require('../config')
const hookAction = require('../lib/hook-action')

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
    reply(payload.repository.name).code(204)

    request.log(['debug'], 'Payload from docker hub:')
    request.log(['debug'], payload)
    request.log(['debug'], `Running hook on repo: ${payload.repository.name}`)

    const options = {
      script: hooks[payload.repository.name],
      callbackUrl: payload.callback_url
    }
    hookAction(options, (err, data) => {
      if (err) {
        request.log(['err'], err)
      } else {
        request.log(['debug'], data.script)
        request.log(['debug'], data.callback)
      }
    })
  }
}
