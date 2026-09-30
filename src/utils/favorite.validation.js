import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const createFavoriteSchema = z.object({
  itemType: z.enum(["ayurveda", "yoga"]),

  itemId: objectIdSchema,
});

export const favoriteQuerySchema = z.object({
  itemType: z.enum(["ayurveda", "yoga"]).optional(),

  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(50).optional(),
});
