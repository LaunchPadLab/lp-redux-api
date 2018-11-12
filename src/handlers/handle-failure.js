import { isFailureAction, getDataFromAction } from './helpers'

/**
 * A function that takes an API action handler and only applies that handler when the request fails.
 * 
 * @name handleFailure
 * @param {Function} handler - An action handler that is passed `state`, `action` and `data` params
 * @returns {Function} An action handler that runs when a request is unsuccessful
 * @example
 *
 * handleActions({
 *    [apiActions.fetchUser]: handleFailure((state, action) => {
 *      // This code only runs when the call was unsuccessful
 *      return set('userFetchError', action.payload.data, state)
 *    })
 * })
 *
**/

function handleFailure (handler) {
  return (state, action) => isFailureAction(action) ? handler(state, action, getDataFromAction(action)) : state
}

export default handleFailure