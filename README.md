[ ![Codeship Status for LaunchPadLab/lp-redux-api](https://app.codeship.com/projects/5b514ba0-ebe2-0134-f96d-2efd70753ac1/status?branch=master)](https://app.codeship.com/projects/208187) [![Code Climate](https://codeclimate.com/repos/58c99b00ba50b0028800074d/badges/cd7121b30bd1ff8d2efc/gpa.svg)](https://codeclimate.com/repos/58c99b00ba50b0028800074d/feed)

# lp-redux-api
Api and middleware for redux applications. While configurable, the basics are:
+ Uses `isomorphic-fetch` under the hood
+ Extracts the json response and throws for any non-2xx response
+ By default, includes the CSRF token for PATCH, POST, and PUT requests (if it exists)
+ If configured, includes the JWT in the request, or immediately rejects if the JWT doesn't exist.

---

## Contents
+ [Quick Start - Middleware](#quick-start---middleware)
 + [Install](#install)
 + [Action Creator](#action-creator)
+ [Quick Start - Api](#quick-start---api)
+ [Docs](#docs)
 + [Middleware Configuration](#middleware-configuration)

---

## Quick Start - Middleware

### Install
Wherever you create your Redux store:
```
import { applyMiddleware, createStore } from 'redux'
import { middleware as apiMiddleware } from '@launchpadlab/lp-redux-api'

...

const middleware = applyMiddleware(
  apiMiddleware(),
  ... other middleware
)

...
const reducer = ...
const initialState = ...
const store = createStore(reducer, initialState, middleware)

...


```

### Action Creator
Wherever your actions are:

```
import { LP_API } from '@launchpadlab/lp-redux-api'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

export function fetchUser (id) {
  return {
    [LP_API]: {
      url: `users/${id}`,
      actions: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
    },
  }
}
```

When this action is dispatched to the store, the Api Middleware will take over and:
+ Dispatch a `USER_REQUEST` action
+ Perform the api request
+ Dispatch a `USER_SUCCESS` action with the response payload if the api request is successful
+ Dispatch a `USER_FAILURE` action with the response payload if the api request fails

Actions can be defined in the following ways:

+ As an action type `string` (shown above)
+ As an action `object`
+ As an action creator `function` - will get passed the success/error response

If you'd rather use it, `types` is an alias for `actions`.

## Quick Start - Api
You can use the api logic directly to make requests and handle the Promise yourself. You get the same benefits in terms of CSRF and JWT authentication, but no actions are dispatched.

```
import { api } from '@launchpadlab/lp-redux-api'

const userData = {
  firstName: 'Dave',
  lastName: 'Corwin'
}

api.post('users', userData, true)
  .then(json => console.log(json))
  .catch(error => console.log(error))
```
## Docs
### Middleware Configuration
The middleware can be configured when created by passing in an object with the following options, defaults are specified:
```
{
  /*
   * Require JWT on each request by default. Can be overridden on a per action * basis.
   */
  authenticated: false,

  /*
   * Require CSRF on applicable requests. If `true` uses the default selector
   * of `meta[name='csrf-token']` to find the token. If a string is specified,
   * then it will look for a `meta` tag with that name.
   */
  csrf:          true,

  /*
   * The key in localStorage where the JWT is stored.
   */
  tokenName:    'token',

  /*
   * An action creator to be called and dispatched when the server rejects a
   * request with a status of `unauthorized`.
   */
  onUnauthorized: null,

  /*
   * root path to be prepended to `url` provided in the action.
   */
  root:           null,
}
```

