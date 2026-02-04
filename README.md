# Typed API SDK Factory — Contract-First Client Generation

> **Portfolio / reference project** demonstrating how to generate **typed API SDKs**
> from schema definitions using a **contract-first pipeline**:
>
> **Zod → OpenAPI → SDK codegen → automated publishing**
>
> The goal is to show that **frameworks don’t matter — contracts do**.

---

## What this demonstrates

- 📜 **Schema-first API design** using Zod
- 🔁 **Deterministic OpenAPI generation**
- 🧰 **Typed SDK generation** with hey-api
- 📦 **Automated SDK publishing** via GitHub Actions
- 🧩 **Multiple APIs using different frameworks**
- 🎯 **Consumers that are framework-agnostic**

This repo intentionally focuses on the **SDK pipeline**, not databases, auth, caching, or infrastructure.

---

## Why this exists

In real systems:

- APIs are built by different teams
- APIs use different frameworks
- APIs evolve over time

What causes friction is not the frameworks — it’s **contract drift**.

This project demonstrates a workflow where:

- schemas are the source of truth
- OpenAPI is generated, not handwritten
- SDKs are generated, not manually maintained
- consumers rely on types, not tribal knowledge

---

## High-level architecture

```
┌──────────────┐ ┌──────────────┐
│ API A        │ │ API B        │
│ (Hono)       │ │ (Fastify)    │
│              │ │              │
│ Zod schemas  │ │ Zod schemas  │
└──────┬───────┘ └──────┬───────┘
       │                │
       ▼                ▼
   OpenAPI.json    OpenAPI.json
       │                │
       ▼                ▼
  SDK A (typed)   SDK B (typed)
       │                │
       └───────┬────────┘
               ▼
       Consumer (Frontend)
```

The consumer does not know — or care — how the APIs are implemented.

---

## Repository structure

```
packages/
├─ api-a-hono/ # API A (Hono) + Zod → OpenAPI
├─ api-b-fastify/ # API B (Fastify) + Zod → OpenAPI
├─ sdk-a/ # Generated SDK for API A (published)
├─ sdk-b/ # Generated SDK for API B (published)
└─ demo-consumer/ # Example consumer using both SDKs
```

Each API:

- defines schemas using Zod
- generates its own OpenAPI specification

Each SDK:

- is generated from OpenAPI
- exposes a small DX wrapper (`createClient`)
- is framework-agnostic

---

## Example usage (consumer)

```ts
const apiA = createApiAClient({ baseUrl: "http://localhost:4011" });
const apiB = createApiBClient({ baseUrl: "http://localhost:4012" });

// Fully typed request + response
await apiA.unitsSearch({
  query: "marth",
  weapon: "sword",
});

// Nested request with unions/enums
await apiB.battlePreview({
  attacker: { id: "u1", atk: 50 },
  defender: { id: "u2", def: 30 },
  terrain: "forest",
});
```

The consumer code is identical regardless of the API framework.

## Scripts

At the repository root:

```
pnpm generate:openapi   # Generate OpenAPI specs from Zod schemas
pnpm generate:sdk       # Generate typed SDKs from OpenAPI
pnpm dev                # Run both APIs + demo consumer
pnpm check              # Lint / typecheck / CI checks
```

## Releases

SDK packages are published to GitHub Packages using a tag-driven workflow.

- `sdk-a-vX.Y.Z` → publishes `@adamkong1995/sdk-a@X.Y.Z`
- `sdk-b-vX.Y.Z` → publishes `@adamkong1995/sdk-b@X.Y.Z`

This mirrors common internal SDK release practices where versioning is explicit and CI-controlled.

## Design principles

Contracts over implementations

Generated code over handwritten glue

Small DX wrapper over raw generated clients

Multiple APIs as first-class citizens

This mirrors patterns used in larger organizations to reduce coupling and improve developer experience.

---

## What this project intentionally omits

To keep focus on the SDK pipeline, this repo does not include:

- authentication
- databases
- caching
- retries / circuit breakers
- service-to-service networking concerns

Those are orthogonal to the core problem being demonstrated.

---

## Disclaimer

This is a learning / portfolio project intended to demonstrate architectural patterns. Production systems should apply additional validation, security, and operational safeguards.

---

## License

MIT
