export const successUrl = '/success'
export const failureUrl = '/failure'
export const unauthorizedUrl = '/unauthorized'
export const networkErrorUrl = '/network-error'

export const responseBody = { test: true }

const statuses = {
  [successUrl]: 200,
  [failureUrl]: 400,
  [unauthorizedUrl]: 401
}

export default jest.fn(function (url) {

  const response = { 
    json: () => Promise.resolve(responseBody),
    ok: ![failureUrl, unauthorizedUrl].includes(url),
    status: statuses[url]
  }
  // Simulate server response
  return new Promise((resolve, reject) => {
    setTimeout(
      () => (url === networkErrorUrl) ? reject('Network error') : resolve(response)
    , 10)
  })
})