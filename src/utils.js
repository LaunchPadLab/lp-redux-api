import {
  isUndefined,
  omitBy,
  intersection as overlap,
} from 'lodash'

export {
  get,
  set,
  unset,
  compose,
  union,
} from 'lodash/fp'

import baseDeprecate from 'util-deprecate'

export {
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

export function deprecate (func, msg='') {
  return baseDeprecate(func, `WARNING: ${ func.name } is deprecated and will be removed in the next version of this library. ${ msg }`)
}