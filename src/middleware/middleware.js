import LP_API from '../LP_API'
import * as actions from '../actions'
import parseAction from './parse-action'
import parseOptions from './parse-options'

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
 *       requestAction: 'USER_REQUEST', 
 *       successAction: 'USER_SUCCESS', 
 *       failureAction: 'USER_FAILURE',
 *       ... any more configuration options 
 *     },
 *   }
 * }
 * ```
 * When this action is dispatched to the store, the middleware will take over and:
 * - Dispatch a `USER_REQUEST` action
 * - Perform the api request to `/users`
 * - Dispatch a `USER_SUCCESS` action with the response payload if the api request is successful
 * - Dispatch a `USER_FAILURE` action with the error payload if the api request fails
 * 
 * Actions can be defined in the following ways:
 * 
 * - As an action type `string` (shown above)
 * - As an action `object`
 * - As an action creator `function` - will get passed the success/error response as modified by `successDataPath` and `failureDataPath` (see below)
 *
 * ### Middleware configuration
 * In order to use `lp-redux-api` actions, you must apply the custom middleware to your store when the store is created:
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
 * - `onUnauthorized` (default=`null`): An action creator to be called and dispatched when the server rejects a request with a status of `unauthorized`.
 * - any options used by the lp-requests [http](https://github.com/LaunchPadLab/lp-requests/blob/master/docs.md#http) module
 *
 * @name middleware
 * @type Function
 */

// custom HTTP method for stub requests- makes no call, but resolves with provided data.
function createStubRequest (data) {
  return function request () {
    return Promise.resolve(data)
  }
}

function middleware (options={}) {
  // Build defaults
  const { 
    configOptions: defaultConfigOptions,
    requestOptions: defaultRequestOptions
  } = parseOptions(options)
  // Handle actions
  return () => next => action => {
    // ignore undefined or null actions
    if (!action) return
    // Pull out action body
    const options = action[LP_API]
    // Do not process actions without a [LP_API] property
    if (!options) return next(action)
    // Parse options and merge with defaults
    const { configOptions, requestOptions } = parseOptions(options)
    const mergedConfigOptions = { ...defaultConfigOptions, ...configOptions }
    const mergedRequestOptions = { ...defaultRequestOptions, ...requestOptions }
    // Pull out config options
    const {
      type,
      onUnauthorized,
      requestAction,
      successAction,
      failureAction,
      isStub,
      stubData,
      adapter,
    } = mergedConfigOptions
    // Send user-specified request action
    if (requestAction) {
      next(parseAction({
        action: requestAction,
        payload: options,
      }))
    }
    // Require adapter
    if (!adapter) throw new Error(`Middleware: Must provide function 'adapter' argument.`)
    // Send built-in request action
    next(actions.setStatusLoading(type))
    // Make the request
    const request = isStub ? createStubRequest(stubData) : adapter
    return request(mergedRequestOptions)
      .then(
        // Success handler
        response => {
          // Send user-specified success action
          if (successAction) {
            next(parseAction({
              action: successAction,
              payload: response,
            }))
          }
          // Send built-in success action
          next(actions.setStatusSuccess(type, response))
          return response
        },
        // Error handler
        error => {
          // Send user-specified failure action
          if (failureAction) {
            next(parseAction({
              action: failureAction,
              payload: error,
              error: true,
            }))
          }
          // Send built-in failure action
          next(actions.setStatusFailure(type, error))
          // Dispatch unauthorized action if applicable
          if (error.status === 401 && onUnauthorized) next(onUnauthorized({ error, request: options }))
          throw error
        }
      )
  }
}

export default middleware
