import { buildOpenApiDoc } from "./openapi-doc";

const doc = buildOpenApiDoc();
process.stdout.write(JSON.stringify(doc, null, 2));
