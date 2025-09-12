import { health } from '../routes/health.js'

/**
 * Router plugin, needed to return a 200 on ECS /health endpoint
 */
const router = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route([health])
    }
  }
}

export { router }
