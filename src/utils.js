import humps from 'humps'
import omitBy from 'lodash.omitby'
import isUndefined from 'lodash.isundefined'
export get from 'lodash/fp/get'

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
