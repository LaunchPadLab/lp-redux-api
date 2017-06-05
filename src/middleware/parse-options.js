import { omitUndefined } from '../utils'

// Separate middleware options into config options and request options

function parseOptions ({
  url,
  onUnauthorized,
  actions,
  types,
  requestAction,
  successAction,
  failureAction,
  requestKey,
  successDataPath,
  failureDataPath,
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
      successDataPath,
      failureDataPath,
    }),
    requestOptions,
    url,
  }
}

export default parseOptions