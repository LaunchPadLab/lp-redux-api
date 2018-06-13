import { set } from 'lodash/fp'
import { LP_API_STATUS_SUCCESS } from './actions'

function setOnSuccess (path) {
  return (state, { payload: { status, data }}) => {
    return (status === LP_API_STATUS_SUCCESS) ? set(path, data, state) : state
  }
}

export default setOnSuccess