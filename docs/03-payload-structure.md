# Payload structure

## FormAdapterSubmissionMessage type

Your handler receives a message of type `FormAdapterSubmissionMessage`:

```typescript
import('@defra/forms-engine-plugin/engine/types.d.ts').FormAdapterSubmissionMessage
```

## Structure overview

```javascript
{
  messageId: string,          // SQS message ID
  recordCreatedAt: Date,      // When this service received it
  meta: { ... },              // Submission metadata
  data: {                     // User's submission data
    main: { ... },            // Standard answers
    repeaters: { ... },       // Repeatable answers
    files: { ... }            // File references (download URL and file IDs - not the binary content)
  }
}
```

## Meta section

Contains form metadata and submission context.

```javascript
{
  meta: {
    schemaVersion: 1,
    timestamp: "2025-09-11T14:53:58.466Z",     // Submission time
    referenceNumber: "1A5-F72-704",            // Unique reference
    formName: "Simple Form",                   // Display name
    formId: "68c2de0feccb168dd0fbe99e",        // Form UUID
    formSlug: "simple-form",                   // URL slug
    status: "live",                            // "live" or "draft"
    isPreview: false,                          // Preview submission?
    notificationEmail: "example@defra.gov.uk", // Form owner email
    versionMetadata: {                         // Form version info
      versionNumber: 9,
      createdAt: "2025-09-11T14:49:39.906Z"
    }
  }
}
```

### Key fields

- **referenceNumber**: Unique submission identifier, shown to users
- **timestamp**: ISO 8601 timestamp of submission
- **formId**: Use to fetch form definition from Forms Manager
- **status**: Which version was submitted (live/draft)
- **versionNumber**: Specific form version submitted

## Data section

Contains the actual form answers.

### Structure

```javascript
{
  data: {
    main: { ... },       // Single-answer fields
    repeaters: { ... },  // Repeating sections
    files: { ... }       // File uploads
  }
}
```

### Main

Single-value fields keyed by component name.

```javascript
{
  main: {
    "fFzkDs": "Aragorn",           // TextField
    "applicantEmail": "user@example.com",
    "numberOfItems": 5,          // NumberField
    "agreeToTerms": true,          // CheckboxesField
    "preferredContact": "email"    // RadiosField
  }
}
```

**Component names** (like `fFzkDs`) are auto-generated unique identifiers, not human-readable. To get the question text, you need the form definition.

### Repeaters

Repeating sections where users can add multiple items.

```javascript
{
  repeaters: {
    "peopleLivingAtHome": [        // Repeater name
      {
        "name": "Joe Bloggs",
        "age": "42"
      },
      {
        "name": "Jane Doe",
        "age": "45"
      }
    ]
  }
}
```

Each repeater is an **array of objects**, where each object contains the same field names.

### Files

File upload metadata.

```javascript
{
  files: {
    "proofOfAddress": [           // Field name
      {
        "id": "dcbabeac-d828-451e-99cc-08c5e4e71e3f",
        "url": "https://forms.defra.gov.uk/file-download/dcbabeac-d828-451e-99cc-08c5e4e71e3f"
      }
    ]
  }
}
```

Each file field is an **array** (files can accept multiple uploads).

## Common patterns

### Accessing a simple field

```javascript
const userName = formSubmissionMessage.data.main.fFzkDs
```

### Accessing a repeater

```javascript
const people = formSubmissionMessage.data.repeaters.peopleLivingAtHome
people.forEach(person => {
  console.log(person.name)
})
```

### Accessing file uploads

```javascript
const documents = formSubmissionMessage.data.files.uploadDocument
documents.forEach(file => {
  console.log(file.userDownloadLink)
})
```

### Getting metadata

```javascript
const { referenceNumber, timestamp, formName } = formSubmissionMessage.meta
```