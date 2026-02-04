import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../api-b-fastify/openapi.json",
  output: {
    path: "src/gen",
  },
  client: "axios",
});
