import { getLpAuthCookie, parseObject } from './utils'

export default function () {
  const lpAuthCookie = getLpAuthCookie()
  if (!lpAuthCookie) return false
  const lpAuthToken = getToken(lpAuthCookie)
  return !!lpAuthToken
}

function getToken(cookie) {
  const cookieObj = parseObject(cookie)
  return cookieObj ? cookieObj.token : cookie
}