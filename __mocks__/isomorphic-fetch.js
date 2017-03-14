export const successUrl = '/success'
export const failureUrl = '/failure'

export default jest.fn(function (url) {
  const response = { 
    json: () => Promise.resolve({}),
    ok: url !== failureUrl 
  }
  // Simulate server response
  return new Promise((resolve) => {
    setTimeout(resolve(response), 10)
  })
})