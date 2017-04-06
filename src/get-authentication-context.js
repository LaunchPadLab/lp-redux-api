import Cookies from 'js-cookie'
import isAuthenticatedWithContext from './is-authenticated-with-context'

export default function () {
  return isAuthenticatedWithContext() && JSON.parse(Cookies.get('lp_auth'))['options']
}
