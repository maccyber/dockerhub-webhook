const tap = require('tap')
const Hapi = require('hapi')
const config = require('../config')
const routes = require('../routes')
const dockerhubCallback = require('../lib/dockerhub-callback')

const server = new Hapi.Server()
server.connection()
server.route(routes)

tap.equal(config.port, 3000, 'Default server port ok')
tap.equal(config.route, '/api', 'Default route ok')
tap.equal(config.token, 'abc123', 'Default token ok')

tap.test('GET /', (t) => {
  server.inject('/', (res) => {
    tap.equal(res.statusCode, 200, 'Status code ok')
    tap.equal(res.result.message, '(Nothing but) Flowers', 'Message ok')
    t.end()
  })
})

tap.test('Not found', (t) => {
  const route = `${config.route}/${config.token}`
  server.inject(route, (res) => {
    tap.equal(res.statusCode, 404, '404 returned OK')
    t.end()
  })
})

tap.test('Invalid token or dockerhub JSON', (t) => {
  const options = {
    method: 'POST',
    url: `${config.route}/${config.token}`,
    payload: {}
  }
  server.inject(options, (res) => {
    tap.equal(res.statusCode, 404, 'Invalid token or dockerhub JSON ok')
    t.end()
  })
})

tap.test('does not exist in scripts/index.js', (t) => {
  const file = require('./data/dockerhub.json')
  file.repository.name = 'wrong'
  const options = {
    method: 'POST',
    url: `${config.route}/${config.token}`,
    payload: file
  }
  server.inject(options, (res) => {
    tap.equal(res.statusCode, 404, 'Repo is not configured config ok')
    t.end()
  })
})

tap.test('Valid dockerhub JSON', (t) => {
  const file = require('./data/dockerhub.json')
  file.repository.name = 'testhook'
  const options = {
    method: 'POST',
    url: `${config.route}/${config.token}`,
    payload: file
  }
  server.inject(options, (res) => {
    tap.equal(res.statusCode, 204, 'Valid dockerhub JSON ok')
    t.end()
  })
})

tap.test('dockerhubCallback missing options', (t) => {
  const options = false
  dockerhubCallback(options, (err) => {
    tap.equal(err.message, 'Missing required input: options', 'Missing options ok')
    t.end()
  })
})

tap.test('dockerhubCallback missing options.callbackUrl', (t) => {
  const options = {}
  dockerhubCallback(options, (err) => {
    tap.equal(err.message, 'Missing required input: options.callbackUrl', 'Missing options.callbackUrl ok')
    t.end()
  })
})

tap.test('dockerhubCallback invalid URI', (t) => {
  const options = {
    callbackUrl: 'wrongurl'
  }
  dockerhubCallback(options, (err) => {
    tap.equal(err.message, `Invalid URI "${options.callbackUrl}"`, 'Wrong URL ok')
    t.end()
  })
})

tap.test('dockerhubCallback', (t) => {
  const options = {
    callbackUrl: 'https://maccyber.io/api/test'
  }
  dockerhubCallback(options, (err, data) => {
    if (err) {
      throw err
    }
    tap.equal(data.text, `Callback sent to ${options.callbackUrl}`, 'dockerhubCallback ok')
    tap.equal(data.response.test, 'ok', 'dockerhubCallback response ok')
    t.end()
  })
})
