## api-contracts.md

### Purpose
This document defines the principles governing API contracts exposed by the Foundy platform.

### General Principles

- APIs are explicit and stable.
- Breaking changes require versioning.
- All inputs and outputs are validated.
- Errors are deterministic and documented.

### Request Handling

- Each endpoint maps to exactly one use case.
- Request validation occurs at the interface boundary.
- Authentication context is resolved before invoking use cases.

### Response Structure

- Successful responses return structured data objects.
- Failure responses include:
  - A machine-readable error code.
  - A human-readable message.

### Error Semantics

- Domain validation errors result in client errors (4xx).
- Authorization failures result in explicit forbidden responses.
- Unexpected failures result in generic server errors without leaking internals.

### Versioning

- APIs are versioned explicitly when contracts change.
- Deprecated endpoints are supported for a defined migration window.

### Documentation

- Every public endpoint must be documented.
- Contracts must be updated alongside code changes.

