import { LP_API_ACTION } from './actions'
import { get } from './utils'

export default function (state={}, { type, payload }) {
  if (type !== LP_API_ACTION) return state
  const { key, status } = payload
  return { ...state, [key]: status }
}

export function selectStatus (key, state, slice='api') {
  if (!key || !state) throw 'Must include key and state params'
  if (!get(slice, state)) throw `No reducer exists at path '${slice}'`
  return get(`${slice}.${key}`, state)
}