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
      actions,
      types,
      url,
      ...rest,
    } = lpApi

    // Alias 'actions' with 'types' for backwards compatibility
    const [ requestAction, successAction, errorAction ] = actions || types

    // Send request action
    if (requestAction) {
      next(parseAction({
        action: requestAction,
        payload: rest,
      }))
    }

    const requestOptions = omitUndefined({
      ...defaultRequestOptions,
      body,
      credentials,
      csrf,
      headers,
      method,
      mode,
    })

    // Make the request
    return http(url, requestOptions)
      .catch(error => {
        const response = error.response || error.message || 'There was an error.'
        
        // Send error action
        if (errorAction) {
          next(parseAction({
            action: errorAction,
            payload: { ...rest, response },
            error: true,
          }))
        }

        if (error.status === 401 && defaultConfigOptions.onUnauthorized) {
          next(defaultConfigOptions.onUnauthorized())
        }
      })
      .then(response => {

        // Send success action
        if (successAction) {
          next(parseAction({
            action: successAction,
            payload: { ...rest, response },
          }))
        }
        
      })
  }
}

// Create an action from an action "definition."
const parseAction = ({ action, payload={}, error=false }) => {
  // If it's an action creator, create the action
  if (typeof action === 'function') return action(payload.response)
  // If it's an action object return the action
  if (typeof action === 'object') return action
  // Otherwise, create a "default" action object with the given type
  if (typeof action === 'string') return { type: action, payload, error }
  throw 'Invalid action definition (must be function, object or string).'
}


