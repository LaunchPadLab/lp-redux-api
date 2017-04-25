# get-authentication-context

A helper function to retrieve the authentication context for the 
authenticated user.

This function returns the context string when the LP Redux Api cookie exists, 
contains a token, and contains a context.

This function returns `undefined` when there is no context present,
or if the LP Redux API cookie does not exist.

**Examples**

```javascript
// After an 'admin' signs in
getAuthenticationContext() // 'admin'

getAuthenticationContext() // 'non-admin'

// After a user with no context signs in
getAuthenticationContext() // undefined 

// After sign out
getAuthenticationContext() // undefined
```

Returns **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# is-authenticated

A helper function to determine if the current user is authenticated.
This returns true when the LP Redux Api cookie exists and contains a
token.

Note, this does not **validate** the token, it only checks for
presence, validation must be done on the server.

**Examples**

```javascript
// After sign in
isAuthenticated() // true

// After sign out
isAuthenticated() // false
```

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# is-authenticated-with-context

A helper function to determine if the current user is authenticated
for a specific context. This is useful if the client needs to know
more about the type of user that is logged in.

This returns true when the LP Redux Api cookie exists, contains a
token, and contains the specified context.

Note, this does not **validate** the token, it only checks for
presence, validation must be done on the server.

**Parameters**

-   `context` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a context that corresponds to one provided by the server

**Examples**

```javascript
// After an 'admin' signs in
isAuthenticatedWithContext('admin') // true

isAuthenticatedWithContext('non-admin') // false

isAuthenticatedWithContext() // false

// After sign out
isAuthenticatedWithContext('admin') // false

isAuthenticatedWithContext('non-admin') // false

isAuthenticatedWithContext() // false
```

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# LP_API

A unique key that identifies dispatched actions to be handled by the LP
Redux Api middleware. This is implemented as a Symbol, instead of a String
to guarantee uniqueness.

The params provided as the value include anything that is supported by
[LP Redux Api Middleware](Middlware)

**Examples**

```javascript
// An example action creator
function fooAction () {
  return {
    [LP_API]: {
      url: 'http://foo.com/posts',
      types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      // ...
    }
  }
}
```

# reducer

Stores the status of API requests in your state.
Statuses are stored for all requests with a `requestKey` (including those created by [requestWithKey](requestWithKey)),
and can be retrieved by using [selectStatus](selectStatus).

To use this reducer, add it to `combineReducers()` under the `api` key. You can use a different key if you'd like,
but you will need to reference it explicitly when using [selectStatus](selectStatus).

**Examples**

```javascript
// When creating store, attach reducer

import { reducer as apiReducer } from 'lp-redux-api'

combineReducers({ 
  api: apiReducer,
  ...
})

// Now you can keep track of request status elsewhere in your app

import { requestKey, selectStatus } from 'lp-redux-api'

const REQ_FETCH_USERS = 'REQ_FETCH_USERS'
dispatch(requestWithKey(REQ_FETCH_USERS, { url: '/users' }))

selectStatus(REQ_FETCH_USERS, state) // -> 'loading'
```

# request-with-key

An action creator that automatically adds a requestKey and default actions to your request.
These default actions can then be picked up by [setFromRequest](setFromRequest).

Default actions are dynamically named using the key provided, like so:

-   `<requestKey>_REQUEST`
-   `<requestKey>_SUCCESS`
-   `<requestKey>_FAILURE`

**Parameters**

-   `requestKey` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A unique key that you can use to reference your request in [setFromRequest](setFromRequest) or [selectStatus](selectStatus)
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)](default {})** Config options that you would normally include in an [LP_API] action, such as `url` and `method`

**Examples**

```javascript
export const REQ_FETCH_USERS = 'REQ_FETCH_USERS'

export const fetchUsers = requestWithKey(REQ_FETCH_USERS, {
  url: '/users'
})

fetchUsers()

// {
//   [LP_API]: {
//     url: '/users',
//     requestKey: 'REQ_FETCH_USERS',
//     actions: ['REQ_FETCH_USERS_REQUEST', 'REQ_FETCH_USERS_SUCCESS', 'REQ_FETCH_USERS_FAILURE']
//   }
// }
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** An [LP_API] action that can be handled by the lp-redux-api middleware.

# select-status

A function that, given the redux state, returns the status of a given API request. 
In order to work, the `lp-redux-api` reducer must be included in `combineReducers()`.

The status of a request can be one of the following exported constants:

-   `LP_API_STATUS_LOADING`: `'loading'`
-   `LP_API_STATUS_SUCCESS`: `'success'`
-   `LP_API_STATUS_FAILURE`: `'failure'`

**Parameters**

-   `requestKey` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A unique key that references a request created by [requestWithKey](#requestwithkey)
-   `state` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The state of your redux store
-   `slice` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** The path to the slice of state handled by the `lp-redux-api` reducer (optional, default `'api'`)

**Examples**

```javascript
// When creating store, attach reducer

import { reducer as apiReducer } from 'lp-redux-api'

combineReducers({ 
  api: apiReducer,
  ...
})

// Now you can keep track of request status elsewhere in your app

import { requestKey, selectStatus } from 'lp-redux-api'

const REQ_FETCH_USERS = 'REQ_FETCH_USERS'
dispatch(requestWithKey(REQ_FETCH_USERS, { url: '/users' }))

selectStatus(REQ_FETCH_USERS, state) // -> 'loading'
```

Returns **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A string constant indicating request status

# set-from-request

A function that creates action handlers for actions generated by [requestWithKey](requestWithKey).
These handlers set data in the state from the response(s) of a given request.

By default, setFromRequest creates handlers for `<requestKey>_SUCCESS` and `<requestKey>_FAILURE` action types.
You can override either of these handlers in your reducer by creating handlers explicitly.

Current behavior (subject to change):

-   If the request is successful, the response will be set at `<path>.data`, and `<path>.error` will be `null`
-   If the request is unsuccessful, the response will be set at `<path>.error`, and `<path>.data` will be `null`

**Parameters**

-   `requestKey` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A unique key that references a request created by [requestWithKey](requestWithKey)
-   `path` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A path (in dot notation) indicating where the data will be set in the state

**Examples**

```javascript
const REQ_FETCH_USERS = 'REQ_FETCH_USERS'

 const initialState = {
  user: {
    data: null,
    error: null
  }
 }

export const reducer = (state=initialState, action) => {
  const handlers = {
    ...setFromRequest(REQ_FETCH_USERS, 'user')
  }
  const handler = handlers[action.type]
  if (!handler) return state
  return handler(state, action)
}

// On success, this call returns userData
const fetchUsers = requestWithKey(REQ_FETCH_USERS, { url: '/users' })

dispatch(fetchUsers()) 

// On success, new state will be:
// {
//    user: {
//      data: userData,
//      error: null
//    } 
// }
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** An hash of action handlers that can be included in a reducer by using object spread syntax
