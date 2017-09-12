// API status constants:

export const LP_API_ACTION = 'LP_API_ACTION'
export const LP_API_STATUS_LOADING = 'loading'
export const LP_API_STATUS_SUCCESS = 'success'
export const LP_API_STATUS_FAILURE = 'failure'

// API status action creator:
// (these actions are handled by reducer.js)

function statusAction (key, status) {
  return {
    type: LP_API_ACTION,
    payload: { key, status }
  }
}

// Specific status action creators:
// (used in middleware.js)

export function setStatusLoading (key) {
  return statusAction(key, LP_API_STATUS_LOADING)
}

export function setStatusSuccess (key) {
  return statusAction(key, LP_API_STATUS_SUCCESS)
}

export function setStatusFailure (key) {
  return statusAction(key, LP_API_STATUS_FAILURE)
}