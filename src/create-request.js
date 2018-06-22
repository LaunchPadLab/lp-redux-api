import LP_API from './LP_API'

function createActionOptions (definition, args) {
  if (typeof definition === 'object') return definition
  if (typeof definition === 'function') return definition(...args) || {}
  throw new Error('Request definition must be an object or a function.')
}

function createRequest (requestKey, definition) {
  if (!requestKey) throw new Error('Must include a request key.')
  function actionCreator (...args) {
    return {
      [LP_API]: {
        ...createActionOptions(definition, args),
        requestKey,
      }
    }
  }
  actionCreator.toString = () => '@@lp-redux-api/' + requestKey
  return actionCreator
}

export default createRequest