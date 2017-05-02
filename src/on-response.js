import { connect } from 'react-redux'
import { LP_API_STATUS_SUCCESS, LP_API_STATUS_FAILURE } from './actions'
import selectStatus from './select-status'
import { onLoad, compose } from './utils'

/**
 * A function that returns a React HOC to handle rendering that depends on an API response. 
 * A combination of {@link selectStatus} and `onMount` from `lp-utils`.
 *
 * @param {String|Array} requestKeys - A key or set of keys corresponding to `lp-redux-api` requests.
 * @param {Function} [LoadingComponent = null] - A component to render during the loading state.
 * @returns {Function} - A higher order component (HOC).
 * @example
 *
 * import { REQ_USERS, requestUsers } from 'actions'
 *
 *  function MyComponent (name) {
 *    return (
 *      <p>{name}</p>
 *    )
 *  }
 *
 *  export default compose(
 *    onMount(requestUsers),
 *    onResponse(REQ_USERS),
 *  )(MyComponent)
 *  
 *  // requestUsers() dispatches an LP_API action with key 'REQ_USERS' on component mount.
 *  // When the status of 'REQ_USERS' request becomes 'success' or 'failure', the component will render.
 *  // Otherwise, the default {@link onMount} loading component will be rendered.
**/

export default function onResponse (requestKeys=[], LoadingComponent) {
  if (!Array.isArray(requestKeys)) requestKeys = [requestKeys]

  return WrappedComponent => {

    // Function passed to onMount- returns true when all statuses are either success or failure
    function renderWhen (props) {
      return requestKeys.every(key => {
        const status = props[statusKey(key)]
        return [LP_API_STATUS_SUCCESS, LP_API_STATUS_FAILURE].includes(status)
      })
    }

    // Retrieving request statuses from state
    function mapStateToProps (state) {
      const props = {}
      requestKeys.forEach(key => {
        props[statusKey(key)] = selectStatus(key, state)
      })
      return props
    }

    // Wrap with onMount
    return compose(
      connect(mapStateToProps),
      onLoad(renderWhen, LoadingComponent),
    )(WrappedComponent)
  }
}

function statusKey (key) {
  return `${key}_STATUS`
}
