import { 
  reducer, 
  LP_API_STATUS_LOADING, 
  LP_API_STATUS_SUCCESS, 
  LP_API_STATUS_FAILURE 
} from '../src/'
import * as actions from '../src/actions'

test('reducer sets request statuses correctly', () => {
  const initialState = {}
  const requestKey = 'test request'
  let newState = reducer(initialState, actions.setStatusLoading(requestKey))
  expect(newState[requestKey]).toEqual(LP_API_STATUS_LOADING)
  newState = reducer(initialState, actions.setStatusSuccess(requestKey))
  expect(newState[requestKey]).toEqual(LP_API_STATUS_SUCCESS)
  newState = reducer(initialState, actions.setStatusFailure(requestKey))
  expect(newState[requestKey]).toEqual(LP_API_STATUS_FAILURE)
})
