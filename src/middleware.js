import { omitUndefined } from './utils'
import LP_API from './LP_API'
import http from './http'

const DEFAULT_CONFIG_OPTIONS = {
  onUnauthorized: undefined,
}

const DEFAULT_REQUEST_OPTIONS = {
  credentials: 'same-origin',
  csrf:        true,
  mode:        'same-origin',
}

export default function ({ onUnauthorized, ...options }) {

  const defaultConfigOptions = omitUndefined({
    ...DEFAULT_CONFIG_OPTIONS,
    onUnauthorized,
  })

  const defaultRequestOptions = omitUndefined({
    ...DEFAULT_REQUEST_OPTIONS,
    ...options,
  })

  return () => next => action => {

    // ignore undefined or null actions
    if (!action) return

    const lpApi = action[LP_API]

    // Do not process actions without a [LP_API] property
    if (typeof lpApi === 'undefined') {
      return next(action)
    }

    const {
      body,
      credentials,
      csrf,
      headers,
      method,
      mode,
      types,
      url,
      ...rest,
    } = lpApi

    const [ requestType, successType, errorType ] = types

    next({
      type: requestType,
      payload: rest,
    })

    const requestOptions = omitUndefined({
      ...defaultRequestOptions,
      body,
      credentials,
      csrf,
      headers,
      method,
      mode,
    })

    return http(url, requestOptions)
      .catch(error => {
        const response = error.response || error.message || 'There was an error.'
        next({
          type: errorType,
          payload: { ...rest, response },
          error: true,
        })
        if (error.status === 401 && defaultConfigOptions.onUnauthorized) {
          next(defaultConfigOptions.onUnauthorized())
        }
      })
      .then(response =>
        next({
          type: successType,
          payload: { ...rest, response },
        })
      )
  }
}
