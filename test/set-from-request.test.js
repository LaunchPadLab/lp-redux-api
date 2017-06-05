import { get } from '../src/utils'
import { setFromRequest, requestWithKey, LP_API } from '../src/'

import { REQUEST_KEY } from './fixtures'

/* HELPERS */

const PATH = 'path'
const payload = { response: 'response' }

const reducer = (state={}, action) => {
  const handlers = {
    ...setFromRequest(REQUEST_KEY, PATH)
  }
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}

const request = requestWithKey(REQUEST_KEY)[LP_API]
const { requestAction, successAction, failureAction } = request

/* TESTS */

test('setFromRequest ignores request actions', () => {
  const state = reducer({}, { type: requestAction, payload })
  expect(get(PATH, state)).toEqual(undefined)
})

test('setFromRequest sets path to response on success', () => {
  const state = reducer({}, { type: successAction, payload })
  expect(get(`${PATH}.success`, state)).toEqual(payload)
})

test('setFromRequest sets path to response on failure', () => {
  const state = reducer({}, { type: failureAction, payload })
  expect(get(`${PATH}.failure`, state)).toEqual(payload)
})