import { 
  reducer, 
  selectStatus,
  LP_API_STATUS_LOADING, 
  LP_API_STATUS_SUCCESS, 
  LP_API_STATUS_FAILURE 
} from '../src/'
import { lpApiRequest, lpApiSuccess, lpApiFailure } from '../src/actions'

test('reducer sets request statuses correctly', () => {
  const initialState = {}
  const requestKey = 'test request'
  let newState = reducer(initialState, lpApiRequest(requestKey))
  expect(newState[requestKey]).toEqual(LP_API_STATUS_LOADING)
  newState = reducer(initialState, lpApiSuccess(requestKey))
  expect(newState[requestKey]).toEqual(LP_API_STATUS_SUCCESS)
  newState = reducer(initialState, lpApiFailure(requestKey))
  expect(newState[requestKey]).toEqual(LP_API_STATUS_FAILURE)
})

test('selector gets request status correctly', () => {
  const initialState = {}
  const requestKey = 'test request'
  let newState = reducer(initialState, lpApiRequest(requestKey))
  const rootState = {
    api: newState
  }
  expect(selectStatus(requestKey, rootState)).toEqual(LP_API_STATUS_LOADING)
})

test('selector can handle a custom reducer path', () => {
  const initialState = {}
  const requestKey = 'test request'
  let newState = reducer(initialState, lpApiRequest(requestKey))
  const rootState = {
    customApi: newState
  }
  expect(selectStatus(requestKey, rootState, 'customApi')).toEqual(LP_API_STATUS_LOADING)
})

test('selector expects reducer to be mounted', () => {
  const requestKey = 'test request'
  const rootState = {}
  expect(() => selectStatus(requestKey, rootState)).toThrow()
})