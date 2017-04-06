import { getLpAuthCookie, getCookieContext } from './utils'

export default function () {
  const lpAuthCookie = getLpAuthCookie()
  const cookieContext = getCookieContext(lpAuthCookie)
  return !!lpAuthCookie && !!cookieContext
}
