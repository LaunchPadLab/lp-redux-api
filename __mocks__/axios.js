export const successUrl = '/success'
export const failureUrl = '/failure'
export const unauthorizedUrl = '/unauthorized'
export const networkErrorUrl = '/network-error'

export default jest.fn((options) => {
  const url = options.url
  const isError = [failureUrl, unauthorizedUrl].includes(url)
  if (isError) return Promise.reject({ status: 401, ...options })
  return Promise.resolve(options)
})