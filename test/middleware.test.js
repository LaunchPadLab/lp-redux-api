jest.mock('isomorphic-fetch')

import { successUrl, failureUrl, networkErrorUrl, responseBody } from 'isomorphic-fetch'
import { middleware, LP_API } from '../src'
import { parseAction } from '../src/middleware'
import { lpApiRequest, lpApiSuccess, lpApiFailure } from '../src/actions'

import {
  REQUEST_KEY,
  ACTION_TYPE_REQUEST,
  ACTION_TYPE_SUCCESS,
  ACTION_TYPE_FAILURE,
  actionWithURL
} from './fixtures'

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

/* TESTS */

test('middleware requires user and actions/types arguments', () => {
  const emptyAction = { [LP_API]: {} }
  callMiddleware(emptyAction)
    .then(() => fail('should complain about missing params'))
    .catch((err) => {
      expect(err).toExist()
    })
})

const actionString = 'ACTION'
const testPayload = { test: true }
const actionObject = {
  type: actionString,
  payload: testPayload,
  error: false
}
const actionFunction = (payload) => ({ type: actionString, payload, error: false })

test('middleware parses action STRING definitions correctly', () => {
  expect(parseAction({ 
    action: actionString, 
    payload: testPayload 
  })).toEqual(actionObject)
  expect(parseAction({ 
    action: actionString, 
    payload: testPayload, 
    error: true 
  })).toEqual({ ...actionObject, error: true })
})

test(`middleware parses action OBJECT definitions correctly (doesn't mutate)`, () => {
  expect(parseAction({ 
    action: actionObject, 
    payload: testPayload 
  })).toEqual(actionObject)
  expect(parseAction({ 
    action: actionObject, 
    payload: { test: 'something else' }, 
    error: true 
  })).toEqual(actionObject)
})

test('middleware parses action FUNCTION definitions correctly (passes payload)', () => {
  expect(parseAction({ 
    action: actionFunction, 
    payload: testPayload 
  })).toEqual(actionObject)
  expect(parseAction({ 
    action: actionFunction, 
    payload: testPayload, 
    error: true 
  })).toEqual(actionObject)
})

test('middleware rejects unsupported action definition types', () => {
  expect(() => parseAction({ action: 0 })).toThrow()
  expect(() => parseAction({ action: true })).toThrow()
  expect(() => parseAction({ })).toThrow()
})

test('middleware dispatches user-defined REQUEST action', () => {
  return callMiddleware(actionWithURL(successUrl), { waitForActions: 1 }).then((actions) => {
    const userRequestAction = actions.pop()
    expect(userRequestAction.type).toEqual(ACTION_TYPE_REQUEST)
  })
})

test('middleware dispatches reducer REQUEST action', () => {
  return callMiddleware(actionWithURL(successUrl), { waitForActions: 2 }).then((actions) => {
    const apiRequestAction = actions.pop()
    expect(apiRequestAction).toEqual(lpApiRequest(REQUEST_KEY))
  })
})

test('middleware dispatches user-defined SUCCESS action', () => {
  return callMiddleware(actionWithURL(successUrl), { waitForActions: 3 }).then((actions) => {
    const userSuccessAction = actions.pop()
    expect(userSuccessAction.type).toEqual(ACTION_TYPE_SUCCESS)
  })
})

test('middleware dispatches user-defined FAILURE action', () => {
  return callMiddleware(actionWithURL(failureUrl), { waitForActions: 3 }).then((actions) => {
    const userSuccessAction = actions.pop()
    expect(userSuccessAction.type).toEqual(ACTION_TYPE_FAILURE)
  })
})

test('middleware dispatches reducer SUCCESS action', () => {
  return callMiddleware(actionWithURL(successUrl), { waitForActions: 4 }).then((actions) => {
    const apiSuccessAction = actions.pop()
    expect(apiSuccessAction).toEqual(lpApiSuccess(REQUEST_KEY, responseBody))
  })
})

test('middleware dispatches reducer FAILURE action', () => {
  return callMiddleware(actionWithURL(failureUrl), { waitForActions: 4 }).then((actions) => {
    const apiSuccessAction = actions.pop()
    expect(apiSuccessAction).toEqual(lpApiFailure(REQUEST_KEY))
  })
})

test('middleware dispatches reducer FAILURE action on network error', () => {
  return callMiddleware(actionWithURL(networkErrorUrl), { waitForActions: 4 }).then((actions) => {
    const apiSuccessAction = actions.pop()
    expect(apiSuccessAction).toEqual(lpApiFailure(REQUEST_KEY))
  })
})