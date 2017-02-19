import http from './http'

const OPTIONS = {
  method: 'GET',
  body: null,
}

export function get (url) {
  return http(url, {
    ...OPTIONS,
  })
}

export function patch (url, body) {
  return http(url, {
    ...OPTIONS,
    body,
    method: 'PATCH',
  })
}

export function post (url, body) {
  return http(url, {
    ...OPTIONS,
    body,
    method: 'POST',
  })
}

export function put (url, body) {
  return http(url, {
    ...OPTIONS,
    body,
    method: 'PUT',
  })
}

export function call (url, method, body) {
  return http(url, {
    ...OPTIONS,
    body,
    method,
  })
}
