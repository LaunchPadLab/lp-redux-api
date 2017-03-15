export const successUrl = '/success'
export const failureUrl = '/failure'
export const networkErrorUrl = '/network-error'

export const responseBody = { test: true }

export default jest.fn(function (url) {
  const response = { 
    json: () => Promise.resolve(responseBody),
    ok: (url !== failureUrl) 
  }
  // Simulate server response
  return new Promise((resolve, reject) => {
    setTimeout(
      () => (url === networkErrorUrl) ? reject('Network error') : resolve(response)
    , 10)
  })
})