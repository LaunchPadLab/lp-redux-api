// Create an action from an action "definition."
function parseAction ({ action, payload={}, error=false }) {
  switch (typeof action) {
  // If it's an action creator, create the action
  case 'function': return action(payload)
  // If it's an action object return the action
  case 'object': return action
  // Otherwise, create a "default" action object with the given type
  case 'string': return { type: action, payload, error }
  default: throw 'Invalid action definition (must be function, object or string).'
  }
}

export default parseAction