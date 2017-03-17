import { set, unset, compose } from './utils'

export default function (requestKey, path) {
  const dataPath = `${path}.data`
  const errorPath = `${path}.error`
  return {
    [`${requestKey}_SUCCESS`]: (state, action) => compose(set(dataPath, action.payload), unset(errorPath))(state),
    [`${requestKey}_FAILURE`]: (state, action) => compose(set(errorPath, action.payload), unset(dataPath))(state)
  }
}