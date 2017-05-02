import { set, unset, compose } from './utils'

/**
 * A function that creates action handlers for actions generated by {@link requestWithKey}.
 * These handlers set data in the state from the response(s) of a given request.
 *
 * By default, setFromRequest creates handlers for `<requestKey>_SUCCESS` and `<requestKey>_FAILURE` action types.
 * You can override either of these handlers in your reducer by creating handlers explicitly.
 *
 * Current behavior (subject to change):
 * - If the request is successful, the response will be set at `<path>.data`, and `<path>.error` will be `null`
 * - If the request is unsuccessful, the response will be set at `<path>.error`, and `<path>.data` will be `null`
 *
 * @name setFromRequest
 * @type Function
 * @param {String} requestKey - A unique key that references a request created by {@link requestWithKey}
 * @param {String} path - A path (in dot notation) indicating where the data will be set in the state
 * @returns {Object} An hash of action handlers that can be included in a reducer by using object spread syntax
 * @example
 * 
 * const REQ_FETCH_USERS = 'REQ_FETCH_USERS'
 * 
 *  const initialState = {
 *   user: {
 *     data: null,
 *     error: null
 *   }
 *  }
 * 
 * export const reducer = (state=initialState, action) => {
 *   const handlers = {
 *     ...setFromRequest(REQ_FETCH_USERS, 'user')
 *   }
 *   const handler = handlers[action.type]
 *   if (!handler) return state
 *   return handler(state, action)
 * }
 * 
 * // On success, this call returns userData
 * const fetchUsers = requestWithKey(REQ_FETCH_USERS, { url: '/users' })
 * 
 * dispatch(fetchUsers()) 
 * 
 * // On success, new state will be:
 * // {
 * //    user: {
 * //      data: userData,
 * //      error: null
 * //    } 
 * // }
 *
**/

export default function setFromRequest (requestKey, path) {
  if (!requestKey) throw 'Must include a key for the request handled by setFromRequest().'
  if (!path) throw 'Must include path to be set by setFromRequest().'
  const dataPath = `${path}.data`
  const errorPath = `${path}.error`
  return {
    [`${requestKey}_SUCCESS`]: (state, action) => compose(set(dataPath, action.payload), unset(errorPath))(state),
    [`${requestKey}_FAILURE`]: (state, action) => compose(set(errorPath, action.payload), unset(dataPath))(state)
  }
}
