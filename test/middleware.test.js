jest.mock('isomorphic-fetch')

import { successUrl, failureUrl } from 'isomorphic-fetch'
import { middleware, LP_API } from '../src'
import { lpApiRequest, lpApiSuccess, lpApiFailure } from '../src/actions'

const configuredMiddleware = middleware({})

const callMiddleware = (action, opt={}) => {
  const { waitForActions = 1 } = opt
  const actionsPassed = []
  return new Promise((resolve) => {
    const next = (a) => {
      actionsPassed.push(a)
      if (actionsPassed.length === waitForActions) resolve([...actionsPassed])
    }
    return configuredMiddleware()(next)(action)
  })
}

const REQUEST_ACTION_TYPE = 'REQUEST_ACTION_TYPE'
const REQUEST_ACTION_KEY = 'REQUEST_ACTION_KEY'

const requestAction = {
  [LP_API]: {
    url: successUrl,
    requestKey: REQUEST_ACTION_KEY,
    actions: [REQUEST_ACTION_TYPE]
  }
}

test('middleware requires user and actions/types arguments', () => {
  const emptyAction = { [LP_API]: {} }
  callMiddleware(emptyAction)
    .then(() => fail('should complain about missing params'))
    .catch((err) => {
      expect(err).toExist()
    })
})

test('middleware dispatches reducer REQUEST action', () => {
  return callMiddleware(requestAction, { waitForActions: 1 }).then((actions) => {
    const apiRequestAction = actions.pop()
    expect(apiRequestAction).toEqual(lpApiRequest(REQUEST_ACTION_KEY))
  })
})

test('middleware dispatches user-defined REQUEST action', () => {
  return callMiddleware(requestAction, { waitForActions: 2 }).then((actions) => {
    const userRequestAction = actions.pop()
    expect(userRequestAction.type).toEqual(REQUEST_ACTION_TYPE)
  })
})