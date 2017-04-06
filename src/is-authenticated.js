import { getLpAuthToken } from './utils'

export default function () {
  const lpAuthToken = getLpAuthToken()
  return !!lpAuthToken
}
