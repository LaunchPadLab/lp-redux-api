import { setOnResponse, LP_API_STATUS_FAILURE, LP_API_STATUS_SUCCESS } from '../../src/'

const STATE = { foo: 'bar' }
const REQUEST_TYPE = 'FETCH_USERS'
const ERROR_DATA = 'BAD!'
const DATA = 'returned data'
const FAILURE_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_FAILURE, data: ERROR_DATA }}
const SUCCESS_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_SUCCESS, data: DATA }}

test('setOnResponse sets state with data when request succeeds', () => {
  const handler = setOnResponse('dataPath', 'errorPath')
  const newState = handler(STATE, SUCCESS_ACTION)
  expect(newState.dataPath).toEqual(DATA)
})

test('setOnResponse sets state with error data when request fails', () => {
  const handler = setOnResponse('dataPath', 'errorPath')
  const newState = handler(STATE, FAILURE_ACTION)
  expect(newState.errorPath).toEqual(ERROR_DATA)
})

test('setOnResponse can receive a success transform function', () => {
  const CUSTOM_DATA = 'custom stuff'
  const transform = jest.fn(() => CUSTOM_DATA)
  const handler = setOnResponse('dataPath', 'errorPath', transform)
  const newState = handler(STATE, SUCCESS_ACTION)
  expect(transform).toHaveBeenCalledWith(SUCCESS_ACTION, STATE)
  expect(newState.dataPath).toEqual(CUSTOM_DATA)
})

test('setOnResponse can receive a failure transform function', () => {
  const CUSTOM_DATA = 'custom stuff'
  const transform = jest.fn(() => CUSTOM_DATA)
  const handler = setOnResponse('dataPath', 'errorPath', null, transform)
  const newState = handler(STATE, FAILURE_ACTION)
  expect(transform).toHaveBeenCalledWith(FAILURE_ACTION, STATE)
  expect(newState.errorPath).toEqual(CUSTOM_DATA)
})
