import { get } from './utils'

/**
 * A function that, given the redux state, returns the status of a given API request. 
 * In order to work, the `lp-redux-api` reducer must be included in `combineReducers()`.
 *
 * The status of a request can be one of the following exported constants:
 * - `LP_API_STATUS_LOADING`: `'loading'`
 * - `LP_API_STATUS_SUCCESS`: `'success'`
 * - `LP_API_STATUS_FAILURE`: `'failure'`
 *
 *
 * @param {String} requestKey - A unique key that references a request created by [requestWithKey](#requestwithkey)
 * @param {Object} state - The state of your redux store
 * @param {String} [slice='api'] - The path to the slice of state handled by the `lp-redux-api` reducer
 * @returns {String} A string constant indicating request status
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
 * import { requestKey, selectStatus } from 'lp-redux-api'
 * 
 * const REQ_FETCH_USERS = 'REQ_FETCH_USERS'
 * dispatch(requestWithKey(REQ_FETCH_USERS, { url: '/users' }))
 * 
 * selectStatus(REQ_FETCH_USERS, state) // -> 'loading'
 *
**/

export default function selectStatus (requestKey, state, slice='api') {
  if (!requestKey || !state) throw 'Must include key and state params'
  if (!get(slice, state)) throw `No reducer exists at path '${slice}'`
  return get(`${slice}.${requestKey}`, state)
}