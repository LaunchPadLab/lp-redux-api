import { 
  reducer, 
  selectors,
  LP_API_STATUS_LOADING, 
  LP_API_STATUS_SUCCESS,
} from '../src/'
import * as actions from '../src/actions'
  
const REQUEST_KEY = 'test request'

test('selectors.status selects correctly', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusLoading(REQUEST_KEY))
  const fullState = {
    api: newState
  }
  expect(selectors.status(fullState, REQUEST_KEY)).toEqual(LP_API_STATUS_LOADING)
})

test('selectors.status can handle a custom reducer path', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusSuccess(REQUEST_KEY))
  const fullState = {
    customApi: newState
  }
  expect(selectors.status(fullState, REQUEST_KEY, 'customApi')).toEqual(LP_API_STATUS_SUCCESS)
})

test('selectors.status expects reducer to be mounted', () => {
  const fullState = {}
  expect(() => selectors.status(fullState, REQUEST_KEY)).toThrow()
})

test('selectors.hasStatus returns false when state is empty', () => {
  const stateWithoutStatus = {
    api: {}
  }
  expect(selectors.hasStatus(stateWithoutStatus, REQUEST_KEY)).toEqual(false)
})

test('selectors.hasStatus returns true when state has status', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusLoading(REQUEST_KEY))
  const fullState = {
    api: newState
  }
  expect(selectors.hasStatus(fullState, REQUEST_KEY)).toEqual(true)
})

test('selectors.isLoading returns false when status is not loading', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusSuccess(REQUEST_KEY))
  const fullState = {
    api: newState
  }
  expect(selectors.isLoading(fullState, REQUEST_KEY)).toEqual(false)
})

test('selectors.isLoading returns true when status is loading', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusLoading(REQUEST_KEY))
  const fullState = {
    api: newState
  }
  expect(selectors.isLoading(fullState, REQUEST_KEY)).toEqual(true)
})

test('selectors.isSuccess returns false when status is not success', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusLoading(REQUEST_KEY))
  const fullState = {
    api: newState
  }
  expect(selectors.isSuccess(fullState, REQUEST_KEY)).toEqual(false)
})

test('selectors.isSuccess returns true when status is success', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusSuccess(REQUEST_KEY))
  const fullState = {
    api: newState
  }
  expect(selectors.isSuccess(fullState, REQUEST_KEY)).toEqual(true)
})

test('selectors.isFailure returns false when status is not failure', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusSuccess(REQUEST_KEY))
  const fullState = {
    api: newState
  }
  expect(selectors.isFailure(fullState, REQUEST_KEY)).toEqual(false)
})

test('selectors.isFailure returns true when status is failure', () => {
  const initialState = {}
  const newState = reducer(initialState, actions.setStatusFailure(REQUEST_KEY))
  const fullState = {
    api: newState
  }
  expect(selectors.isFailure(fullState, REQUEST_KEY)).toEqual(true)
})

