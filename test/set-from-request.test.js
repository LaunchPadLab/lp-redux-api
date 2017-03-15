jest.mock('isomorphic-fetch')

import { responseBody } from 'isomorphic-fetch'
import { lpApiRequest, lpApiSuccess, lpApiFailure } from '../src/actions'
import { get } from '../src/utils'
import { setFromRequest } from '../src/'

import { REQUEST_KEY } from './fixtures'


/* HELPERS */

const RESPONSE_PATH = 'path'

const reducer = (state={}, action) => {
  const handlers = {
    ...setFromRequest(REQUEST_KEY, RESPONSE_PATH)
  }
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}

/* TESTS */

test('setFromRequest ignores request actions', () => {
  const requestAction = lpApiRequest(REQUEST_KEY)
  const state = reducer({}, requestAction)
  expect(get(RESPONSE_PATH, state)).toEqual(undefined)
})

test('setFromRequest sets path to response on success', () => {
  const successAction = lpApiSuccess(REQUEST_KEY, responseBody)
  const state = reducer({}, successAction)
  expect(get(RESPONSE_PATH, state)).toEqual(responseBody)
})

test('setFromRequest sets path to null on failure', () => {
  const failureAction = lpApiFailure(REQUEST_KEY)
  const state = reducer({}, failureAction)
  expect(get(RESPONSE_PATH, state)).toEqual(null)
})