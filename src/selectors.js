import { get } from './utils'
import {
  LP_API_ACTION_NAMESPACE,
  LP_API_STATUS_LOADING,
  LP_API_STATUS_SUCCESS,
  LP_API_STATUS_FAILURE,
} from './actions'

/**
 * This library exports the following selectors for determining the status of requests:
 * - `selectors.status(state, requestAction, [slice])`
 * - `selectors.hasStatus(state, requestAction, [slice])`
 * - `selectors.isLoading(state, requestAction, [slice])`
 * - `selectors.isComplete(state, requestAction, [slice])`
 * - `selectors.isSuccess(state, requestAction, [slice])`
 * - `selectors.isFailure(state, requestAction, [slice])`
 * 
 * In order to work, the `lp-redux-api` reducer must be included in `combineReducers()`.
 * Selectors expect the reducer to be keyed under `'api'`- if a different key is used,
 * it must be passed as the optional `slice` parameter.
 *
 * The status returned by `selectors.status()` can be one of the following exported constants:
 * - `LP_API_STATUS_LOADING`: `'loading'`
 * - `LP_API_STATUS_SUCCESS`: `'success'`
 * - `LP_API_STATUS_FAILURE`: `'failure'`
 *
 * @name selectors
 * @type Object
 * @example
 * 
 * // When creating store, attach reducer
 * 
 * import { reducer as apiReducer } from 'lp-redux-api'
 * 
 * combineReducers({ 
 *   api: apiReducer,
 *   ...
 * })
 * 
 * // Now you can keep track of request status elsewhere in your app
 * 
 * import { createRequest, selectors as apiSelectors } from 'lp-redux-api'
 * 
 * const fetchUsers = createRequest('FETCH_USERS', { url: '/users' })
 * dispatch(fetchUsers())
 * 
 * apiSelectors.status(state, fetchUsers) // -> 'loading'
 *
 */

const selectors = {}

// Remove action namespace if it's at the beginning
function stripNamespace (requestKey) {
  return requestKey.startsWith(LP_API_ACTION_NAMESPACE)
    ? requestKey.slice(LP_API_ACTION_NAMESPACE.length)
    : requestKey
}

selectors.status = function (state, requestKey, slice='api') {
  const key = stripNamespace(String(requestKey))
  if (!key || !state) throw new Error('Must include key and state params')
  if (!get(slice, state)) throw new Error(`No reducer exists at path '${slice}'`)
  return get(`${slice}.${key}`, state)
}

selectors.hasStatus = function (...args) {
  return !!selectors.status(...args)
}

selectors.isLoading = function (...args) {
  return selectors.status(...args) === LP_API_STATUS_LOADING
}

selectors.isComplete = function (...args) {
  return selectors.status(...args) !== LP_API_STATUS_LOADING
}

selectors.isSuccess = function (...args) {
  return selectors.status(...args) === LP_API_STATUS_SUCCESS
}

selectors.isFailure = function (...args) {
  return selectors.status(...args) === LP_API_STATUS_FAILURE
}

export default selectors

