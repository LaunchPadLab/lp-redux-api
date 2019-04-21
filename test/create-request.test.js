import {
  LP_API,
  createRequest,
  createGetRequest,
  createPostRequest,
  createPutRequest,
  createPatchRequest,
  createDeleteRequest,
} from '../src/'
import { REQUEST_TYPE } from './fixtures'

test('createRequest requires a type argument', () => {
  expect(createRequest).toThrow()
})

test('createRequest requires a definition argument', () => {
  expect(() => createRequest(REQUEST_TYPE)).toThrow()
})

test('createRequest accepts object request definitions', () => {
  const options = { foo: 'bar' }
  const actionCreator = createRequest(REQUEST_TYPE, options)
  const action = actionCreator()
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, foo: 'bar', method: 'GET' })
})

test('createRequest accepts function request definitions', () => {
  const actionCreator = createRequest(REQUEST_TYPE, (arg) => ({
    foo: arg
  }))
  const action = actionCreator('bar')
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, foo: 'bar', method: 'GET' })
})

test('createRequest rejects other types of request definitions', () => {
  expect(() => createRequest(REQUEST_TYPE, 'wtf')).toThrow()
})

// Convenience functions

test('createGetRequest creates a request with method GET', () => {
  const actionCreator = createGetRequest(REQUEST_TYPE, {})
  const action = actionCreator()
  expect(action[LP_API].method).toEqual('GET')
})

test('createPostRequest creates a request with method POST', () => {
  const actionCreator = createPostRequest(REQUEST_TYPE, {})
  const action = actionCreator()
  expect(action[LP_API].method).toEqual('POST')
})

test('createPutRequest creates a request with method PUT', () => {
  const actionCreator = createPutRequest(REQUEST_TYPE, {})
  const action = actionCreator()
  expect(action[LP_API].method).toEqual('PUT')
})

test('createPatchRequest creates a request with method PATCH', () => {
  const actionCreator = createPatchRequest(REQUEST_TYPE, {})
  const action = actionCreator()
  expect(action[LP_API].method).toEqual('PATCH')
})

test('createDeleteRequest creates a request with method DELETE', () => {
  const actionCreator = createDeleteRequest(REQUEST_TYPE, {})
  const action = actionCreator()
  expect(action[LP_API].method).toEqual('DELETE')
})
