import http from './http'

const OPTIONS = {
  method: 'GET',
  body: null,
}

export function get(url, opts = {}) {
  return http(url, {
    ...OPTIONS,
    ...opts,
  })
}

export function patch(url, body, opts = {}) {
  return http(url, {
    ...OPTIONS,
    ...opts,
    body,
    method: 'PATCH',
  })
}

export function post(url, body, opts = {}) {
  return http(url, {
    ...OPTIONS,
    ...opts,
    body,
    method: 'POST',
  })
}

export function put(url, body, opts = {}) {
  return http(url, {
    ...OPTIONS,
    ...opts,
    body,
    method: 'PUT',
  })
}

export function destroy(url, body, opts = {}) {
  return http(url, {
    ...OPTIONS,
    ...opts,
    body,
    method: 'DELETE',
  })
}

export function call(url, method, body, opts = {}) {
  return http(url, {
    ...OPTIONS,
    ...opts,
    body,
    method,
  })
}
