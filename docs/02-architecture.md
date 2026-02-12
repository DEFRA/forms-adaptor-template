# Architecture

## System overview

```mermaid
graph LR
    A[User submits form] --> B[Forms Platform]
    B --> C[SNS Topic]
    C --> D[SQS Queue]
    D --> E[Your Adaptor]
    E --> F[Your Service]
    F --> G[Downstream System]
    E --> D
    
    style E fill:#f9f,stroke:#333,stroke-width:4px
```

Your adaptor sits between the SQS queue and your downstream systems.

## Message flow

```mermaid
sequenceDiagram
    participant Queue as SQS Queue
    participant Adaptor as Your Adaptor
    participant Handler as Your Handler
    participant Manager as Forms Manager
    participant System as Downstream System
    
    loop Every N seconds
        Adaptor->>Queue: Poll for messages
        Queue->>Adaptor: Return messages (max 10)
        
        loop For each message
            Adaptor->>Adaptor: Validate schema
            Adaptor->>Handler: handleFormSubmission()
            
            opt If needed
                Handler->>Manager: GET form definition
                Manager->>Handler: Return definition
            end
            
            Handler->>System: Process submission
            System->>Handler: Success
            
            Handler->>Adaptor: Complete
            Adaptor->>Queue: Delete message
        end
    end
```

## Component architecture

```mermaid
graph TD
    A[runTask] --> B[receiveEventMessages]
    B --> C[handleEvent]
    C --> D[handleFormSubmissionEvents]
    D --> E[mapFormAdapterSubmissionEvent]
    E --> F[Validate with Joi]
    D --> G[yourService.handleFormSubmission]
    G --> H[Your processing logic]
    D --> I[deleteEventMessage]
    
    style G fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#fcf,stroke:#333,stroke-width:2px
```

**Your code** plugs into the pink boxes. Everything else is handled by the template.

## Processing guarantees

### At-least-once delivery

Messages may be processed more than once if:
- Your handler takes longer than the visibility timeout
- Your service crashes after processing but before deletion
- AWS SQS delivers duplicates (rare)

**Make your handler idempotent** to handle duplicate processing safely.

### Ordering

Messages are processed in **approximate** FIFO order but this is not guaranteed. If strict ordering is required, consider:
- FIFO SQS queues (different setup)
- Adding sequence handling in your downstream system

### Retry behaviour

Failed messages automatically retry based on your SQS queue configuration:
- Visibility timeout: Message becomes available again after timeout
- Max receives: After N failed attempts, move to DLQ
- Redrive policy: Configure your dead letter queue

## Visibility timeout

When a message is received, it becomes invisible to other consumers for the visibility timeout period. This prevents duplicate processing whilst your handler runs.

Set this to **longer than your handler's expected execution time** (with buffer).

Example config:
```javascript
const visibilityTimeout = 300 // 5 minutes
```

## Scaling considerations

### Single instance
- Processes messages sequentially
- Simple, predictable
- Lower throughput

### Multiple instances
- Each instance polls independently
- Messages distributed across instances
- Higher throughput
- Still at-least-once delivery

### Batch size
Configure `MaxNumberOfMessages` (1-10):
- Higher: Better throughput
- Lower: Faster processing of individual messages

## Health checks

The service exposes a `/health` endpoint for monitoring:
- Returns 200 OK if healthy
- Use for Kubernetes liveness/readiness probes
- Use for load balancer health checks

## Error handling

```mermaid
graph TD
    A[Receive message] --> B{Valid schema?}
    B -->|No| C[Log error]
    C --> D[Leave in queue]
    B -->|Yes| E[Process]
    E --> F{Success?}
    F -->|Yes| G[Delete from queue]
    F -->|No| H[Log error]
    H --> D
    D --> I[Retry after visibility timeout]
```

Failed messages remain in the queue and retry automatically. Configure a dead letter queue to capture messages that fail repeatedly.
