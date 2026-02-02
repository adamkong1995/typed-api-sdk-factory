import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { HealthResponse } from "../schemas/health";
import {
  Address,
  CustomerProfile,
  CustomerSearchRequest,
  CustomerSearchResponse,
  CustomerStatus,
  Province,
} from "../schemas/customer";

const registry = new OpenAPIRegistry();

// Components
registry.register("HealthResponse", HealthResponse);
registry.register("CustomerStatus", CustomerStatus);
registry.register("Province", Province);
registry.register("Address", Address);
registry.register("CustomerProfile", CustomerProfile);
registry.register("CustomerSearchRequest", CustomerSearchRequest);
registry.register("CustomerSearchResponse", CustomerSearchResponse);

// Paths
registry.registerPath({
  method: "get",
  path: "/health",
  summary: "Health check",
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: HealthResponse } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/customers/{customerId}",
  summary: "Get customer profile by customerId",
  request: {
    params: z.object({
      customerId: z.string().min(1),
    }),
  },
  responses: {
    200: {
      description: "Customer profile",
      content: { "application/json": { schema: CustomerProfile } },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/customers/search",
  summary: "Search customers",
  request: {
    body: {
      content: {
        "application/json": { schema: CustomerSearchRequest },
      },
    },
  },
  responses: {
    200: {
      description: "Search results",
      content: { "application/json": { schema: CustomerSearchResponse } },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const doc = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "API A (Profile Service) — Typed SDK Demo",
    version: "0.1.0",
    description: "Zod-first banking profile API → OpenAPI → generated SDK.",
  },
  servers: [{ url: "http://localhost:4011", description: "Local dev" }],
});

process.stdout.write(JSON.stringify(doc, null, 2));
