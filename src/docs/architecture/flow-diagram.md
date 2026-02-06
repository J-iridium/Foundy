## architecture/dependency-rules.md

### Purpose
This document defines strict dependency rules that must be followed to maintain architectural integrity.

### Allowed Dependencies

- Interfaces may depend on:
  - Use cases
  - Core

- Use cases may depend on:
  - Domain
  - Adapter interfaces
  - Core

- Domain may depend on:
  - Core only

- Adapters may depend on:
  - External libraries
  - Core

### Forbidden Dependencies

- Domain must not depend on:
  - Interfaces
  - Adapters
  - Frameworks
  - Configuration or environment variables

- Use cases must not depend on:
  - Framework-specific APIs
  - Concrete adapter implementations

- Interfaces must not contain:
  - Business logic
  - Domain rules

### Dependency Inversion
All infrastructure access must be expressed via interfaces defined in the domain or use case layer. Concrete implementations are provided at runtime.

### Enforcement
- Violations should be prevented via code review and tooling (linting, import rules).
- Any exception must be documented and justified.
