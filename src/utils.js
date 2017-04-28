import humps from 'humps'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import overlap from 'lodash/intersection'
import attempt from 'lodash/attempt'
import isError from 'lodash/isError'
import Cookies from 'js-cookie'

export { default as get } from 'lodash/fp/get'
export { default as set } from 'lodash/fp/set'
export { default as unset } from 'lodash/fp/unset'
export { default as compose } from 'lodash/fp/compose'
export { default as union } from 'lodash/union'

export { onLoad } from '@launchpadlab/lp-utils'

export function hasOverlap (arr1, arr2) {
  const overlapItems = overlap(arr1, arr2)
  return (overlapItems.length > 0)
}

export function camelizeKeys (obj) {
  return humps.camelizeKeys(obj, (key, convert) =>
    /^_/.test(key) ? key : convert(key)
  )
}

export function decamelizeKeys (obj) {
  return humps.decamelizeKeys(obj)
}

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
