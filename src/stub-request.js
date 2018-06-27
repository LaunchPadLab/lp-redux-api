import LP_API from './LP_API'
import { LP_API_ACTION_NAMESPACE } from './actions'
import { isObject, isFunction } from 'lodash'

/**
TODO
**/

function createActionOptions (definition, args) {
  return isFunction(definition)
    ? definition(...args) || {}
    : definition
}

function stubRequest (type, definition={}) {
  if (!type) throw new Error('Must include a type for your request.')
  if (!(isObject(definition) || isFunction(definition))) throw new Error('Request definition must be an object or a function.')
  function actionCreator (...args) {
    return {
      [LP_API]: {
        isStub: true,
        stubData: createActionOptions(definition, args),
        requestKey: type,
      }
    }
  }
  actionCreator.toString = () => LP_API_ACTION_NAMESPACE + type
  return actionCreator
}

export default stubRequest