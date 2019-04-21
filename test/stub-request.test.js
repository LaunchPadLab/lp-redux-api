import { stubRequest, LP_API } from '../src/'
import { REQUEST_TYPE } from './fixtures'

test('stubRequest requires a type argument', () => {
  expect(stubRequest).toThrow()
})

test('stubRequest accepts object data', () => {
  const stubData = { foo: 'bar' }
  const actionCreator = stubRequest(REQUEST_TYPE, stubData)
  const action = actionCreator()
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData })
})

test('stubRequest accepts function data creator', () => {
  const actionCreator = stubRequest(REQUEST_TYPE, (arg) => ({
    foo: arg
  }))
  const action = actionCreator('bar')
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData: { foo: 'bar' } })
})

test('stubRequest defaults to identity for data creator', () => {
  const actionCreator = stubRequest(REQUEST_TYPE)
  const action = actionCreator('bar')
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData: 'bar' })
})

test('stubRequest rejects other types of data definitions', () => {
  expect(() => stubRequest(REQUEST_TYPE, 'wtf')).toThrow()
})
