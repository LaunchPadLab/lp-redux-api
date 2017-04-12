import { LP_API_ACTION } from './actions'

/**
 * Stores the status of API requests in your state.
 * Statuses are stored for all requests with a `requestKey` (including those created by {@link requestWithKey}),
 * and can be retrieved by using {@link selectStatus}.
 *
 * To use this reducer, add it to `combineReducers()` under the `api` key. You can use a different key if you'd like,
 * but you will need to reference it explicitly when using {@link selectStatus}.
 *
 * @name reducer
 * @type {Function}
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

export default function reducer (state={}, { type, payload }) {
  if (type !== LP_API_ACTION) return state
  const { key, status } = payload
  return { ...state, [key]: status }
}