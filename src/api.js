import http from './http'

const OPTIONS = {
  method: 'GET',
  body: null,
  authenticated: true,
}

export function get (url, authenticated) {
  return http(url, {
    ...OPTIONS,
    authenticated,
  })
}

export function patch (url, body, authenticated) {
  return http(url, {
    ...OPTIONS,
    authenticated,
    body,
    method: 'PATCH',
  })
}

export function post (url, body, authenticated) {
  return http(url, {
    ...OPTIONS,
    authenticated,
    body,
    method: 'POST',
  })
}

export function put (url, body, authenticated) {
  return http(url, {
    ...OPTIONS,
    authenticated,
    body,
    method: 'PUT',
  })
}

export function call (url, method, body, authenticated) {
  return http(url, {
    ...OPTIONS,
    authenticated,
    body,
    method,
  })
}
