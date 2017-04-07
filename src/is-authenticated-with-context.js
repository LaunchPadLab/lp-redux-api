import { getLpAuthCookie, parseObject } from './utils'

export default function (ctxStr) {
  const lpAuthCookie = getLpAuthCookie()
  const cookieObj = parseObject(lpAuthCookie)
  return cookieObj ? cookieObj.context === ctxStr : false
}