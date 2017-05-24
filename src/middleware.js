import { http, omitUndefined } from './utils'
import LP_API from './LP_API'
import { lpApiRequest, lpApiSuccess, lpApiFailure } from './actions'

/**
 * ### Actions
 * At a high level, `lp-redux-api` actions contain the following information:
 * - The URL of an API request to execute
 * - Any extra request details
 * - One or many actions to dispatch based on the status of the request
 *
 * These actions are keyed using the {@link LP_API} symbol so that the middleware knows to handle them. Here's an example of a simple action creator:
 * ```
 * import { LP_API } from '@launchpadlab/lp-redux-api'
 *
 * export function fetchUser (id) {
 *   return {
 *     [LP_API]: {
 *       url: `users/${id}`,
 *       actions: ['USER_REQUEST', 'USER_SUCCESS', 'USER_FAILURE'],
 *       ... any more configuration options 
 *     },
 *   }
 * }
 * ```
 * When this action is dispatched to the store, the middleware will take over and:
 * - Dispatch a `USER_REQUEST` action
 * - Perform the api request to `/users`
 * - Dispatch a `USER_SUCCESS` action with the response payload if the api request is successful
 * - Dispatch a `USER_FAILURE` action with the response payload if the api request fails
 * 
 * Actions can be defined in the following ways:
 * 
 * - As an action type `string` (shown above)
 * - As an action `object`
 * - As an action creator `function` - will get passed the success/error response
 * 
 * As an alternative to passing an array of actions, you can also pass in a specific `requestAction`, `successAction` or `failureAction`.
 * Redux middleware to handle custom `LP_API` actions.
 *
 * ### Middleware configuration
 * In order to use `lp-redux-api` actions, you must first apply the custom middleware to your store when the store is created:
 * ```
 * import { middleware as apiMiddleware } from '@launchpadlab/lp-redux-api'
 * const apiConfig = { ... }
 * const middleware = applyMiddleware(
 *    apiMiddleware(apiConfig),
 *    ...
 * )
 * const store = createStore(reducer, initialState, middleware)
 * ```
 * The following options can be used to configure the middleware:
 * - `authenticated` (default=`false`): Require a JWT on each request (may be overridden on a per-action basis)
 * - `crsf` (default=`true`): Require CSRF token on applicable requests. If a string is specified, it will look for the token in a `meta` tag with that name.
 * - `tokenName` (default=`'token'`): The key in localStorage where the JWT is stored.
 * - `onUnauthorized` (default=`null`): An action creator to be called and dispatched when the server rejects a request with a status of `unauthorized`.
 * - `root` (default=`null`): A path to be prepended to `url` provided in the action.
 *
 * @name middleware
 * @type Function
 */

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
      actions,
      types,
      ...options
    } = lpApi

    // Alias 'actions' with 'types' for backwards compatibility
    const actionTypes = actions || types || []
    const [ requestFallback, successFallback, failureFallback ] = actionTypes

    const {
      url,
      body,
      credentials,
      csrf,
      headers,
      method,
      mode,
      requestAction=requestFallback,
      successAction=successFallback,
      failureAction=failureFallback,
      requestKey,
      ...rest,
    } = options

    // Make sure required options exist
    validateOptions({ url, actionTypes: [requestAction, successAction, failureAction] })

    // Send user-specified request action
    if (requestAction) {
      next(parseAction({
        action: requestAction,
        payload: rest,
      }))
    }
    
    // Send request action to API reducer
    if (requestKey) next(lpApiRequest(requestKey))

    const givenRequestOptions = omitUndefined({
      body,
      credentials,
      csrf,
      headers,
      method,
      mode,
    })

    const requestOptions = {
      ...defaultRequestOptions,
      ...givenRequestOptions,
    }

    // Make the request
    return http(url, requestOptions)
      .catch(error => {
        const response = error.response || error.message || 'There was an error.'
        const statusCode = error.status

        // Send user-specified failure action
        if (failureAction) {
          next(parseAction({
            action: failureAction,
            payload: { ...rest, response, statusCode },
            error: true,
          }))
        }

        // Send failure action to API reducer
        if (requestKey) next(lpApiFailure(requestKey))

        if (error.status === 401 && defaultConfigOptions.onUnauthorized) {
          next(defaultConfigOptions.onUnauthorized())
        }
      })
      .then(response => {
        // An error was handled above
        if (!response) return

        // Send user-specified success action
        if (successAction) {
          next(parseAction({
            action: successAction,
            payload: { ...rest, response },
          }))
        }

        // Send success action to API reducer
        if (requestKey) next(lpApiSuccess(requestKey, response))
      })
  }
}

function validateOptions ({ url, actionTypes }) {
  if (!url || typeof url !== 'string') throw `Must provide string 'url' argument`
  if (!actionTypes.length) throw `Must provide at least one action definition. Use 'api' module for requests with no associated actions.`
}

// Create an action from an action "definition."
export function parseAction ({ action, payload={}, error=false }) {
  switch (typeof action) {
  // If it's an action creator, create the action
  case 'function': return action(payload)
  // If it's an action object return the action
  case 'object': return action
  // Otherwise, create a "default" action object with the given type
  case 'string': return { type: action, payload, error }
  default: throw 'Invalid action definition (must be function, object or string).'
  }
}
