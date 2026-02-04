# Typed API SDK Factory — Contract-First Client Generation

> A reference project demonstrating how to build type-safe API clients from schema-first contracts, independent of backend frameworks, with automated generation, verification, and publishing.
>
> APIs publish contracts. SDKs are generated from those contracts. Consumers depend on SDKs — not implementations.

---

## What this demonstrates

- 🧩 **Framework-agnostic APIs** (Hono, Fastify)
- 📜 **Schema-first API design** using Zod
- 🔁 **Deterministic OpenAPI generation**
- 🧰 **Typed SDK generation** with hey-api
- 📦 **Per-package SDK publishing** to GitHub Packages via CI
- 🧠 **Consumers don’t care what framework the API uses** — contracts do

This repository intentionally focuses on the **SDK pipeline.**
It does not cover databases, auth, caching, or infrastructure.

---

## Why this exists

In real systems, teams often face:

- Multiple APIs written in different frameworks
- Multiple consumers (frontend, services, scripts)
- Hand-written clients that drift from backend behavior
- Runtime bugs caused by mismatched assumptions

This project demonstrates a different approach:

- APIs publish contracts.
- SDKs are generated from those contracts.
- Consumers depend on SDKs, not implementations.

---

## High-level architecture

```
Zod Schemas
   ↓
OpenAPI (generated)
   ↓
Typed SDKs (axios)
   ↓
Consumers (framework-agnostic)
```

The consumer does not know — or care — how the APIs are implemented.

---

## Repository structure

```
packages/
├─ api-a-hono/        # Profile service (Hono)
│  └─ openapi.json
├─ api-b-fastify/     # Chequing accounts service (Fastify)
│  └─ openapi.json
├─ sdk-a/             # Typed SDK for API A
│  └─ src/gen/        # Generated client code (committed)
├─ sdk-b/             # Typed SDK for API B
│  └─ src/gen/
└─ demo-consumer/     # Example consumer using both SDKs
```

Each API:

- defines schemas using Zod
- generates its own OpenAPI specification
- exposes Swagger UI for testing

Each SDK:

- is generated from OpenAPI
- provides typed axios-based functions
- is published independently

---

## APIs in this demo

### API A — Profile Service (Hono)

- Customer profiles

- Search and lookup

Swagger UI available at `/docs`

## API B — Chequing Service (Fastify)

- Customer chequing accounts

- Transaction history with cursor pagination

Swagger UI available at `/docs`

> The APIs intentionally use different frameworks to demonstrate that SDK generation does not depend on implementation details.

---

## SDKs

- @adamkong1995/sdk-a — Profile service client
- @adamkong1995/sdk-b — Chequing service client

### SDKs are:

- axios-based
- fully typed
- generated from OpenAPI
- versioned and published independently

Consumers interact with SDKs the same way regardless of how the API is built.

---

## Demo consumer

The demo-consumer package shows:

- importing both SDKs
- calling APIs without knowing or caring about backend frameworks
- shared usage patterns across services

This is where the core idea lands:

> Framework doesn’t matter — contracts do.

---

## Tooling choices

1. `Zod` — schema definition + runtime validation
2. `zod-to-openapi` — OpenAPI generation
3. `hey-api` — typed SDK generation
4. `pnpm workspaces` — monorepo management
5. `GitHub Actions` — CI verification + publishing
6. `GitHub Packages` — SDK distribution

All generated artifacts (openapi.json, src/gen) are committed and verified in CI to prevent drift.

---

## CI guarantees

The CI pipeline enforces that:

- OpenAPI specs are regenerated when schemas change
- SDKs are regenerated when OpenAPI changes
- Builds fail if generated files are out of sync

This mirrors real-world internal SDK governance.

---

## Releases

SDK packages are published to GitHub Packages using a tag-driven workflow.

- `sdk-a-vX.Y.Z` → publishes `@adamkong1995/sdk-a@X.Y.Z`
- `sdk-b-vX.Y.Z` → publishes `@adamkong1995/sdk-b@X.Y.Z`

This mirrors common internal SDK release practices where versioning is explicit and CI-controlled.

---

## What this is (and isn’t)

This is:

- a focused architecture demo
- a reference implementation
- a portfolio project reflecting real production patterns

This is not:

- a production-ready banking system
- a full auth / database / caching example

---

## Key takeaway

> Strong contracts reduce coordination cost.
> Typed SDKs scale better than handwritten clients.
> Frameworks can change — contracts shouldn’t.

---

## Disclaimer

This is a learning / portfolio project intended to demonstrate architectural patterns. Production systems should apply additional validation, security, and operational safeguards.

---

## License

MIT
