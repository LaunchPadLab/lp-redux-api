// API status constants:

export const LP_API_ACTION = 'LP_API_ACTION'
export const LP_API_STATUS_LOADING = 'loading'
export const LP_API_STATUS_SUCCESS = 'success'
export const LP_API_STATUS_FAILURE = 'failure'

// API status action creator:
// (these actions are handled by reducer.js)

function lpApiAction (key, status) {
  return {
    type: LP_API_ACTION,
    payload: { key, status }
  }
}

// Specific status action creators:
// (used in middleware.js)

export function lpApiRequest (key) {
  return lpApiAction(key, LP_API_STATUS_LOADING)
}

export function lpApiSuccess (key) {
  return lpApiAction(key, LP_API_STATUS_SUCCESS)
}

export function lpApiFailure (key) {
  return lpApiAction(key, LP_API_STATUS_FAILURE)
}