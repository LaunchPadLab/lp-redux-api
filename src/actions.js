export const LP_API_ACTION = 'LP_API_ACTION'
export const LP_API_STATUS_LOADING = 'loading'
export const LP_API_STATUS_SUCCESS = 'success'
export const LP_API_STATUS_FAILURE = 'failure'

function lpApiAction (key, status, response={}) {
  return {
    type: LP_API_ACTION,
    payload: { key, status, response }
  }
}

export function lpApiRequest (key) {
  return lpApiAction(key, LP_API_STATUS_LOADING)
}

export function lpApiSuccess (key, response) {
  return lpApiAction(key, LP_API_STATUS_SUCCESS, response)
}

export function lpApiFailure (key) {
  return lpApiAction(key, LP_API_STATUS_FAILURE)
}