import humps from 'humps'
import omitBy from 'lodash.omitby'
import isUndefined from 'lodash.isundefined'

export { default as get } from 'lodash/fp/get'
export { default as set } from 'lodash/fp/set'
export { default as unset } from 'lodash/fp/unset'

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

// Stolen from redux
export function compose(...funcs) {
  if (funcs.length === 0) return arg => arg
  if (funcs.length === 1) return funcs[0]
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}