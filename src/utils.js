import humps from 'humps'
import omitBy from 'lodash.omitby'
import isUndefined from 'lodash.isundefined'
import attempt from 'lodash/fp/attempt'
import isError from 'lodash/fp/isError'
import Cookies from 'js-cookie'

export { default as get } from 'lodash/fp/get'
export { default as set } from 'lodash/fp/set'
export { default as unset } from 'lodash/fp/unset'
export { default as compose } from 'lodash/fp/compose'

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

export function parseWithKey (obj, key) {
  const parsedObj = attempt(() => JSON.parse(obj))
  if (!isError(parsedObj)) return parsedObj[key]
}

export function getLpAuthCookie () {
  return Cookies.get('lp_auth')
}

export function getLpAuthToken () {
  const cookie = getLpAuthCookie()
  if (!cookie) return
  return parseWithKey(cookie, 'token') || cookie
}

export function getCookieContext (cookie) {
  return parseWithKey(cookie, 'context')
}
