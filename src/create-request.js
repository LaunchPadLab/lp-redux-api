import LP_API from './LP_API'
import { LP_API_ACTION_NAMESPACE } from './actions'
import { isObject, isFunction } from 'lodash'

/**
 * A function that creates action creators for making API requests, much like [createAction](https://redux-actions.js.org/api-reference/createaction-s) from `redux-actions`.
 *
 * @name createRequest
 * @param {String} type - A unique key that will be used to identify the request internally in redux
 * @param {Object|Function} definition - An object of `lp-request` config options, or a function that returns config options.
 * @returns {Function} An action creator that passes its arguments to `definition` and makes the resulting API request.
 * @example
 *
 *
 * export const fetchUser = createRequest('FETCH_USER', (id) => ({
 *   url: '/users/' + id,
 * }))
 *
 * fetchUsers(5)
 * // -> will make request to /users/5
 *
 * // Just like in redux-actions, this action can be referenced in a reducer by name:
 * 
 * handleActions({
 *    [apiActions.fetchUser]: (state, action) => ...
 * })
 *
**/

function createActionOptions (definition, args) {
  return isFunction(definition)
    ? definition(...args) || {}
    : definition
}

function createRequest (type, definition) {
  if (!type) throw new Error('Must include a type for your request.')
  if (!definition) throw new Error('Must include a request definition for your request.')
  if (!(isObject(definition) || isFunction(definition))) throw new Error('Request definition must be an object or a function.')
  function actionCreator (...args) {
    return {
      [LP_API]: {
        ...createActionOptions(definition, args),
        requestKey: type,
      }
    }
  }
  actionCreator.toString = () => LP_API_ACTION_NAMESPACE + type
  return actionCreator
}

export default createRequest