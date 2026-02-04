import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../api-a-hono/openapi.json",
  output: {
    path: "src/gen",
  },
  client: "axios",
});
