import { set } from './utils'
import { 
  LP_API_ACTION,
  LP_API_STATUS_LOADING
} from './actions'

export default function (requestKey, path) {
  if (!path || !requestKey) throw 'Must include \'path\' and \'requestKey\' arguments.'
  return {
    [LP_API_ACTION]: function (state, { payload }) {
      if (payload.key !== requestKey || payload.status === LP_API_STATUS_LOADING) return state
      return set(path, payload.response, state)
    }
  }
}