// API status constants:

export const LP_API_ACTION_NAMESPACE = '@@lp-redux-api/'
export const LP_API_STATUS_LOADING = 'loading'
export const LP_API_STATUS_SUCCESS = 'success'
export const LP_API_STATUS_FAILURE = 'failure'

// API status action creator:
// (these actions are handled by reducer.js)

function statusAction (type, status, data) {
  return {
    type: LP_API_ACTION_NAMESPACE + type,
    payload: { type, status, data }
  }
}

// Specific status action creators:
// (used in middleware.js)

export function setStatusLoading (type) {
  return statusAction(type, LP_API_STATUS_LOADING)
}

export function setStatusSuccess (type, data) {
  return statusAction(type, LP_API_STATUS_SUCCESS, data)
}

export function setStatusFailure (type, data) {
  return statusAction(type, LP_API_STATUS_FAILURE, data)
}