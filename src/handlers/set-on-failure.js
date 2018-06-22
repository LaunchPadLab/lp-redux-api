import { defaultTransform } from './helpers'
import handleFailure from './handle-failure'
import { set } from '../utils'

function setOnFailure (path, transform=defaultTransform) {
  return handleFailure((state, action) => set(path, transform(action), state))
}

export default setOnFailure