import { createRequest, LP_API } from '../src/'
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
  expect(action[LP_API]).toEqual({ requestKey: REQUEST_TYPE, foo: 'bar' })
})

test('createRequest accepts function request definitions', () => {
  const actionCreator = createRequest(REQUEST_TYPE, (arg) => ({
    foo: arg
  }))
  const action = actionCreator('bar')
  expect(action[LP_API]).toEqual({ requestKey: REQUEST_TYPE, foo: 'bar' })
})

test('createRequest rejects other types of request definitions', () => {
  expect(() => createRequest(REQUEST_TYPE, 'wtf')).toThrow()
})
