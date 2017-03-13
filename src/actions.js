export const LP_API_ACTION = 'LP_API_ACTION'
export const LP_API_STATUS_LOADING = 'loading'
export const LP_API_STATUS_SUCCESS = 'success'
export const LP_API_STATUS_FAILURE = 'failure'

function lpApiAction (key, status) {
  return {
    type: LP_API_ACTION,
    payload: { key, status }
  }
}

export function lpApiRequest (key) {
  return lpApiAction(key, LP_API_STATUS_LOADING)
}

export function lpApiSuccess (key) {
  return lpApiAction(key, LP_API_STATUS_SUCCESS)
}

export function lpApiFailure (key) {
  return lpApiAction(key, LP_API_STATUS_FAILURE)
}