import { z } from "zod";

export const HealthResponse = z.object({
  ok: z.literal(true),
});
