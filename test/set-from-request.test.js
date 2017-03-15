jest.mock('isomorphic-fetch')

import { responseBody } from 'isomorphic-fetch'
import { get } from '../src/utils'
import { setFromRequest, requestWithKey, LP_API } from '../src/'

import { REQUEST_KEY } from './fixtures'

/* HELPERS */

const DATA_PATH = 'path.to.data'

const reducer = (state={}, action) => {
  const handlers = {
    ...setFromRequest(REQUEST_KEY, DATA_PATH)
  }
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}

const request = requestWithKey(REQUEST_KEY)
const [ requestAction, successAction, failureAction ] = request[LP_API].actions.map((type) => {
  return { type, payload: responseBody }
})

/* TESTS */

test('setFromRequest ignores request actions', () => {
  const state = reducer({}, requestAction)
  expect(get(DATA_PATH, state)).toEqual(undefined)
})

test('setFromRequest sets path to response on success', () => {
  const state = reducer({}, successAction)
  expect(get(DATA_PATH, state)).toEqual(responseBody)
})

test('setFromRequest sets path to null on failure', () => {
  const state = reducer({}, failureAction)
  expect(get(DATA_PATH, state)).toEqual(null)
})