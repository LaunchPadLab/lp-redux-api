import LP_API from './LP_API'
import { union } from './utils'

const overridden = ['actions', 'types', 'requestAction', 'successAction', 'failureAction']

export default function (requestKey, options={}) {
  if (!requestKey) throw 'Must include a key for requestWithKey() request.'
  if (union(Object.keys(options), overridden)) throw 'Cannot speciify actions when using requestWithKey()'
  return {
    [LP_API]: {
      ...options,
      requestKey,
      actions: [`${requestKey}_REQUEST`, `${requestKey}_SUCCESS`, `${requestKey}_FAILURE`]
    }
  }
}