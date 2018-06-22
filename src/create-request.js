import LP_API from './LP_API'

/**
 * A function that creates action creators for making API requests, much like [createAction](https://redux-actions.js.org/api-reference/createaction-s) from `redux-actions`.
 *
 * @name createRequest
 * @param {String} type - A unique key that will be used to identify the request internally inr edux
 * @param {Object|Function} definition - An object of `lp-request` config options, or a function that returns config options.
 * @returns {Function} An action creator that passes its arguments to `definition` and makes the resulting API request.
 * @example
 *
 *
 * export const fetchUser = requestWithKey('FETCH_USER', (id) => ({
 *   url: '/users/' + id,
 * }))
 *
 * fetchUsers(5)
 * // -> will make request to /users/5
 *
 * // Just like in redux-action, this action can be referenced in a reducer by name:
 * 
 * handleActions({
 *    [apiActions.fetchUser]: (state, action) => ...
 * })
 *
**/

function createActionOptions (definition, args) {
  if (typeof definition === 'object') return definition
  if (typeof definition === 'function') return definition(...args) || {}
  throw new Error('Request definition must be an object or a function.')
}

function createRequest (type, definition) {
  if (!type) throw new Error('Must include a type for your request.')
  function actionCreator (...args) {
    return {
      [LP_API]: {
        ...createActionOptions(definition, args),
        requestKey: type,
      }
    }
  }
  actionCreator.toString = () => '@@lp-redux-api/' + type
  return actionCreator
}

export default createRequest