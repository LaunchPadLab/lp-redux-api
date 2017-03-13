import { LP_API_ACTION } from './actions'

export default function (state={}, { type, payload }) {
  if (type !== LP_API_ACTION) return state
  const { key, status } = payload
  return { ...state, [key]: status }
}

export function selectStatus (key, state) {
  if (!state.api) throw 'No `api` reducer exists'
  return state.api[key] // TODO make the reducer name configurable
}