import Cookies from 'js-cookie'

export default function () {
  return JSON.parse(Cookies.get('lp_auth'))['options']
}
