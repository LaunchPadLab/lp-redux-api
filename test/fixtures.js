/* FIXTURES */

import { LP_API } from '../src'

export const REQUEST_TYPE = 'REQUEST_TYPE'
export const ACTION_TYPE_REQUEST = 'ACTION_TYPE_REQUEST'
export const ACTION_TYPE_SUCCESS = 'ACTION_TYPE_SUCCESS'
export const ACTION_TYPE_FAILURE = 'ACTION_TYPE_FAILURE'

export function actionWithURL (url, options={}) {
  return {
    [LP_API]: {
      url,
      type: REQUEST_TYPE,
      requestAction: ACTION_TYPE_REQUEST, 
      successAction: ACTION_TYPE_SUCCESS,
      failureAction: ACTION_TYPE_FAILURE,
      ...options,
    }
  }
}