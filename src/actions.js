export const LP_API_ACTION = 'LP_API_ACTION'

function lpApiAction (key, status) {
  return {
    type: LP_API_ACTION,
    payload: { key, status }
  }
}

export function lpApiRequest (key) {
  return lpApiAction(key, 'loading')
}

export function lpApiSuccess (key) {
  return lpApiAction(key, 'success')
}

export function lpApiFailure (key) {
  return lpApiAction(key, 'failure')
}