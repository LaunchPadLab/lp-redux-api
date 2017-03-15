import { omitUndefined } from './utils'
import LP_API from './LP_API'
import http from './http'
import { lpApiRequest, lpApiSuccess, lpApiFailure } from './actions'

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
      requestKey='REQUEST',
      ...rest,
    } = lpApi

    // Alias 'actions' with 'types' for backwards compatibility
    const actionTypes = actions || types

    // Make sure required options exist
    validateOptions({ url, actionTypes })

    const [ requestAction, successAction, failureAction ] = actionTypes

    // Send request action to API reducer
    next(lpApiRequest(requestKey))

    // Send user-specified request action
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
        const response = error

        // Send failure action to API reducer
        next(lpApiFailure(requestKey))

        // Send user-specified failure action
        if (failureAction) {
          next(parseAction({
            action: failureAction,
            payload: { ...rest, response },
            error: true,
          }))
        }

        if (error.status === 401 && defaultConfigOptions.onUnauthorized) {
          next(defaultConfigOptions.onUnauthorized())
        }
      })
      .then(response => {

        // Send success action to API reducer
        next(lpApiSuccess(requestKey))

        // Send user-specified success action
        if (successAction) {
          next(parseAction({
            action: successAction,
            payload: { ...rest, response },
          }))
        }

      })
  }
}

function validateOptions ({ url, actionTypes }) {
  if (!url || typeof url !== 'string') throw 'Must provide string \'url\' argument'
  if (!actionTypes || !Array.isArray(actionTypes)) throw 'Must provide an array of actions. Use \'api\' module for requests with no associated actions.'
}

// Create an action from an action "definition."
function parseAction ({ action, payload={}, error=false }) {
  switch (typeof action) {
  // If it's an action creator, create the action
  case 'function': return action(payload.response)
  // If it's an action object return the action
  case 'object': return action
  // Otherwise, create a "default" action object with the given type
  case 'string': return { type: action, payload, error }
  default: throw 'Invalid action definition (must be function, object or string).'
  }
}
