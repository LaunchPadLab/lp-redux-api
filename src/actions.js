export function lpApiRequest (key) {
  return {
    type: 'LP_API_REQUEST',
    payload: key,
  }
}

export function lpApiSuccess (key) {
  return {
    type: 'LP_API_SUCCESS',
    payload: key,
  }
}

export function lpApiFailure (key) {
  return {
    type: 'LP_API_FAILURE',
    payload: key,
  }
}