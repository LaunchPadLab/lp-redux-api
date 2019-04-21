export const successUrl = '/success'
export const failureUrl = '/failure'
export const unauthorizedUrl = '/unauthorized'
export const networkErrorUrl = '/network-error'

export default jest.fn((options) => {
  const url = options.url
  const isError = [failureUrl, unauthorizedUrl].includes(url)
  const status = isError ? 401 : 200
  // Send back options as data
  const response = { status, data: options }
  return isError
    ? Promise.reject(response)
    : Promise.resolve(response)
})