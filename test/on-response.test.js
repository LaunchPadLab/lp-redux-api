import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { mount } from 'enzyme'
import {
  onResponse,
  LP_API_STATUS_SUCCESS,
  LP_API_STATUS_FAILURE,
  LP_API_STATUS_LOADING,
  reducer as apiReducer 
} from '../src'

// TODO: export this from api
function lpApiAction (key, status) {
  return { type: 'LP_API_ACTION', payload: { key, status } }
}

// Use Api reducer in test stores
const reducer = combineReducers({ api: apiReducer }) 

const REQ_KEY_ONE = 'REQ_KEY_ONE'
const REQ_KEY_TWO = 'REQ_KEY_TWO'

test('onResponse renders when response is received', () => {

  const store = createStore(reducer)
  const Wrapped = () => <h1>hi</h1>
  const Wrapper = onResponse(REQ_KEY_ONE)(Wrapped)

  const ProviderWrapper = (props) =>
    <Provider store={ store }>
      <Wrapper { ...props } />
    </Provider>

  const component = mount(<ProviderWrapper renderMe={ false }/>)
  expect(component.find('h1').exists()).toBe(false)
  store.dispatch(lpApiAction(REQ_KEY_ONE, LP_API_STATUS_SUCCESS))
  expect(component.find('h1').exists()).toBe(true)
  store.dispatch(lpApiAction(REQ_KEY_ONE, LP_API_STATUS_LOADING))
  expect(component.find('h1').exists()).toBe(false)
  store.dispatch(lpApiAction(REQ_KEY_ONE, LP_API_STATUS_FAILURE))
  expect(component.find('h1').exists()).toBe(true)
})

test('onResponse renders when multiple responses are received', () => {
  
  const store = createStore(reducer)
  const Wrapped = () => <h1>hi</h1>
  const Wrapper = onResponse([REQ_KEY_ONE, REQ_KEY_TWO])(Wrapped)

  const ProviderWrapper = (props) =>
    <Provider store={ store }>
      <Wrapper { ...props } />
    </Provider>

  const component = mount(<ProviderWrapper renderMe={ false }/>)
  expect(component.find('h1').exists()).toBe(false)
  store.dispatch(lpApiAction(REQ_KEY_ONE, LP_API_STATUS_SUCCESS))
  expect(component.find('h1').exists()).toBe(false)
  store.dispatch(lpApiAction(REQ_KEY_TWO, LP_API_STATUS_SUCCESS))
  expect(component.find('h1').exists()).toBe(true)
  store.dispatch(lpApiAction(REQ_KEY_ONE, LP_API_STATUS_FAILURE))
  expect(component.find('h1').exists()).toBe(true)
})

test('onResponse renders custom loading component', () => {
  
  const store = createStore(reducer)
  const Wrapped = () => <h1>hi</h1>
  const Loading = () => <label>loading</label>
  const Wrapper = onResponse([REQ_KEY_ONE], Loading)(Wrapped)

  const ProviderWrapper = (props) =>
    <Provider store={ store }>
      <Wrapper { ...props } />
    </Provider>

  const component = mount(<ProviderWrapper renderMe={ false }/>)
  expect(component.find('h1').exists()).toBe(false)
  expect(component.find('label').exists()).toBe(true)
  store.dispatch(lpApiAction(REQ_KEY_ONE, LP_API_STATUS_SUCCESS))
  expect(component.find('h1').exists()).toBe(true)
  expect(component.find('label').exists()).toBe(false)
})
