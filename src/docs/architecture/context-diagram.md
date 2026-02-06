## architecture/context-diagram.md

### Purpose
This document describes the high-level structure of the Foundy system and the relationships between its major components. It is intended to provide a shared mental model for engineers working on the codebase.

### System Overview
Foundy is a multi-tenant SaaS platform providing CMS and platform functionality to businesses and agencies. The system is structured around strict separation of concerns to ensure long-term maintainability and portability.

### Primary Layers

1. **Interfaces**
   - Entry points into the system.
   - Examples: HTTP APIs, background jobs, CLI tools.
   - Responsible only for input parsing and output formatting.

2. **Use Cases**
   - Application-specific workflows.
   - Coordinate domain logic and infrastructure access.
   - Represent what the system *does*.

3. **Domain**
   - Pure business logic and rules.
   - Encodes invariants, validation, and policies.
   - Independent of frameworks and infrastructure.

4. **Adapters (Infrastructure)**
   - Technical implementations for external systems.
   - Examples: database access, authentication providers, payment gateways.
   - Replaceable without impacting domain or use cases.

5. **Core**
   - Shared primitives and abstractions.
   - Examples: Result types, error definitions, value objects.

### External Systems
- PostgreSQL (via Supabase or self-hosted)
- Object storage
- Payment providers
- Email delivery services

### Dependency Direction
Dependencies always point inward:

Interfaces → Use Cases → Domain

Adapters are depended upon via abstractions, never directly by the domain.
