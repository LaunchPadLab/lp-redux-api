import { get } from '../src/utils'
import { setFromRequest, requestWithKey, LP_API } from '../src/'

import { REQUEST_KEY } from './fixtures'

/* HELPERS */

const PATH = 'path'
const RESPONSE = { response: 'response' }

const reducer = (state={}, action) => {
  const handlers = {
    ...setFromRequest(REQUEST_KEY, PATH)
  }
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}

const request = requestWithKey(REQUEST_KEY)
const [ requestAction, successAction ] = request[LP_API].actions.map((type) => {
  return { type, payload: RESPONSE }
})

/* TESTS */

test('setFromRequest ignores request actions', () => {
  const state = reducer({}, requestAction)
  expect(get(PATH, state)).toEqual(undefined)
})

test('setFromRequest sets path to response on success', () => {
  const state = reducer({}, successAction)
  expect(get(PATH, state)).toEqual(RESPONSE)
})