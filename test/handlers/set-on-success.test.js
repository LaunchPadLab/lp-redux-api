import { setOnSuccess, LP_API_STATUS_FAILURE, LP_API_STATUS_SUCCESS } from '../../src/'

const STATE = { foo: 'bar' }
const REQUEST_TYPE = 'FETCH_USERS'
const DATA = 'returned data'
const FAILURE_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_FAILURE }}
const SUCCESS_ACTION = { type: REQUEST_TYPE, payload: { status: LP_API_STATUS_SUCCESS, data: DATA }}

test('setOnSuccess sets state with data when request succeeds', () => {
  const successHandler = setOnSuccess('dataPath')
  const newState = successHandler(STATE, SUCCESS_ACTION)
  expect(newState.dataPath).toEqual(DATA)
})

test('setOnSuccess can receive a transform function', () => {
  const CUSTOM_DATA = 'custom stuff'
  const transform = jest.fn(() => CUSTOM_DATA)
  const successHandler = setOnSuccess('dataPath', transform)
  const newState = successHandler(STATE, SUCCESS_ACTION)
  expect(transform).toHaveBeenCalledWith(SUCCESS_ACTION, STATE)
  expect(newState.dataPath).toEqual(CUSTOM_DATA)
})

test('setOnSuccess returns state when request does not succeed', () => {
  const successHandler = setOnSuccess('dataPath')
  const newState = successHandler(STATE, FAILURE_ACTION)
  expect(newState).toEqual(STATE)
})
