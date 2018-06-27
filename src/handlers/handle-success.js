import { isSuccessAction, getDataFromAction } from './helpers'

/**
 * A function that takes an API action handler and only applies that handler when the request succeeds.
 * 
 * @name handleSuccess
 * @param {Function} handler - An action handler that is passed `state` and `action` params
 * @returns {Function} An action handler that runs when a request is successful
 * @example
 *
 * handleActions({
 *    [apiActions.fetchUser]: handleSuccess((state, action) => {
 *      // This code only runs when the call was successful
 *      return set('currentUser', action.payload.data, state)
 *    })
 * })
 *
**/

function handleSuccess (handler) {
  return (state, action) => isSuccessAction(action) ? handler(state, action, getDataFromAction(action)) : state
}

export default handleSuccess