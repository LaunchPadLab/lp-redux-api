import { 
  reducer, 
  selectStatus,
  LP_API_STATUS_LOADING, 
  LP_API_STATUS_SUCCESS
} from '../src/'
import { lpApiRequest, lpApiSuccess } from '../src/actions'

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
  let newState = reducer(initialState, lpApiSuccess(requestKey))
  const rootState = {
    customApi: newState
  }
  expect(selectStatus(requestKey, rootState, 'customApi')).toEqual(LP_API_STATUS_SUCCESS)
})

test('selector expects reducer to be mounted', () => {
  const requestKey = 'test request'
  const rootState = {}
  expect(() => selectStatus(requestKey, rootState)).toThrow()
})