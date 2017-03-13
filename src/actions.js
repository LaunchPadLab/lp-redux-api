export const LP_API_ACTION = 'LP_API_ACTION'

export function lpApiRequest (key) {
  return lpApiAction('loading', key)
}

export function lpApiSuccess (key) {
  return lpApiAction('success', key)
}

export function lpApiFailure (key) {
  return lpApiAction('failure', key)
}

function lpApiAction (status, key) {
  return {
    type: LP_API_ACTION,
    payload: key,
    status,
  }
}