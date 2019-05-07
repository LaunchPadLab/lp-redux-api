import { middleware, LP_API } from '../src'
import parseAction from '../src/middleware/parse-action'
import * as actions from '../src/actions'
import configureStore from 'redux-mock-store'
import axios, { successUrl, failureUrl, unauthorizedUrl } from 'axios'

import {
  REQUEST_TYPE,
  ACTION_TYPE_REQUEST,
  ACTION_TYPE_SUCCESS,
  ACTION_TYPE_FAILURE,
  actionWithURL
} from './fixtures'

/* HELPERS */

function onUnauthorized ({ error, request }) {
  return {
    type: 'UNAUTHORIZED',
    payload: { error, request }
  }
}

const mockStore = configureStore([ middleware(axios, { onUnauthorized }) ])

/* TESTS */

// Parse action tests

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

// Middleware tests

test('middleware requires function adapter argument', () => {
  expect(() => middleware()).toThrow()
  expect(() => middleware({})).toThrow()
  expect(() => middleware(() => {})).not.toThrow()
})

test('middleware passes non-LP_API actions through', () => {
  const store = mockStore({})
  const otherAction = { type: 'OTHER' }
  store.dispatch(otherAction)
  const dispatchedActions = store.getActions()
  expect(dispatchedActions.pop()).toEqual(otherAction)
})

test('middleware dispatches success actions in the correct order', () => {
  const store = mockStore({})
  return store.dispatch(actionWithURL(successUrl)).then(() => {
    const dispatchedActions = store.getActions()
    // User defined REQUEST action
    expect(dispatchedActions[0].type).toEqual(ACTION_TYPE_REQUEST)
    // Internal REQUEST action
    expect(dispatchedActions[1].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_TYPE)
    // User defined SUCCESS action
    expect(dispatchedActions[2].type).toEqual(ACTION_TYPE_SUCCESS)
    // Internal SUCCESS action
    expect(dispatchedActions[3].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_TYPE)
  })
})

test('middleware dispatches failure actions in the correct order', () => {
  expect.assertions(4)
  const store = mockStore({})
  return store.dispatch(actionWithURL(failureUrl)).catch(() => {
    const dispatchedActions = store.getActions()
    // User defined REQUEST action
    expect(dispatchedActions[0].type).toEqual(ACTION_TYPE_REQUEST)
    // Internal REQUEST action
    expect(dispatchedActions[1].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_TYPE)
    // User defined FAILURE action
    expect(dispatchedActions[2].type).toEqual(ACTION_TYPE_FAILURE)
    // Internal FAILURE action
    expect(dispatchedActions[3].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_TYPE)
  })
})

test('middleware dispatches custom unauthorized action on auth error', () => {
  expect.assertions(1)
  const store = mockStore({})
  const requestOptions = actionWithURL(unauthorizedUrl)[LP_API]
  return store.dispatch(actionWithURL(unauthorizedUrl)).catch((error) => {
    const dispatchedActions = store.getActions()
    expect(dispatchedActions.pop().payload).toEqual({ error, request: requestOptions })
  })
})

test('middleware resolves stubbed requests with provided data', () => {
  const store = mockStore({})
  const stubData = { foo: 'bar' }
  const stubAction = {
    [LP_API]: {
      isStub: true,
      stubData
    }
  }
  return store.dispatch(stubAction).then((res) => {
    expect(res).toEqual(stubData)
  })
})

test('middleware dispatches default success action with correct data argument', () => {
  const store = mockStore({})
  return store.dispatch(actionWithURL(successUrl)).then(() => {
    const dispatchedActions = store.getActions()
    // Internal SUCCESS action
    expect(dispatchedActions[3].payload.data).toEqual({ status: 200, data: { url: successUrl }})
  })
})

test('middleware dispatches default failure action with correct data argument', () => {
  expect.assertions(1)
  const store = mockStore({})
  return store.dispatch(actionWithURL(failureUrl)).catch(() => {
    const dispatchedActions = store.getActions()
    // Internal FAILURE action
    expect(dispatchedActions[3].payload.data).toEqual({ status: 422, data: { url: failureUrl }})
  })
})