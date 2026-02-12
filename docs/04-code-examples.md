# Code examples

## Basic handler

### Minimal implementation

```javascript
/**
 * @param {import('@defra/forms-engine-plugin/engine/types.d.ts').FormAdapterSubmissionMessage} formSubmissionMessage
 */
export async function handleFormSubmission(formSubmissionMessage) {
  // Access submitted values directly
  const userName = formSubmissionMessage.data.main.fFzkDs
  
  console.log(`User submitted: ${userName}`)
  
  // Your business logic here
  await sendToYourAPI(formSubmissionMessage)
}
```

## Using raw values (recommended)

For most use cases, **use the raw values directly** from the payload. This is simpler and faster.

### Example: Send to downstream API

```javascript
/**
 * @param {import('@defra/forms-engine-plugin/engine/types.d.ts').FormAdapterSubmissionMessage} formSubmissionMessage
 */
export async function handleFormSubmission(formSubmissionMessage) {
  const { data, meta } = formSubmissionMessage
  
  // Build request payload using raw values
  const requestBody = {
    reference: meta.referenceNumber,
    submittedAt: meta.timestamp,
    applicantName: data.main.applicantName,
    applicantEmail: data.main.emailAddress,
    agreeToTerms: data.main.agreeToTerms
  }
  
  // Send to your API
  await fetch('https://your-api.example.com/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  })
  
  console.log(`Processed submission ${meta.referenceNumber}`)
}
```

## Using form definitions (advanced)

Use form definitions when you need:
- Question titles/labels
- Display strings for complex field types

### Fetching the form definition

```javascript
import { getFormDefinition } from '../lib/manager.js'

export async function handleFormSubmission(formSubmissionMessage) {
  const { formId, status, versionMetadata } = formSubmissionMessage.meta
  
  // Fetch the form definition
  const formDefinition = await getFormDefinition(
    formId,
    status,
    versionMetadata?.versionNumber
  )
  
  console.log(`Processing form: ${formDefinition.name}`)
}
```