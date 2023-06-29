import { createStubRequest, LP_API } from '../src'
import { LP_API_ACTION_NAMESPACE } from '../src/actions'
import { REQUEST_TYPE } from './fixtures'

describe('createStubRequest', () => {
  test('requires a type argument', () => {
    expect(createStubRequest).toThrow()
  })

  test('accepts object data', () => {
    const stubData = { foo: 'bar' }
    const actionCreator = createStubRequest(REQUEST_TYPE, stubData)
    const action = actionCreator()
    expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData })
  })

  test('accepts function data creator', () => {
    const actionCreator = createStubRequest(REQUEST_TYPE, (arg) => ({
      foo: arg
    }))
    const action = actionCreator('bar')
    expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData: { foo: 'bar' } })
  })

  test('accepts delay option', () => {
    const stubData = { foo: 'bar' }
    const actionCreator = createStubRequest(REQUEST_TYPE, stubData, { delay: 500 })
    const action = actionCreator()
    expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub:true, stubData, delay: 500 })
  })

  test('function sets data and error flag from thrown exception', () => {
    const myException = new Error('oops')
    const actionCreator = createStubRequest(REQUEST_TYPE, () => {
      throw myException
    })
    const action = actionCreator('bar')
    expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, isStubError: true, stubData: myException })
  })

  test('defaults to identity for data creator', () => {
    const actionCreator = createStubRequest(REQUEST_TYPE)
    const action = actionCreator('bar')
    expect(action[LP_API]).toEqual({ type: REQUEST_TYPE, isStub: true, stubData: 'bar' })
  })

  test('rejects other types of data definitions', () => {
    expect(() => createStubRequest(REQUEST_TYPE, 'wtf')).toThrow()
  })

  test('has the namespaced action type as its string representation', () => {
    const actionCreator = createStubRequest(REQUEST_TYPE)
    expect(actionCreator.toString()).toEqual(LP_API_ACTION_NAMESPACE+REQUEST_TYPE)
  })

  test('has the namespaced action type set to the special `type` property', () => {
    const actionCreator = createStubRequest(REQUEST_TYPE)
    expect(actionCreator.type).toEqual(LP_API_ACTION_NAMESPACE+REQUEST_TYPE)
  })
})
