import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
});

const recommendedForSchema = z.object({
  energyLevels: z.array(z.string().trim()).optional(),
  digestion: z.array(z.string().trim()).optional(),
  stressLevels: z.array(z.string().trim()).optional(),
  sleepQualities: z.array(z.string().trim()).optional(),
  activityLevels: z.array(z.string().trim()).optional(),
  concerns: z.array(z.string().trim().toLowerCase()).optional(),
  goalCategories: z.array(z.string().trim().toLowerCase()).optional(),
});

export const createAyurvedaSchema = z.object({
  title: z.string().trim().min(2).max(150),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  description: z.string().trim().min(10).max(2000),

  type: z.enum([
    "practice",
    "herb",
    "product",
    "routine",
    "nutrition",
    "knowledge",
  ]),

  category: z.enum([
    "digestion",
    "stress",
    "sleep",
    "energy",
    "skin",
    "hair",
    "immunity",
    "fitness",
    "relaxation",
    "nutrition",
    "general_wellness",
  ]),

  tags: z.array(z.string().trim()).optional(),

  benefits: z.array(z.string().trim().min(1).max(300)).optional(),

  suitableFor: z.array(z.string().trim()).optional(),

  ingredients: z.array(ingredientSchema).optional(),

  usage: z.string().trim().max(1000).optional(),

  precautions: z.array(z.string().trim().min(1).max(500)).optional(),

  contraindications: z.array(z.string().trim().min(1).max(500)).optional(),

  recommendedFor: recommendedForSchema.optional(),

  isActive: z.boolean().optional(),

  isFeatured: z.boolean().optional(),
});

export const updateAyurvedaSchema = createAyurvedaSchema.partial();
