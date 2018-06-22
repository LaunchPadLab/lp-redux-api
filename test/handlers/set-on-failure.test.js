import { setOnFailure, LP_API_STATUS_FAILURE, LP_API_STATUS_SUCCESS } from '../../src/'

const STATE = { foo: 'bar' }
const REQUEST_TYPE = 'FETCH_USERS'
const ERROR_DATA = 'ERRRRRROR'
const FAILURE_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_FAILURE, data: ERROR_DATA }}
const SUCCESS_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_SUCCESS }}

test('setOnFailure sets state with error info when request fails', () => {
  const failureHandler = setOnFailure('errorPath')
  const newState = failureHandler(STATE, FAILURE_ACTION)
  expect(newState.errorPath).toEqual(ERROR_DATA)
})

test('setOnFailure can receive a transform function', () => {
  const CUSTOM_DATA = 'custom stuff'
  const transform = jest.fn(() => CUSTOM_DATA)
  const failureHandler = setOnFailure('errorPath', transform)
  const newState = failureHandler(STATE, FAILURE_ACTION)
  expect(transform).toHaveBeenCalledWith(FAILURE_ACTION, STATE)
  expect(newState.errorPath).toEqual(CUSTOM_DATA)
})

test('setOnFailure returns state when request does not fail', () => {
  const failureHandler = setOnFailure('errorPath')
  const newState = failureHandler(STATE, SUCCESS_ACTION)
  expect(newState).toEqual(STATE)
})
