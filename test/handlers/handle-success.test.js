import { handleSuccess, LP_API_STATUS_FAILURE, LP_API_STATUS_SUCCESS } from '../../src/'

const STATE = { foo: 'bar' }
const REQUEST_TYPE = 'FETCH_USERS'
const FAILURE_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_FAILURE }}
const SUCCESS_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_SUCCESS }}

test('handleSuccess runs handler with state and action when request succeeds', () => {
  const NEW_STATE = { new: 'state' }
  const handler = jest.fn(() => NEW_STATE)
  const successHandler = handleSuccess(handler)
  const newState = successHandler(STATE, SUCCESS_ACTION)
  expect(handler).toHaveBeenCalledWith(STATE, SUCCESS_ACTION)
  expect(newState).toEqual(NEW_STATE)
})

test('handleSuccess returns state when request does not succeed', () => {
  const handler = jest.fn()
  const successHandler = handleSuccess(handler)
  const newState = successHandler(STATE, FAILURE_ACTION)
  expect(newState).toEqual(STATE)
})
