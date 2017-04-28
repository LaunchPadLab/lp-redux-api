import http from './http'

/**
 * 
 * A lightweight wrapper around the {@link http} module.
 * Provides functions to make API requests with specified HTTP methods.
 *
 * The functions are as follows:
 * - `get(url, options)` sends a `'GET'` request
 * - `patch(url, body, options)` sends a `'PATCH'` request
 * - `post(url, body, options)` sends a `'POST'` request
 * - `put(url, body, options)` sends a `'PUT'` request
 * - `destroy(url, body, options)` sends a `'DELETE'` request
 * - `call(url, method, body, options)` sends a request with specified method
 *
 * Each function can be passed an `options` object, which will eventually be forwarded
 * to the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 * 
 * Each function returns a promise, which will either resolve with a response object
 * or reject with an {@link HTTPError}.
 *
 * @name api
 * @type Object
 * 
 * @example
 * 
 * function getUsers () {
 *   return api.get('/users', { credentials: 'include' })
 * }
 * 
 * getUsers()
 *    .then(res => console.log('The users are', res))
 *    .catch(err => console.log('An error occurred!', err))
 */

function requestWithMethod (url, body, opts, method) {
  return http(url, { ...opts, body, method })
}

export function get(url, opts = {}) {
  const body = null
  return requestWithMethod(url, body, opts, 'GET')
}

export function patch(url, body, opts = {}) {
  return requestWithMethod(url, body, opts, 'PATCH')
}

export function post(url, body, opts = {}) {
  return requestWithMethod(url, body, opts, 'POST')
}

export function put(url, body, opts = {}) {
  return requestWithMethod(url, body, opts, 'PUT')
}

export function destroy(url, body, opts = {}) {
  return requestWithMethod(url, body, opts, 'DELETE')
}

export function call(url, method, body, opts = {}) {
  return requestWithMethod(url, body, opts, method)
}

