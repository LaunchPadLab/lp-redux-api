import { requestWithKey, LP_API } from '../src/'
import { REQUEST_KEY } from './fixtures'

// /* TESTS */

test('requestWithKey requires a request key argument', () => {
  expect(requestWithKey).toThrow()
})

test('requestWithKey fills in request key and action options correctly', () => {
  const action = requestWithKey(REQUEST_KEY)
  const expectedOptions = {
    requestKey: REQUEST_KEY,
    actions: [`${REQUEST_KEY}_REQUEST`, `${REQUEST_KEY}_SUCCESS`, `${REQUEST_KEY}_FAILURE`]
  }
  expect(action[LP_API]).toEqual(expectedOptions)
})

test('requestWithKey merges action options correctly', () => {
  const action = requestWithKey(REQUEST_KEY, {
    url: '/not-overridden'
  })
  const expectedOptions = {
    url: '/not-overridden',
    requestKey: REQUEST_KEY,
    actions: [`${REQUEST_KEY}_REQUEST`, `${REQUEST_KEY}_SUCCESS`, `${REQUEST_KEY}_FAILURE`]
  }
  expect(action[LP_API]).toEqual(expectedOptions)
})

test('requestWithKey refuses action-related options', () => {
  const createBadAction = () => {
    return requestWithKey(REQUEST_KEY, {
      actions: ['not', 'allowed']
    })
  }
  expect(createBadAction).toThrow()
})