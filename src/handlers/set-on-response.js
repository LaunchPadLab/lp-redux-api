import { defaultTransform, isSuccessAction, isFailureAction } from './helpers'
import handleResponse from './handle-response'
import { set } from '../utils'

function setOnResponse (
  successPath, 
  failurePath, 
  transformSuccess=defaultTransform, 
  transformFailure=defaultTransform,
) {
  return handleResponse((state, action) => {
    if (isSuccessAction(action)) return set(successPath, transformSuccess(action), state)
    if (isFailureAction(action)) return set(failurePath, transformFailure(action), state)
    return state
  })
}

export default setOnResponse