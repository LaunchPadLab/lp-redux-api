import { isSuccessAction, isFailureAction, getDataFromAction } from './helpers'

/**
 * A function that takes two API action handlers, one for successful requests and one for failed requests,
 * and applies the handlers when the responses have the correct status.
 * 
 * @name handleResponse
 * @param {Function} successHandler - An action handler that is passed `state`, `action` and `data` params
 * @param {Function} failureHandler - An action handler that is passed `state`, `action` and `data` params
 * @returns {Function} An action handler runs the handler that corresponds to the request status
 * @example
 *
 * handleActions({
 *    [apiActions.fetchUser]: handleResponse(
 *      (state, action) => {
 *        // This code runs if the call is successful
 *        return set('currentUser', action.payload.data, state)
 *      },
 *      (state, action) => {
 *        // This code runs if the call is unsuccessful
 *        return set('userFetchError', action.payload.data, state)
 *      },
 *    )
 * })
 *
 */

function handleResponse (successHandler, failureHandler) {
  if (!(successHandler && failureHandler)) throw new Error('handleResponse requires both a success handler and failure handler.')
  return (state, action) => {
    if (isSuccessAction(action)) return successHandler(state, action, getDataFromAction(action))
    if (isFailureAction(action)) return failureHandler(state, action, getDataFromAction(action))
    return state
  }
}

export default handleResponse
