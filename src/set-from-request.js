import { set } from './utils'
import { 
  LP_API_ACTION
} from './actions'

export default function (path, requestKey) {
  if (!path || !requestKey) throw 'Must include \'path\' and \'requestKey\' arguments.'
  return {
    [LP_API_ACTION]: function (state, { payload }) {
      if (payload.key !== requestKey) return state
      return set(path, payload.response, state)
    }
  }
}