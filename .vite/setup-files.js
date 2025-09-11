import { afterAll, beforeAll } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

process.env.MANAGER_URL = 'http://manager'
process.env.DESIGNER_URL = 'http://designer'

const fetchMock = createFetchMock(vi)

beforeAll(async () => {
  // Setup fetch mock
  fetchMock.enableMocks()
  global.fetch = fetchMock
  global.fetchMock = fetchMock
})

afterAll(async () => {
  fetchMock.disableMocks()
})
