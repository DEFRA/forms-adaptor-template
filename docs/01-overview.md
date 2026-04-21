# Overview

## What is this?

A template for building form submission processors that consume messages from AWS SQS queues.

When a user submits a form through the Defra Forms platform, the submission is published to SNS, which forwards it to your SQS queue. This service polls the queue, processes each message one-by-one, and deletes them once handled successfully.

## Use cases

Build adaptors to:

- Upload submissions to SharePoint
- Capture payments
- Send notifications
- Log for audit purposes
- Push to downstream APIs
- Transform data for legacy systems
- etc

## How it works

1. **Poll**: Service continuously polls your SQS queue for new messages
2. **Parse**: Each message is validated against the submission schema
3. **Process**: Your handler function processes the submission
4. **Delete**: Successfully processed messages are deleted from the queue
5. **Repeat**: Polling continues indefinitely

## Key features

- **Sequential processing**: Messages processed one at a time
- **Automatic retry**: Failed messages remain in queue for retry
- **Type safety**: Full TypeScript definitions for submission payloads
- **Form metadata**: Access to form definitions for advanced use cases
- **Visibility timeout**: Prevents duplicate processing during handler execution

## Getting started

1. Clone the template:

   ```bash
   git clone https://github.com/DEFRA/forms-adaptor-template.git
   ```

2. Replace the example service handler in [src/service/index.js](../src/service/index.js):

   ```javascript
   import { handleFormSubmissionEvents } from './events.js'
   import * as yourService from './your-service.js'

   export async function handleEvent(messages) {
     return handleFormSubmissionEvents(messages, yourService)
   }
   ```

3. Implement your handler:
   ```javascript
   /**
    * @param {import('@defra/forms-engine-plugin/engine/types.d.ts').FormAdapterSubmissionMessage} formSubmissionMessage
    */
   export async function handleFormSubmission(formSubmissionMessage) {
     // Your processing logic here
   }
   ```

## What's included

- SQS polling and message handling
- Schema validation
- Error handling and logging
- Health check endpoint
- Docker support
- Test harness for local development

## What you need to build

Your `handleFormSubmission` function that processes the submission and performs your business logic.
