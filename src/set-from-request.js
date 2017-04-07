import { set, unset, compose } from './utils'

export default function (requestKey, path) {
  if (!requestKey || !path) throw `Must include 'requestKey' and 'path' arguments`
  const dataPath = `${path}.data`
  const errorPath = `${path}.error`
  return {
    [`${requestKey}_SUCCESS`]: (state, action) => {
      return compose(
        set(dataPath, action.payload.response),
        unset(errorPath)
      )(state)
    },
    [`${requestKey}_FAILURE`]: (state, action) => {
      return compose(
        set(errorPath, action.payload), 
        unset(dataPath)
      )(state)
    }
  }
}