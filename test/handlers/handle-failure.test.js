import { handleFailure, LP_API_STATUS_FAILURE, LP_API_STATUS_SUCCESS } from '../../src/'

const STATE = { foo: 'bar' }
const REQUEST_TYPE = 'FETCH_USERS'
const FAILURE_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_FAILURE }}
const SUCCESS_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_SUCCESS }}

test('handleFailure runs handler with state and action when request fails', () => {
  const NEW_STATE = { new: 'state' }
  const handler = jest.fn(() => NEW_STATE)
  const failureHandler = handleFailure(handler)
  const newState = failureHandler(STATE, FAILURE_ACTION)
  expect(handler).toHaveBeenCalledWith(STATE, FAILURE_ACTION)
  expect(newState).toEqual(NEW_STATE)
})

test('handleFailure returns state when request does not fail', () => {
  const handler = jest.fn()
  const failureHandler = handleFailure(handler)
  const newState = failureHandler(STATE, SUCCESS_ACTION)
  expect(newState).toEqual(STATE)
})
