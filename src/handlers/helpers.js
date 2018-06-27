import { get } from '../utils'
import { LP_API_STATUS_SUCCESS, LP_API_STATUS_FAILURE } from '../actions'

export function isSuccessAction (action) {
  return get('payload.status', action) === LP_API_STATUS_SUCCESS
}

export function isFailureAction (action) {
  return get('payload.status', action) === LP_API_STATUS_FAILURE
}

export function getDataFromAction (action) {
  return get('payload.data', action)
}
