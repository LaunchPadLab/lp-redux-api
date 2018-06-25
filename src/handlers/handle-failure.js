import { isFailureAction } from './helpers'

/**
 * A function that takes an API action handler and only applies that handler when the request fails.
 * 
 * @name handleFailure
 * @param {Function} handler - An action handler that is passed `state` and `action` params
 * @returns {Function} An action handler that runs when a request is unsuccessful
 * @example
 *
 * handleActions({
 *    [apiActions.fetchUser]: handleFailure((state, action) => {
 *      // This code only runs when the call was unsuccessful
 *      return set('userFetchError', action.payload.error, state)
 *    })
 * })
 *
**/

function handleFailure (handler) {
  return (state, action) => isFailureAction(action) ? handler(state, action) : state
}

export default handleFailure