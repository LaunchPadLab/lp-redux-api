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
      ...rest,
    } = lpApi

    const [ requestType, successType, errorType ] = types

    const requestAuthenticated = typeof rest.authenticated === 'undefined'
      ? authenticated
      : rest.authenticated

    delete rest.authenticated

    next({
      type: requestType,
      payload: rest,
    })

    const url = (root ? root : '') + endpoint

    const requestOptions = {
      authenticated: requestAuthenticated,
      body,
      csrf,
      method,
      tokenName,
    }

    return http(url, requestOptions)
      .then(response => {
        try {
          return next({
            type: successType,
            payload: { ...rest, response },
          })
        } catch (e) {
          // Will log errors, but don't want to dispatch a 'failure' action
          /*eslint no-console: 0*/
          console.error(e)
        }
      })
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
