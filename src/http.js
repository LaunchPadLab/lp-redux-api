import fetch from 'isomorphic-fetch'
import { getToken } from './csrf'
import { camelizeKeys, decamelizeKeys, omitUndefined } from './utils'
import HttpError from './http-error'
import url from 'url'

export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
}

const DEFAULT_OPTIONS = {
  credentials: 'same-origin',
  headers: DEFAULT_HEADERS,
  mode: 'same-origin',
}

export default function (endpoint, { root='', csrf=true, ...options }) {

  const config = omitUndefined({
    ...DEFAULT_OPTIONS,
    ...options
  })

  if (config.body) config.body = JSON.stringify(decamelizeKeys(config.body))

  const csrfToken = getToken(csrf, config.method)
  if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken

  // Build full URL
  const endpointUrl = url.resolve(root, endpoint)

  return fetch(endpointUrl, config)
    .then(response => response.json()
      .then(json => {
        const camelized = camelizeKeys(json.data || json)
        if (response.ok) return camelized
        throw new HttpError(response.status, response.statusText, camelized)
      })
    )
}
