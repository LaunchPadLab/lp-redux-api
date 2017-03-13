export const successUrl = '/success'
export const failureUrl = '/failure'

export default jest.fn(function (url) {
  const json = { 
    ok: url !== failureUrl 
  }
  const response = { json: () => Promise.resolve(json) }
  // Simulate server response
  return new Promise((resolve) => {
    setTimeout(resolve(response), 100)
  })
})