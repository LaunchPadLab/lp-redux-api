// API status constants:

export const LP_API_ACTION = 'LP_API_ACTION'
export const LP_API_STATUS_LOADING = 'loading'
export const LP_API_STATUS_SUCCESS = 'success'
export const LP_API_STATUS_FAILURE = 'failure'

// API status action creator:
// (these actions are handled by reducer.js)

function statusAction (key, status, data) {
  return {
    type: '@@lp-redux-api/' + key,
    payload: { key, status, data }
  }
}

// Specific status action creators:
// (used in middleware.js)

export function setStatusLoading (key, data) {
  return statusAction(key, LP_API_STATUS_LOADING, data)
}

export function setStatusSuccess (key, data) {
  return statusAction(key, LP_API_STATUS_SUCCESS, data)
}

export function setStatusFailure (key, data) {
  return statusAction(key, LP_API_STATUS_FAILURE, data)
}