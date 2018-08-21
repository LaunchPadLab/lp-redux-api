import LP_API from './LP_API'
import { LP_API_ACTION_NAMESPACE } from './actions'
import { isObject, isFunction } from 'lodash'

/**
 * A function that creates action creators for making API requests, much like [createAction](https://redux-actions.js.org/api-reference/createaction-s) from `redux-actions`.
 *
 * Note: there are convenience functions for each request method: `createPostRequest()`, `createPutRequest()`, etc.
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

function createRequestWithMethod (type, definition, method) {
  if (!type) throw new Error('Must include a type for your request.')
  if (!definition) throw new Error('Must include a request definition for your request.')
  if (!(isObject(definition) || isFunction(definition))) throw new Error('Request definition must be an object or a function.')
  function actionCreator (...args) {
    return {
      [LP_API]: {
        method,
        ...createActionOptions(definition, args),
        requestKey: type,
      }
    }
  }
  actionCreator.toString = () => LP_API_ACTION_NAMESPACE + type
  return actionCreator
}


export function createRequest (type, definition) {
  return createRequestWithMethod(type, definition, 'GET')
}

// Export convenience function for each request method

export const createGetRequest = createRequest

export function createPostRequest (type, definition) {
  return createRequestWithMethod(type, definition, 'POST')
}

export function createPutRequest (type, definition) {
  return createRequestWithMethod(type, definition, 'PUT')
}

export function createPatchRequest (type, definition) {
  return createRequestWithMethod(type, definition, 'PATCH')
}

export function createDeleteRequest (type, definition) {
  return createRequestWithMethod(type, definition, 'DELETE')
}
