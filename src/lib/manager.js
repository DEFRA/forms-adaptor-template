import { FormStatus } from '@defra/forms-model'

import { config } from '../config.js'
import { getJson } from './fetch.js'

const managerUrl = config.get('managerUrl')

/**
 * Gets the form definition from the Forms Manager API∂
 * @param {string} formId
 * @param {FormStatus} formStatus
 * @returns {Promise<import('@defra/forms-model').FormDefinition>}
 */
export async function getFormDefinition(formId, formStatus) {
  const formUrl = new URL(
    `/forms/${formId}/definition/${formStatus === FormStatus.Draft ? FormStatus.Draft : ''}`,
    managerUrl
  )
  const { body } = await getJson(formUrl)

  return body
}
