const actions = {
  LP_API_REQUEST: (state, key) => ({ ...state, [key]: 'loading' }),
  LP_API_SUCCESS: (state, key) => ({ ...state, [key]: 'success' }),
  LP_API_FAILURE: (state, key) => ({ ...state, [key]: 'failure' }),
}

export default function(state, { type, payload }) {
  const reducer = actions[type]
  if (!reducer) return state
  return reducer(state, payload)
}