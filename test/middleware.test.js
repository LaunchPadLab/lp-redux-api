jest.mock('isomorphic-fetch')

import { successUrl, failureUrl } from 'isomorphic-fetch'
import { middleware, LP_API } from '../src'
import { lpApiRequest, lpApiSuccess, lpApiFailure } from '../src/actions'

const configuredMiddleware = middleware({})

/* HELPERS */

// Pass action to middleware, and wait for the specified number of actions 
// to be passed to the next middleware before resolving
const callMiddleware = (action, opt={}) => {
  const { waitForActions = 1 } = opt
  const nextMiddleware = []
  return new Promise((resolve) => {
    const next = (a) => {
      nextMiddleware.push(a)
      if (nextMiddleware.length === waitForActions) resolve([...nextMiddleware])
    }
    return configuredMiddleware()(next)(action)
  })
}

/* FIXTURES */

const REQUEST_KEY = 'REQUEST_KEY'
const ACTION_TYPE_REQUEST = 'ACTION_TYPE_REQUEST'
const ACTION_TYPE_SUCCESS = 'ACTION_TYPE_SUCCESS'
const ACTION_TYPE_FAILURE = 'ACTION_TYPE_FAILURE'

const successfulAction = {
  [LP_API]: {
    url: successUrl,
    requestKey: REQUEST_KEY,
    actions: [ACTION_TYPE_REQUEST, ACTION_TYPE_SUCCESS, ACTION_TYPE_FAILURE]
  }
}

const failingAction = {
  [LP_API]: {
    url: failureUrl,
    requestKey: REQUEST_KEY,
    actions: [ACTION_TYPE_REQUEST, ACTION_TYPE_SUCCESS, ACTION_TYPE_FAILURE]
  }
}

/* TESTS */

test('middleware requires user and actions/types arguments', () => {
  const emptyAction = { [LP_API]: {} }
  callMiddleware(emptyAction)
    .then(() => fail('should complain about missing params'))
    .catch((err) => {
      expect(err).toExist()
    })
})

test('middleware dispatches reducer REQUEST action', () => {
  return callMiddleware(successfulAction, { waitForActions: 1 }).then((actions) => {
    const apiRequestAction = actions.pop()
    expect(apiRequestAction).toEqual(lpApiRequest(REQUEST_KEY))
  })
})

test('middleware dispatches user-defined REQUEST action', () => {
  return callMiddleware(successfulAction, { waitForActions: 2 }).then((actions) => {
    const userRequestAction = actions.pop()
    expect(userRequestAction.type).toEqual(ACTION_TYPE_REQUEST)
  })
})

test('middleware dispatches reducer SUCCESS action', () => {
  return callMiddleware(successfulAction, { waitForActions: 3 }).then((actions) => {
    const apiSuccessAction = actions.pop()
    expect(apiSuccessAction).toEqual(lpApiSuccess(REQUEST_KEY))
  })
})

test('middleware dispatches user-defined SUCCESS action', () => {
  return callMiddleware(successfulAction, { waitForActions: 4 }).then((actions) => {
    const userSuccessAction = actions.pop()
    expect(userSuccessAction.type).toEqual(ACTION_TYPE_SUCCESS)
  })
})

test('middleware dispatches reducer FAILURE action', () => {
  return callMiddleware(failingAction, { waitForActions: 3 }).then((actions) => {
    const apiSuccessAction = actions.pop()
    expect(apiSuccessAction).toEqual(lpApiFailure(REQUEST_KEY))
  })
})

test('middleware dispatches user-defined FAILURE action', () => {
  return callMiddleware(failingAction, { waitForActions: 4 }).then((actions) => {
    const userSuccessAction = actions.pop()
    expect(userSuccessAction.type).toEqual(ACTION_TYPE_FAILURE)
  })
})
