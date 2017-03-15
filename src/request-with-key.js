import LP_API from './LP_API'

export default function (requestKey, options={}) {
  if (!requestKey) throw 'Must include \'requestKey\' argument'
  return {
    [LP_API]: {
      ...options,
      requestKey,
      actions: [`${requestKey}_REQUEST`, `${requestKey}_SUCCESS`, `${requestKey}_FAILURE`]
    }
  }
}