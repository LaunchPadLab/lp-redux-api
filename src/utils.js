import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import overlap from 'lodash/intersection'

export { default as get } from 'lodash/fp/get'
export { default as set } from 'lodash/fp/set'
export { default as unset } from 'lodash/fp/unset'
export { default as compose } from 'lodash/fp/compose'
export { default as union } from 'lodash/union'

export {
  configureHttp,
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
