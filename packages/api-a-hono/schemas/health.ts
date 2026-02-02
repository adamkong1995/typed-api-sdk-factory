import { z } from "../lib/zod";

export const HealthResponse = z.object({
  ok: z.literal(true),
});
