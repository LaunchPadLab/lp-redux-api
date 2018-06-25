// API status constants:

export const LP_API_ACTION_NAMESPACE = '@@lp-redux-api/'
export const LP_API_STATUS_LOADING = 'loading'
export const LP_API_STATUS_SUCCESS = 'success'
export const LP_API_STATUS_FAILURE = 'failure'

// API status action creator:
// (these actions are handled by reducer.js)

function statusAction (key, status, data) {
  return {
    type: LP_API_ACTION_NAMESPACE + key,
    payload: { key, status, data }
  }
}

// Specific status action creators:
// (used in middleware.js)

export function setStatusLoading (key) {
  return statusAction(key, LP_API_STATUS_LOADING)
}

export function setStatusSuccess (key, data) {
  return statusAction(key, LP_API_STATUS_SUCCESS, data)
}

export function setStatusFailure (key, data) {
  return statusAction(key, LP_API_STATUS_FAILURE, data)
}