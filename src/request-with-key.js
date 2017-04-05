import LP_API from './LP_API'
import { hasOverlap } from './utils'



export default function requestWithKey (requestKey, options={}) {
  if (!requestKey) throw 'Must include a key for requestWithKey() request.'
  const providedOpts = Object.keys(options)
  if (hasOverlap(providedOpts, actionOpts)) throw 'Cannot speciify actions when using requestWithKey()'
  return {
    [LP_API]: {
      ...options,
      requestKey,
      actions: [`${requestKey}_REQUEST`, `${requestKey}_SUCCESS`, `${requestKey}_FAILURE`]
    }
  }
}

// Action-related options that are forbidden
const actionOpts = ['actions', 'types', 'requestAction', 'successAction', 'failureAction']