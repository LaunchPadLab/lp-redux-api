import { createStubRequest, LP_API } from '../src'
import { REQUEST_TYPE } from './fixtures'

test('createStubRequest requires a type argument', () => {
  expect(createStubRequest).toThrow()
})

test('createStubRequest accepts object data', () => {
  const stubData = { foo: 'bar' }
  const actionCreator = createStubRequest(REQUEST_TYPE, stubData)
  const action = actionCreator()
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData })
})

test('createStubRequest accepts function data creator', () => {
  const actionCreator = createStubRequest(REQUEST_TYPE, (arg) => ({
    foo: arg
  }))
  const action = actionCreator('bar')
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData: { foo: 'bar' } })
})

test('createStubRequest function sets data and error flag from thrown exception', () => {
  const myException = new Error('oops')
  const actionCreator = createStubRequest(REQUEST_TYPE, () => {
    throw myException
  })
  const action = actionCreator('bar')
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, isStubError: true, stubData: myException })
})

test('createStubRequest defaults to identity for data creator', () => {
  const actionCreator = createStubRequest(REQUEST_TYPE)
  const action = actionCreator('bar')
  expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData: 'bar' })
})

test('createStubRequest rejects other types of data definitions', () => {
  expect(() => createStubRequest(REQUEST_TYPE, 'wtf')).toThrow()
})
