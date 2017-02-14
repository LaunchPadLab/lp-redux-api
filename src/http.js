import { camelizeKeys, decamelizeKeys } from './utils'
import HttpError from './http-error'

const CSRF_METHODS = ['PATCH', 'POST', 'PUT']

const DEFAULT_CSRF_SELECTOR = 'csrf-token'

const DEFAULT_OPTIONS = {
  authenticated: false,
  tokenName: 'token',
  body: null,
  csrf: true,
  method: 'GET',
}

export default function (
  url,
  {
    authenticated = DEFAULT_OPTIONS.authenticated,
    body          = DEFAULT_OPTIONS.body,
    csrf          = DEFAULT_OPTIONS.csrf,
    method        = DEFAULT_OPTIONS.method,
    tokenName     = DEFAULT_OPTIONS.tokenName,
  }
) {

  const config = {
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
    method: method,
  }

  let token
  if (authenticated) {
    token = localStorage.getItem(tokenName)
    if (!token) {
      return Promise.reject(new HttpError(401, 'unauthorized', {}))
    }
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  if (CSRF_METHODS.includes(method)) {

    config.mode = 'same-origin'
    config.credentials = 'include'

    if (csrf) {

      const selector = (typeof csrf === 'string')
        ? csrf
        : DEFAULT_CSRF_SELECTOR

      config.headers['X-CSRF-Token'] = csrfToken(selector)
    }
  }

  if (body) {
    config.body = JSON.stringify(decamelizeKeys(body))
  }

  return fetch(url, config)
    .then(response => response.json()
      .then(json => {
        const camelized = camelizeKeys(json.data || json)
        if (response.ok) return camelized
        else throw new HttpError(response.status, response.statusText, camelized)
      })
    )
}

function csrfToken (selector) {
  if (typeof document === 'undefined') return null

  const token = document.querySelector(`meta[name="${selector}"]` )
  if (token && (token instanceof window.HTMLMetaElement)) {
    return token.content
  }
  return null
}
