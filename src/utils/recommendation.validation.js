import { z } from "zod";

export const recommendationQuerySchema = z.object({
  type: z.enum(["all", "ayurveda", "yoga"]).optional().default("all"),

  limit: z.coerce.number().int().min(1).max(20).optional().default(10),
});
