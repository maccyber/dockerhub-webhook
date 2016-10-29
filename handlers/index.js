'use strict'

const config = require('../config')
const runScript = require('../lib/run-script')

module.exports = (request, reply) => {
  const hooks = require('../scripts')
  const token = request.params.token
  const payload = request.payload
  if (token === config.token && payload && payload.repository && payload.repository.name) {
    request.log(['debug'], 'Payload from docker hub:')
    request.log(['debug'], payload)
    const repo = payload.repository.name
    if (hooks[repo]) {
      request.log(['debug'], `Updating repo: ${repo}`)
      const options = {
        script: hooks[repo],
        callbackUrl: payload.callback_url,
        request: request
      }
      reply(repo).code(204)
      runScript(options)
    } else {
      request.log(['debug'], `${repo} does not exist in scripts/index.js`)
      reply().code(404)
    }
  } else {
    request.log(['debug'], 'Invalid token or dockerhub JSON')
    reply().code(404)
  }
}
