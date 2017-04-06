import Cookies from 'js-cookie'

export default function () {
  const lpAuthCookie = Cookies.get('lp_auth')
  return !!lpAuthCookie && cookieHasContext(lpAuthCookie)
}

function cookieHasContext (cookie) {
  return !!JSON.parse(cookie)['options']
}
