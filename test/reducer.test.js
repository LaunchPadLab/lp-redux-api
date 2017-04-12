import { 
  reducer, 
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
