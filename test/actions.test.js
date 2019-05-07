import * as actions from '../src/actions'

const { 
  LP_API_ACTION_NAMESPACE, 
  LP_API_STATUS_LOADING, 
  LP_API_STATUS_SUCCESS, 
  LP_API_STATUS_FAILURE,
} = actions

test('REQUEST action creator creates action of expected type', () => {
  const type = 'test request'
  const requestAction = {
    type: LP_API_ACTION_NAMESPACE + type,
    payload: {
      type,
      status: LP_API_STATUS_LOADING
    }
  }
  expect(actions.setStatusLoading(type)).toEqual(requestAction)
})

test('SUCCESS action creator creates action of expected type', () => {
  const type = 'test request'
  const requestAction = {
    type: LP_API_ACTION_NAMESPACE + type,
    payload: {
      type,
      status: LP_API_STATUS_SUCCESS,
      data: 'response',
    }
  }
  expect(actions.setStatusSuccess(type, 'response')).toEqual(requestAction)
})

test('FAILURE action creator creates action of expected type', () => {
  const type = 'test request'
  const requestAction = {
    type: LP_API_ACTION_NAMESPACE + type,
    payload: {
      type,
      status: LP_API_STATUS_FAILURE,
      data: 'error',
    }
  }
  expect(actions.setStatusFailure(type, 'error')).toEqual(requestAction)
})
