import { get } from './utils'

export default function selectStatus (key, state, slice='api') {
  if (!key || !state) throw 'Must include key and state params'
  if (!get(slice, state)) throw `No reducer exists at path '${slice}'`
  return get(`${slice}.${key}`, state)
}