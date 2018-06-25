import { defaultTransform } from './helpers'
import handleResponse from './handle-response'
import { set } from '../utils'

/**
 * A function that creates an API action handler that sets one of two given paths in the state with the returned data depending on whether a request succeeds or fails.
 * 
 * @name setOnResponse
 * @param {String} path - The path in the state to set with the returned data on success
 * @param {String} path - The path in the state to set with the returned error on failure
 * @param {Function} [transform] - A function that determines the success data that is set in the state. Passed `action` and `state` params.
 * @param {Function} [transform] - A function that determines the error data that is set in the state. Passed `action` and `state` params.
 * @returns {Function} An action handler
 * @example
 *
 * handleActions({
 *    // This will do the same thing as the example for handleResponse
 *    [apiActions.fetchUser]: setOnResponse('currentUser', 'userFetchError')
 * })
 *
**/

function setOnResponse (
  successPath, 
  failurePath, 
  transformSuccess=defaultTransform, 
  transformFailure=defaultTransform,
) {
  return handleResponse(
    (state, action) => set(successPath, transformSuccess(action, state), state),
    (state, action) => set(failurePath, transformFailure(action, state), state),
  )
}

export default setOnResponse