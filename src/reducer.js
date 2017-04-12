import { LP_API_ACTION } from './actions'

export default function reducer (state={}, { type, payload }) {
  if (type !== LP_API_ACTION) return state
  const { key, status } = payload
  return { ...state, [key]: status }
}