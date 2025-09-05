import { FormStatus } from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'

import { getJson } from './fetch.js'
import { getFormDefinition } from './manager.js'
vi.mock('./fetch.js')
vi.mock('../config.js', () => ({
  config: {
    get: vi.fn().mockReturnValueOnce('http://forms-manager')
  }
}))

describe('getDefinition', () => {
  it('should get the current definition if draft', async () => {
    const expectedDefinition = buildDefinition()
    const formId = '68a890909ab460290c289409'
    vi.mocked(getJson).mockResolvedValueOnce({
      response: {},
      body: expectedDefinition
    })
    const definition = await getFormDefinition(formId, FormStatus.Draft)
    expect(getJson).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'http://forms-manager/forms/68a890909ab460290c289409/definition/draft'
      })
    )
    expect(definition).toEqual(expectedDefinition)
  })

  it('should get the current definition if live', async () => {
    const expectedDefinition = buildDefinition()
    const formId = '68a890909ab460290c289409'
    vi.mocked(getJson).mockResolvedValueOnce({
      response: {},
      body: expectedDefinition
    })
    const definition = await getFormDefinition(formId, FormStatus.Live)
    expect(getJson).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'http://forms-manager/forms/68a890909ab460290c289409/definition/'
      })
    )
    expect(definition).toEqual(expectedDefinition)
  })
})
