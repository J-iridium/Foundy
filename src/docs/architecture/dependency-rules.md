## architecture/flow-diagrams.md

### Purpose
This document describes the typical execution flows within the system, focusing on request handling and background processing.

### HTTP Request Flow

1. An HTTP request enters the system through an interface route.
2. The route:
   - Parses and validates request input.
   - Resolves authentication context.
   - Invokes a single use case.
3. The use case:
   - Validates permissions.
   - Applies domain rules.
   - Interacts with repositories and external services through adapters.
4. The domain:
   - Enforces invariants.
   - Produces deterministic results.
5. The use case returns a structured result.
6. The route maps the result to an HTTP response.

### Background Job Flow

1. A job trigger (scheduler or queue) invokes a job handler.
2. The job handler:
   - Creates required dependencies.
   - Calls one or more use cases.
3. Use cases and domain logic behave identically to HTTP-driven execution.

### Error Handling
- Domain errors are expressed as explicit error types.
- Use cases translate domain errors into application-level outcomes.
- Interfaces are responsible for mapping errors to transport-specific representations.
