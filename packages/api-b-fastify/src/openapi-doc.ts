import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { HealthResponse } from "../schemas/health";
import {
  AccountStatus,
  ChequingAccount,
  Currency,
  ListAccountsResponse,
  ListTransactionsQuery,
  ListTransactionsResponse,
  Money,
  Transaction,
  TransactionType,
} from "../schemas/chequing";

export function buildOpenApiDoc() {
  const registry = new OpenAPIRegistry();

  // Components
  registry.register("HealthResponse", HealthResponse);

  registry.register("Currency", Currency);
  registry.register("Money", Money);
  registry.register("AccountStatus", AccountStatus);
  registry.register("ChequingAccount", ChequingAccount);
  registry.register("ListAccountsResponse", ListAccountsResponse);

  registry.register("TransactionType", TransactionType);
  registry.register("Transaction", Transaction);
  registry.register("ListTransactionsQuery", ListTransactionsQuery);
  registry.register("ListTransactionsResponse", ListTransactionsResponse);

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
    path: "/customers/{customerId}/chequing-accounts",
    summary: "List chequing accounts for a customer",
    request: {
      params: z.object({
        customerId: z.string().min(1),
      }),
    },
    responses: {
      200: {
        description: "Accounts",
        content: { "application/json": { schema: ListAccountsResponse } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/chequing-accounts/{accountId}/transactions",
    summary: "List transactions for a chequing account (cursor pagination)",
    request: {
      params: z.object({
        accountId: z.string().min(1),
      }),
      query: ListTransactionsQuery,
    },
    responses: {
      200: {
        description: "Transactions",
        content: { "application/json": { schema: ListTransactionsResponse } },
      },
    },
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "API B (Chequing Service) — Typed SDK Demo",
      version: "0.1.0",
      description: "Zod-first chequing accounts API → OpenAPI → generated SDK.",
    },
    servers: [{ url: "http://localhost:4012", description: "Local dev" }],
  });
}
