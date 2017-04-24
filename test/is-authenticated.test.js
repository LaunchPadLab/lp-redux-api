import { isAuthenticated } from '../src'
import Cookies from 'js-cookie'

test('isAuthenticated returns false when lp-auth cookie is not set', () => {
  Cookies.set('lp-auth', 'hey')
  // console.log(Cookies)
  expect(isAuthenticated()).toEqual(false)
})
