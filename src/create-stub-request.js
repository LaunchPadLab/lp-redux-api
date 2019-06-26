import LP_API from './LP_API'
import { LP_API_ACTION_NAMESPACE } from './actions'
import { isObject, isFunction, identity } from 'lodash'

/**
 * A function that creates action creators for making stubbed API requests.
 * 
 * Unlike {@link createRequest}, these action creators do not make real API calls but rather
 * resolve immediately with the provided data.
 * 
 * If an exception is thrown from the data creator function, the "request" will reject with that exception instead of resolving.
 *
 * @name createStubRequest
 * @param {String} type - A unique key that will be used to identify the request internally in redux
 * @param {Object|Function} dataDefinition - Data that the request will resolve with, or a function that returns data to resolve with.
 * @param {Object} [options] - Options object
 * @param {Number} [options.delay=0] - Time (in ms) to delay the API request. Particularly useful when attempting to simulate loading states.
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
 * export const fetchUser = createStubRequest('FETCH_USER', (id) => { 
 *    throw new Error('My mock error.')
 * })
 *
 * fetchUsers(5)
 * // -> won't make any api request, but will reject with the given error.
 *
 * // ** Simulating a response delay: **
 * 
 * export const fetchUser = createStubRequest('FETCH_USER', (id) => {
 *  return {
 *    id
 *  }}, { delay: 500 })
 */

function getStubData (definition, args) {
  if (!isFunction(definition)) return { stubData: definition }
  try {
    const stubData = definition(...args) || {}
    return { stubData }
  } catch (e) {
    return { stubData: e, isError: true }
  }
}

function createStubRequest (type, definition=identity, { delay }={}) {
  if (!type) throw new Error('Must include a type for your request.')
  if (!(isObject(definition) || isFunction(definition))) throw new Error('Request definition must be an object or a function.')
  function actionCreator (...args) {
    const { stubData, isError } = getStubData(definition, args)
    return {
      [LP_API]: {
        isStub: true,
        isStubError: isError,
        stubData,
        type,
        delay,
      }
    }
  }
  actionCreator.toString = () => LP_API_ACTION_NAMESPACE + type
  return actionCreator
}

export default createStubRequest
