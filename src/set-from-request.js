import { set } from './utils'

export default function (requestKey, path) {
  return {
    [`${requestKey}_SUCCESS`]: (state, action) => set(path, action.payload, state),
    [`${requestKey}_FAILURE`]: (state) => set(path, null, state)
  }
}