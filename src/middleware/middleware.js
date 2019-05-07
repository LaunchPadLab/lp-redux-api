import LP_API from '../LP_API'
import * as actions from '../actions'
import parseAction from './parse-action'
import parseOptions from './parse-options'
import { isFunction } from 'lodash'

/**
 * In order to use actions created by {@link createRequest}, you must apply the custom `lp-redux-api` middleware to your store when the store is created:
 * ```
 * import { middleware as apiMiddleware } from '@launchpadlab/lp-redux-api'
 * 
 * const defaultAdapterOptions = { ... }
 * const adapter = axios
 * 
 * const middleware = applyMiddleware(
 *    apiMiddleware(adapter, defaultAdapterOptions),
 *    ...
 * )
 * const store = createStore(reducer, initialState, middleware)
 * ```
 * 
 * The `adapter` argument is the function that will be invoked to make the API request. It will be passed an object of configuration arguments and it must return a promise indicating request status.
 * 
 * The following options may be used to configure the middleware:
 * - `onUnauthorized` (default=`null`): An action creator to be called and dispatched when the server rejects a request with a status of `unauthorized`.
 * - `requestAction` (default=`null`): An action creator to be called and dispatched when the initial request is made.
 * - `successAction` (default=`null`): An action creator to be called and dispatched if the request succeeds.
 * - `failureAction` (default=`null`): An action creator to be called and dispatched if the request fails.
 * - any options used by the adapter
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

function middleware (mainAdapter, options={}) {
  // Require adapter
  if (!isFunction(mainAdapter)) throw new Error('Middleware must be initialized with an adapter function.')
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
      adapter=mainAdapter,
    } = mergedConfigOptions
    // Send user-specified request action
    if (requestAction) {
      next(parseAction({
        action: requestAction,
        payload: options,
      }))
    }
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
