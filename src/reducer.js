import { LP_API_ACTION } from './actions'

export default function(state={}, { type, payload, status }) {
  return type === LP_API_ACTION
    ? { ...state, [payload]: status }
    : state
}

export function selectStatus (key, state) {
  if (!state.api) throw 'No `api` reducer exists'
  return state.api[key] // TODO make the reducer name configurable
}