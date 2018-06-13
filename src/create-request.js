import LP_API from './LP_API'

function createRequest (requestKey, definition) {
  if (!requestKey) throw new Error('Must include a key for requestWithKey() request.')
  function actionCreator (...args) {
    return {
      [LP_API]: {
        ...definition(...args),
        requestKey,
        // requestAction: `${requestKey}_REQUEST`, 
        // successAction: `${requestKey}_SUCCESS`, 
        // failureAction: `${requestKey}_FAILURE`,
      }
    }
  }
  actionCreator.toString = () => '@@lp-redux-api/' + requestKey
  return actionCreator
}

export default createRequest