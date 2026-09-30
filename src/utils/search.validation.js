import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(100),

  type: z.enum(["all", "ayurveda", "yoga"]).optional(),

  category: z.string().trim().max(100).optional(),

  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),

  ayurvedaType: z
    .enum(["practice", "herb", "product", "routine", "nutrition", "knowledge"])
    .optional(),

  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(50).optional(),
});
