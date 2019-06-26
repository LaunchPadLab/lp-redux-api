import { getDataFromAction } from './helpers'
import handleSuccess from './handle-success'
import { set } from '../utils'

/**
 * A function that creates an API action handler that sets a path in the state with the returned data if a request succeeds.
 * 
 * @name setOnSuccess
 * @param {String} path - The path in the state to set with the returned data
 * @param {Function} [transform] - A function that determines the data that is set in the state. Passed `action` and `state` params.
 * @returns {Function} An action handler that runs when a request is unsuccessful
 * @example
 *
 * handleActions({
 *    // This will do the same thing as the example for handleSuccess
 *    [apiActions.fetchUser]: setOnSuccess('currentSuccess')
 * })
 *
 */

function setOnSuccess (path, transform=getDataFromAction) {
  return handleSuccess((state, action) => set(path, transform(action, state), state))
}

export default setOnSuccess
