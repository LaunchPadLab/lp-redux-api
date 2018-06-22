import { isFailureAction } from './helpers'

function handleSuccess (handler) {
  return (state, action) => isFailureAction(action) ? handler(state, action) : state
}

export default handleSuccess