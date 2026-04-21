# Forms Adaptor Documentation

Build adaptors to process form submissions from AWS SQS queues.

If you wish to take advantage of this, please raise a request in our `#defra-forms-support` slack channel.

## Quick links

1. [**Overview**](01-overview.md) - How the system works
2. [**Architecture**](02-architecture.md) - System diagrams and flow
3. [**Payload structure**](03-payload-structure.md) - Understanding submission data
4. [**Code examples**](04-code-examples.md) - Implementation patterns

## Quick start

1. Clone the template:

   ```bash
   git clone https://github.com/DEFRA/forms-adaptor-template.git
   cd forms-adaptor-template
   npm install
   ```

2. Replace [src/service/example-logger.js](../src/service/example-logger.js) with your handler:

   ```javascript
   export async function handleFormSubmission(formSubmissionMessage) {
     // Your processing logic
     await sendToYourAPI(formSubmissionMessage.data)
   }
   ```

3. Update [src/service/index.js](../src/service/index.js):

   ```javascript
   import * as yourService from './your-service.js'

   export async function handleEvent(messages) {
     return handleFormSubmissionEvents(messages, yourService)
   }
   ```

4. Configure your SQS queue in [.env](../.env) or environment variables

5. Run locally:
   ```bash
   npm run dev
   ```

## What you get

- ✅ SQS message polling
- ✅ Schema validation
- ✅ Error handling and retry logic
- ✅ Logging and monitoring
- ✅ Health check endpoint
- ✅ Docker support
- ✅ TypeScript definitions

## What you build

Your `handleFormSubmission` function that processes each submission and integrates with your systems.

## Common use cases

- Upload to SharePoint
- Capture payments
- Send notifications
- Store in databases
- Call downstream APIs
- Generate audit logs
- Trigger workflows

## Need help?

- Check [code examples](04-code-examples.md) for common patterns
- Review [payload structure](03-payload-structure.md) for data format
- See [architecture](02-architecture.md) for system design
- Read main [README](../README.md) for setup details
