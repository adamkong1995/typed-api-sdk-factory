import { Hono } from "hono";
import { CUSTOMERS } from "./routes/data";
import { HealthResponse } from "../schemas/health";
import {
  CustomerProfile,
  CustomerSearchRequest,
  CustomerSearchResponse,
} from "../schemas/customer";

const app = new Hono();

/**
 * GET /health
 */
app.get("/health", (c) => {
  const payload = HealthResponse.parse({ ok: true });
  return c.json(payload);
});

/**
 * GET /customers/:customerId
 */
app.get("/customers/:customerId", (c) => {
  const customerId = c.req.param("customerId");

  const found = CUSTOMERS.find((x) => x.customerId === customerId);
  if (!found) return c.json({ error: "Not found" }, 404);

  const payload = CustomerProfile.parse(found);
  return c.json(payload);
});

/**
 * POST /customers/search
 */
app.post("/customers/search", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const input = CustomerSearchRequest.parse(body);

  const query = input.query?.toLowerCase();

  const results = CUSTOMERS.filter((x) => {
    if (query) {
      const hay = `${x.fullName} ${x.email}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    if (input.status && x.status !== input.status) return false;
    if (input.province && x.address.province !== input.province) return false;
    return true;
  }).slice(0, input.limit);

  const payload = CustomerSearchResponse.parse({ results });
  return c.json(payload);
});

// Local dev server
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 4011);
  console.log(`[api-a-hono] listening on http://localhost:${port}`);

  const { serve } = await import("@hono/node-server");
  serve({ fetch: app.fetch, port });
}

export default app;
