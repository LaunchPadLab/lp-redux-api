import { get } from './utils'
import {
  LP_API_STATUS_LOADING,
  LP_API_STATUS_SUCCESS,
  LP_API_STATUS_FAILURE,
} from './actions'

/**
 * This library exports the following selectors for determining the status of requests:
 * - `selectors.status(state, requestKey, [slice])`
 * - `selectors.hasStatus(state, requestKey, [slice])`
 * - `selectors.isLoading(state, requestKey, [slice])`
 * - `selectors.isComplete(state, requestKey, [slice])`
 * - `selectors.isSuccess(state, requestKey, [slice])`
 * - `selectors.isFailure(state, requestKey, [slice])`
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
 * import { requestWithKey, selectors as apiSelectors } from 'lp-redux-api'
 * 
 * const REQ_FETCH_USERS = 'REQ_FETCH_USERS'
 * dispatch(requestWithKey(REQ_FETCH_USERS, { url: '/users' }))
 * 
 * apiSelectors.status(state, REQ_FETCH_USERS) // -> 'loading'
 *
**/

const selectors = {}

selectors.status = function (state, requestKey, slice='api') {
  if (!requestKey || !state) throw new Error('Must include key and state params')
  if (!get(slice, state)) throw new Error(`No reducer exists at path '${slice}'`)
  return get(`${slice}.${requestKey}`, state)
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

