import LP_API from './LP_API'
import { hasOverlap } from './utils'

/**
 * An action creator that automatically adds a requestKey and default actions to your request.
 * These default actions can then be picked up by {@link setFromRequest}.
 *
 * Default actions are dynamically named using the key provided, like so:
 * - `<requestKey>_REQUEST`
 * - `<requestKey>_SUCCESS`
 * - `<requestKey>_FAILURE`
 *
 * @param {String} requestKey - A unique key that you can use to reference your request in {@link setFromRequest} or {@link selectStatus}
 * @param {Object} options - Config options that you would normally include in an [LP_API] action, such as `url` and `method`
 * @returns {Object} An [LP_API] action that can be handled by the lp-redux-api middleware.
 * @example
 *
 * export const REQ_FETCH_USERS = 'REQ_FETCH_USERS'
 *
 * export const fetchUsers = requestWithKey(REQ_FETCH_USERS, {
 *   url: '/users'
 * })
 *
 * fetchUsers()
 *
 * // {
 * //   [LP_API]: {
 * //     url: '/users',
 * //     requestKey: 'REQ_FETCH_USERS',
 * //     actions: ['REQ_FETCH_USERS_REQUEST', 'REQ_FETCH_USERS_SUCCESS', 'REQ_FETCH_USERS_FAILURE']
 * //   }
 * // }
 *
**/

export default function requestWithKey (requestKey, options={}) {
  if (!requestKey) throw 'Must include a key for requestWithKey() request.'
  const providedOpts = Object.keys(options)
  if (hasOverlap(providedOpts, actionOpts)) throw 'Cannot specify custom actions when using requestWithKey()'
  return {
    [LP_API]: {
      ...options,
      requestKey,
      actions: [`${requestKey}_REQUEST`, `${requestKey}_SUCCESS`, `${requestKey}_FAILURE`]
    }
  }
}

// Action-related options that are forbidden
const actionOpts = ['actions', 'types', 'requestAction', 'successAction', 'failureAction']
