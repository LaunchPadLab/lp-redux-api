import { omitUndefined } from '../utils'

// Separate middleware options into config options and request options

function parseOptions ({
  onUnauthorized,
  actions,
  types,
  requestAction,
  successAction,
  failureAction,
  requestKey,
  isStub,
  stubData,
  ...requestOptions
}) {
  return {
    configOptions: omitUndefined({ 
      onUnauthorized,
      actions,
      types,
      requestAction,
      successAction,
      failureAction,
      requestKey,
      isStub,
      stubData,
    }),
    requestOptions,
  }
}

export default parseOptions