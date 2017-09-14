import * as actions from '../src/actions'

const { 
  LP_API_ACTION, 
  LP_API_STATUS_LOADING, 
  LP_API_STATUS_SUCCESS, 
  LP_API_STATUS_FAILURE,
} = actions

test('REQUEST action creator creates action of expected type', () => {
  const requestKey = 'test request'
  const requestAction = {
    type: LP_API_ACTION,
    payload: {
      key: requestKey,
      status: LP_API_STATUS_LOADING
    }
  }
  expect(actions.setStatusLoading(requestKey)).toEqual(requestAction)
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
  expect(actions.setStatusSuccess(requestKey, 'response')).toEqual(requestAction)
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
  expect(actions.setStatusFailure(requestKey)).toEqual(requestAction)
})
