export const successUrl = '/success'
export const failureUrl = '/failure'
export const unauthorizedUrl = '/unauthorized'
export const networkErrorUrl = '/network-error'

function getStatus (url) {
  if (url === failureUrl) return 422
  if (url === unauthorizedUrl) return 401
  return 200
}

export default jest.fn((options) => {
  const url = options.url
  const isError = [failureUrl, unauthorizedUrl].includes(url)
  const status = getStatus(url)
  // Send back options as data
  const response = { status, data: options }
  return isError
    ? Promise.reject(response)
    : Promise.resolve(response)
})