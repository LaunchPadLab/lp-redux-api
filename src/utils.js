import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import overlap from 'lodash/intersection'
import attempt from 'lodash/attempt'
import isError from 'lodash/isError'
import Cookies from 'js-cookie'

import get from 'lodash/fp/get'
export { default as set } from 'lodash/fp/set'
export { default as unset } from 'lodash/fp/unset'
export { default as compose } from 'lodash/fp/compose'
export { default as union } from 'lodash/union'

export { onLoad, deprecate } from '@launchpadlab/lp-utils'
export {
  api,
  http,
  HttpError,
} from '@launchpadlab/lp-requests'

// Returns true when two arrays share common items
export function hasOverlap (arr1, arr2) {
  const overlapItems = overlap(arr1, arr2)
  return (overlapItems.length > 0)
}

// Given an object, returns a copy of that object
// with all keys with undefined values removed
export function omitUndefined (obj) {
  return omitBy(obj, isUndefined)
}

// Parses an object from a string and returns the result
// Returns undefined if there's a parsing error
export function parseObject (str) {
  const parsedObj = attempt(() => JSON.parse(str))
  if (!isError(parsedObj)) return parsedObj
}

// Get the auth cookie used by lp_token_auth
// Returns undefined if the cookie is not set
export function getLpAuthCookie () {
  return Cookies.get('lp_auth')
}

// Get data at path if path exists,
// otherwise return full object
export function getData (obj, path) {
  if (!path) return obj
  return get(path, obj)
}

export { get }
