import LP_API from './LP_API'
import http from './http'

const DEFAULT_OPTIONS = {
  // http
  authenticated: false,
  csrf:          true,
  tokenName:    'token',
  // middleware
  onUnauthorized: null,
  root:           null,
}

export default function ({
  authenticated  = DEFAULT_OPTIONS.authenticated,
  csrf           = DEFAULT_OPTIONS.csrf,
  tokenName      = DEFAULT_OPTIONS.tokenName,
  onUnauthorized = DEFAULT_OPTIONS.onUnauthorized,
  root           = DEFAULT_OPTIONS.root,
}) {

  return () => next => action => {

    // ignore undefined or null actions
    if (!action) return

    const lpApi = action[LP_API]

    // Do not process actions without a [LP_API] property
    if (typeof lpApi === 'undefined') {
      return next(action)
    }

    const {
      types,
      endpoint,
      method,
      body,
      authenticated: requestAuthenticated,
      ...rest,
    } = lpApi

    const [ requestType, successType, errorType ] = types

    next({
      type: requestType,
      payload: rest,
    })

    const url = (root ? root : '') + endpoint

    const requestOptions = {
      authenticated: (typeof requestAuthenticated === 'undefined') ? authenticated : requestAuthenticated,
      body,
      csrf,
      method,
      tokenName,
    }

    return http.call(url, requestOptions)
      .then(response =>
        next({
          type: successType,
          payload: { ...rest, response },
        })
      )
      .catch(error => {
        const response = error.response || error.message || 'There was an error.'
        next({
          type: errorType,
          payload: { ...rest, response },
          error: true,
        })
        if (error.status === 401 && onUnauthorized) {
          next(onUnauthorized())
        }
      })
  }
}
