import Fastify from "fastify";
import { z } from "zod";
import { buildOpenApiDoc } from "./openapi-doc";
import { ACCOUNTS, TRANSACTIONS } from "./routes/data";
import { HealthResponse } from "../schemas/health";
import {
  ListAccountsResponse,
  ListTransactionsQuery,
  ListTransactionsResponse,
  ChequingAccount,
  Transaction,
} from "../schemas/chequing";

const app = Fastify({ logger: true });

// --- Docs endpoints (spec only; Swagger UI later) ---
app.get("/openapi.json", async (_req, reply) => {
  return reply.send(buildOpenApiDoc());
});

// --- API endpoints ---
app.get("/health", async (_req, reply) => {
  const payload = HealthResponse.parse({ ok: true });
  return reply.send(payload);
});

app.get("/customers/:customerId/chequing-accounts", async (req, reply) => {
  const params = z.object({ customerId: z.string().min(1) }).parse(req.params);

  const accounts = ACCOUNTS.filter(
    (a) => a.customerId === params.customerId,
  ).map((a) => ChequingAccount.parse(a));

  const payload = ListAccountsResponse.parse({ accounts });
  return reply.send(payload);
});

app.get("/chequing-accounts/:accountId/transactions", async (req, reply) => {
  const params = z.object({ accountId: z.string().min(1) }).parse(req.params);
  const query = ListTransactionsQuery.parse(req.query);

  const all = TRANSACTIONS.filter((t) => t.accountId === params.accountId)
    // newest first
    .sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1))
    .map((t) => Transaction.parse(t));

  // cursor is just an index encoded as string for demo
  const start = query.cursor ? Number(query.cursor) : 0;
  const slice = all.slice(start, start + query.limit);
  const next =
    start + query.limit < all.length ? String(start + query.limit) : undefined;

  const payload = ListTransactionsResponse.parse({
    nextCursor: next,
    transactions: slice,
  });

  return reply.send(payload);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 4012);
  const host = "0.0.0.0";

  app.listen({ port, host }).then(() => {
    app.log.info(`[api-b-fastify] listening on http://localhost:${port}`);
  });
}

export default app;
