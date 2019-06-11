import LP_API from './LP_API'
import { LP_API_ACTION_NAMESPACE } from './actions'
import { isObject, isFunction, identity } from 'lodash'

/**
 * A function that creates action creators for making stubbed API requests.
 * 
 * Unlike {@link createRequest}, these action creators do not make real API calls but rather
 * resolve immediately with the provided data.
 * 
 * If an `error` key is provided in the stub data object, the "request" will reject with the value of that key instead of resolving.
 *
 * @name createStubRequest
 * @param {String} type - A unique key that will be used to identify the request internally in redux
 * @param {Object|Function} dataDefinition - Data that the request will resolve with, or a function that returns data to resolve with.
 * @returns {Function} An action creator that passes its arguments to `dataDefinition` and makes the resulting stubbed API request.
 * @example
 *
 * // ** Stubbing a successful request: **
 * 
 * export const fetchUser = createStubRequest('FETCH_USER', (id) => ({ id }))
 *
 * fetchUsers(5)
 * // -> won't make any api request, but will resolve with data { id: 5 }
 *
 * // Just like in redux-actions, this action can be referenced in a reducer by name:
 * 
 * handleActions({
 *    [apiActions.fetchUser]: (state, action) => ...
 * })
 * 
 * // ** Stubbing a failed request: **
 * 
 * export const fetchUser = createStubRequest('FETCH_USER', (id) => ({ error: new Error('My mock error.') }))
 *
 * fetchUsers(5)
 * // -> won't make any api request, but will reject with the given error.
 *
**/

function createActionOptions (definition, args) {
  return isFunction(definition)
    ? definition(...args) || {}
    : definition
}

function createStubRequest (type, definition=identity) {
  if (!type) throw new Error('Must include a type for your request.')
  if (!(isObject(definition) || isFunction(definition))) throw new Error('Request definition must be an object or a function.')
  function actionCreator (...args) {
    return {
      [LP_API]: {
        isStub: true,
        stubData: createActionOptions(definition, args),
        type,
      }
    }
  }
  actionCreator.toString = () => LP_API_ACTION_NAMESPACE + type
  return actionCreator
}

export default createStubRequest