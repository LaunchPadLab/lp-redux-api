[![npm version](https://badge.fury.io/js/%40launchpadlab%2Flp-redux-api.svg)](https://badge.fury.io/js/%40launchpadlab%2Flp-redux-api)

# lp-redux-api

Action creators and reducers for making API requests with redux.

```jsx
// Define an API action

import { createRequest } from '@launchpadlab/lp-redux-api'

const fetchUser = createRequest('FETCH_USER', (id) => ({
  url: '/users/' + id,
}))

// Dispatch the action from a component (mapDispatchToProps not shown)

function Component({ fetchUser }) {
  return <button onClick={() => fetchUser(5)}> Fetch user with id: 5 </button>
}

// Store the response in a reducer

import { handleActions } from 'redux-actions'
import { setOnSuccess } from '@launchpadlab/lp-redux-api'

const reducer = handleActions(
  {
    [fetchUser]: setOnSuccess('user'),
  },
  {}
)

// state.user will contain the response when the request completes.
```

The key functions in this library are:

- `createRequest(key, requestInfo)` - this function allows you to define a redux action that makes an API request asynchronously. By default, API requests are made using [lp-requests](https://github.com/LaunchPadLab/lp-requests), although this is configurable.

- `setOnSuccess(path) | setOnFailure(path)` - these functions allow you to easily store the responses of API actions in your redux store.

Additional usage information, as well as a list of other helpers this library provides, can be found in the [documentation](#documentation).

## Documentation

Documentation and usage info can be found in [docs.md](docs.md).

## Migration Guides

- [v5.0.0](migration-guides/v5.0.0.md)
- [v6.0.0](migration-guides/v6.0.0.md)
- [v7.0.0](migration-guides/v7.0.0.md)

## Contribution

This package follows the Opex [NPM package guidelines](https://github.com/LaunchPadLab/opex/blob/master/gists/npm-package-guidelines.md). Please refer to the linked document for information on contributing, testing and versioning.
