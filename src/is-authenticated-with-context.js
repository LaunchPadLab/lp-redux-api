import { getLpAuthCookie, parseObject } from './utils'

export default function (ctxPath) {
  const lpAuthCookie = getLpAuthCookie()
  const cookieObj = parseObject(lpAuthCookie)
  return cookieObj ? cookieObj.context === ctxPath : false
}