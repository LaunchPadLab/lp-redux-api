import { 
  LP_API_ACTION, 
  LP_API_STATUS_LOADING, 
  LP_API_STATUS_SUCCESS, 
  LP_API_STATUS_FAILURE,
  lpApiRequest, 
  lpApiSuccess, 
  lpApiFailure
} from '../src/actions'

test('REQUEST action creator creates action of expected type', () => {
  const requestKey = 'test request'
  const requestAction = {
    type: LP_API_ACTION,
    payload: {
      key: requestKey,
      status: LP_API_STATUS_LOADING
    }
  }
  expect(lpApiRequest(requestKey)).toEqual(requestAction)
})

test('SUCCESS action creator creates action of expected type', () => {
  const requestKey = 'test request'
  const requestAction = {
    type: LP_API_ACTION,
    payload: {
      key: requestKey,
      status: LP_API_STATUS_SUCCESS
    }
  }
  expect(lpApiSuccess(requestKey, 'response')).toEqual(requestAction)
})

test('FAILURE action creator creates action of expected type', () => {
  const requestKey = 'test request'
  const requestAction = {
    type: LP_API_ACTION,
    payload: {
      key: requestKey,
      status: LP_API_STATUS_FAILURE
    }
  }
  expect(lpApiFailure(requestKey)).toEqual(requestAction)
})
