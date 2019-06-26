import { getDataFromAction } from './helpers'
import handleFailure from './handle-failure'
import { set } from '../utils'

/**
 * A function that creates an API action handler that sets a path in the state with the returned error if a request fails.
 * 
 * @name setOnFailure
 * @param {String} path - The path in the state to set with the returned error
 * @param {Function} [transform] - A function that determines the data that is set in the state. Passed `action` and `state` params.
 * @returns {Function} An action handler that runs when a request is successful
 * @example
 *
 * handleActions({
 *    // This will do the same thing as the example for handleFailure
 *    [apiActions.fetchUser]: setOnFailure('userFetchError')
 * })
 *
 */

function setOnFailure (path, transform=getDataFromAction) {
  return handleFailure((state, action) => set(path, transform(action, state), state))
}

export default setOnFailure
