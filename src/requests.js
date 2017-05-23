// Deprecate and export lp-requests methods

import {
  api as apiUtil,
  deprecate,
  http as httpUtil,
  HttpError as HttpErrorUtil,
} from './utils'

const warning = 
`
  This function will be removed in the next major version of this library.
  Import it directly from lp-requests instead.
`

// Deprecate all methods
const apiMethods = {}

Object.keys(apiUtil).map(methodName => {
  const method = apiUtil[methodName]
  apiMethods[methodName] = deprecate(method, warning)
})

export const api = apiMethods

export const http = deprecate(httpUtil, warning)

export class HttpError extends HttpErrorUtil {
  constructor () {
    console.warn(warning) // eslint-disable-line no-console
    super()
  }
}