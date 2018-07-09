import { handleResponse, LP_API_STATUS_FAILURE, LP_API_STATUS_SUCCESS } from '../../src/'

const STATE = { foo: 'bar' }
const REQUEST_TYPE = 'FETCH_USERS'
const DATA = 'response data'
const FAILURE_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_FAILURE, data: DATA }}
const SUCCESS_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_SUCCESS, data: DATA }}

test('handleResponse requires two handlers', () => {
  const successHandler = jest.fn()
  const failureHandler = jest.fn()
  expect(() => handleResponse(successHandler)).toThrow()
  expect(() => handleResponse(null, failureHandler)).toThrow()
})

test('handleResponse runs success handler with state, action and data when request succeeds', () => {
  const SUCCESS_STATE = { success: 'state' }
  const FAILURE_STATE = { failure: 'state' }
  const successHandler = jest.fn(() => SUCCESS_STATE)
  const failureHandler = jest.fn(() => FAILURE_STATE)
  const handler = handleResponse(successHandler, failureHandler)
  const newState = handler(STATE, SUCCESS_ACTION)
  expect(successHandler).toHaveBeenCalledWith(STATE, SUCCESS_ACTION, DATA)
  expect(newState).toEqual(SUCCESS_STATE)
})

test('handleResponse runs failure handler with state, action and data when request fails', () => {
  const SUCCESS_STATE = { success: 'state' }
  const FAILURE_STATE = { failure: 'state' }
  const successHandler = jest.fn(() => SUCCESS_STATE)
  const failureHandler = jest.fn(() => FAILURE_STATE)
  const handler = handleResponse(successHandler, failureHandler)
  const newState = handler(STATE, FAILURE_ACTION)
  expect(failureHandler).toHaveBeenCalledWith(STATE, FAILURE_ACTION, DATA)
  expect(newState).toEqual(FAILURE_STATE)
})
