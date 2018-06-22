import { isSuccessAction } from './helpers'

function handleSuccess (handler) {
  return (state, action) => isSuccessAction(action) ? handler(state, action) : state
}

export default handleSuccess