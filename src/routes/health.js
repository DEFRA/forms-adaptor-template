/**
 * Health endpoint for CDP container
 */
const health = {
  method: 'GET',
  path: '/health',
  handler: (_request, h) => h.response({ message: 'success' })
}

export { health }
