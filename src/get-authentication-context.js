import { getLpAuthCookie, getCookieContext } from './utils'

export default function (contextKey) {
  const lpAuthCookie = getLpAuthCookie()
  const cookieContext = getCookieContext(lpAuthCookie)
  if (!!lpAuthCookie && !!cookieContext) return cookieContext[contextKey]
}
