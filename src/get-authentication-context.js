import { getLpAuthCookie, parseObject } from './utils'

export default function () {
  const lpAuthCookie = getLpAuthCookie()
  const parsedCookie = parseObject(lpAuthCookie)
  if (parsedCookie) return parsedCookie.context
}
