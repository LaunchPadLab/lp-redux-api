import { successUrl, failureUrl, unauthorizedUrl } from 'isomorphic-fetch'
import { middleware, LP_API } from '../src'
import parseAction from '../src/middleware/parse-action'
import * as actions from '../src/actions'
import configureStore from 'redux-mock-store'

import {
  REQUEST_KEY,
  ACTION_TYPE_REQUEST,
  ACTION_TYPE_SUCCESS,
  ACTION_TYPE_FAILURE,
  actionWithURL
} from './fixtures'

/* HELPERS */

const UNAUTHORIZED_ACTION = { type: 'UNAUTHORIZED' }
const mockStore = configureStore([ middleware({
  onUnauthorized: () => UNAUTHORIZED_ACTION,
  successDataPath: 'url',
  failureDataPath: 'url',
}) ])

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

test('middleware requires url argument', () => {
  const store = mockStore({})
  const emptyAction = { [LP_API]: {} }
  expect(() => store.dispatch(emptyAction)).toThrow()
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
    expect(dispatchedActions[1].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_KEY)
    // User defined SUCCESS action
    expect(dispatchedActions[2].type).toEqual(ACTION_TYPE_SUCCESS)
    // Internal SUCCESS action
    expect(dispatchedActions[3].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_KEY)
  })
})

test('middleware dispatches failure actions in the correct order', () => {
  const store = mockStore({})
  return store.dispatch(actionWithURL(failureUrl)).then(() => {
    const dispatchedActions = store.getActions()
    // User defined REQUEST action
    expect(dispatchedActions[0].type).toEqual(ACTION_TYPE_REQUEST)
    // Internal REQUEST action
    expect(dispatchedActions[1].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_KEY)
    // User defined FAILURE action
    expect(dispatchedActions[2].type).toEqual(ACTION_TYPE_FAILURE)
    // Internal FAILURE action
    expect(dispatchedActions[3].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_KEY)
  })
})

test('middleware dispatches success action when response body does not exist', () => {
  const store = mockStore({})
  return store.dispatch(actionWithURL(successUrl, { successDataPath: 'path.to.nothing' })).then(() => {
    const dispatchedActions = store.getActions()
    // User defined REQUEST action
    expect(dispatchedActions[0].type).toEqual(ACTION_TYPE_REQUEST)
    // Internal REQUEST action
    expect(dispatchedActions[1].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_KEY)
    // User defined SUCCESS action
    expect(dispatchedActions[2].type).toEqual(ACTION_TYPE_SUCCESS)
    // Internal SUCCESS action
    expect(dispatchedActions[3].type).toEqual(actions.LP_API_ACTION_NAMESPACE + REQUEST_KEY)
  })
})

test('middleware dispatches custom unauthorized action on auth error', () => {
  const store = mockStore({})
  return store.dispatch(actionWithURL(unauthorizedUrl)).then(() => {
    const dispatchedActions = store.getActions()
    expect(dispatchedActions.pop()).toEqual(UNAUTHORIZED_ACTION)
  })
})

test('middleware applies successDataPath correctly', () => {
  const store = mockStore({})
  return store.dispatch(actionWithURL(successUrl)).then(() => {
    const dispatchedActions = store.getActions()
    expect(dispatchedActions[2].payload).toEqual(successUrl)
  })
})

test('middleware applies failureDataPath correctly', () => {
  const store = mockStore({})
  return store.dispatch(actionWithURL(failureUrl)).then(() => {
    const dispatchedActions = store.getActions()
    expect(dispatchedActions[2].payload.errors).toEqual(failureUrl)
  })
})
