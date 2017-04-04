import fetch from 'isomorphic-fetch'
import { camelizeKeys, decamelizeKeys, omitUndefined } from './utils'
import HttpError from './http-error'

const CSRF_METHODS = ['PATCH', 'POST', 'PUT', 'DELETE']

const DEFAULT_CSRF_SELECTOR = 'csrf-token'

export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
}

const DEFAULT_OPTIONS = {
  credentials: 'same-origin',
  csrf: true,
  headers: DEFAULT_HEADERS,
  mode: 'same-origin',
}

export default function (url, options) {

  const config = omitUndefined({
    ...DEFAULT_OPTIONS,
    ...options
  })

  const csrf = config.csrf

  delete config.csrf

  if (config.body)
    config.body = JSON.stringify(decamelizeKeys(config.body))

  if (csrf && CSRF_METHODS.includes(config.method)) {

    const selector = (typeof csrf === 'string')
      ? csrf
      : DEFAULT_CSRF_SELECTOR

    config.headers['X-CSRF-Token'] = csrfToken(selector)
  }

  return fetch(url, config)
    .then(response => response.json()
      .then(json => {
        const camelized = camelizeKeys(json.data || json)
        if (response.ok) return camelized
        throw new HttpError(response.status, response.statusText, camelized)
      })
    )
}

function csrfToken(selector) {
  if (typeof document === 'undefined') return null

  const token = document.querySelector(`meta[name="${selector}"]`)
  if (token && (token instanceof window.HTMLMetaElement)) {
    return token.content
  }
  return null
}
