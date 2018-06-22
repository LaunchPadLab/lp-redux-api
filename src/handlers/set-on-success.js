import { defaultTransform } from './helpers'
import handleSuccess from './handle-success'
import { set } from '../utils'

function setOnSuccess (path, transform=defaultTransform) {
  return handleSuccess((state, action) => set(path, transform(action), state))
}

export default setOnSuccess