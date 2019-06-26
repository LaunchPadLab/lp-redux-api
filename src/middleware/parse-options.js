import { omitUndefined } from '../utils'

// Separate middleware options into config options and request options

function parseOptions ({
  type,
  onUnauthorized,
  actions,
  types,
  requestAction,
  successAction,
  failureAction,
  isStub,
  isStubError,
  stubData,
  delay,
  adapter,
  ...requestOptions
}) {
  return {
    configOptions: omitUndefined({ 
      type,
      onUnauthorized,
      actions,
      types,
      requestAction,
      successAction,
      failureAction,
      isStub,
      isStubError,
      stubData,
      delay,
      adapter,
    }),
    requestOptions,
  }
}

export default parseOptions
