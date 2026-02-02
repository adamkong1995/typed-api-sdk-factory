import { Hono } from "hono";
import { CUSTOMERS } from "./routes/data";
import { HealthResponse } from "../schemas/health";
import {
  CustomerProfile,
  CustomerSearchRequest,
  CustomerSearchResponse,
} from "../schemas/customer";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import swaggerUiDist from "swagger-ui-dist";
import { buildOpenApiDoc } from "./openapi-doc";

const app = new Hono();

// Serve OpenAPI spec

app.get("/openapi.json", (c) => {
  // Always fresh + matches schemas
  const doc = buildOpenApiDoc();
  return c.json(doc);
});

app.get("/docs", (c) => {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>API A Docs</title>
    <link rel="stylesheet" href="/docs/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>

    <script src="/docs/swagger-ui-bundle.js"></script>
    <script src="/docs/swagger-ui-standalone-preset.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    </script>
  </body>
</html>`;
  return c.html(html);
});

// Serve swagger-ui-dist static assets under /docs/*
app.get("/docs/*", (c) => {
  const assetPath = c.req.path.replace(/^\/docs\//, "");
  const distPath = swaggerUiDist.getAbsoluteFSPath();
  const filePath = join(distPath, assetPath);

  try {
    const content = readFileSync(filePath);
    // Minimal content-type handling
    if (filePath.endsWith(".css")) c.header("content-type", "text/css");
    else if (filePath.endsWith(".js"))
      c.header("content-type", "application/javascript");
    else if (filePath.endsWith(".png")) c.header("content-type", "image/png");
    else if (filePath.endsWith(".map"))
      c.header("content-type", "application/json");
    return c.body(content);
  } catch {
    return c.text("Not found", 404);
  }
});

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
