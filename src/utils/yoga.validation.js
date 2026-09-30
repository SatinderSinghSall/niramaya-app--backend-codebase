import { z } from "zod";

const recommendedForSchema = z.object({
  energyLevels: z.array(z.string().trim()).optional(),
  stressLevels: z.array(z.string().trim()).optional(),
  sleepQualities: z.array(z.string().trim()).optional(),
  activityLevels: z.array(z.string().trim()).optional(),
  yogaExperience: z.array(z.string().trim()).optional(),
  concerns: z.array(z.string().trim().toLowerCase()).optional(),
  goalCategories: z.array(z.string().trim().toLowerCase()).optional(),
});

export const createYogaSchema = z.object({
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
    "pose",
    "practice",
    "routine",
    "breathing",
    "meditation",
    "knowledge",
  ]),

  category: z.enum([
    "stress_relief",
    "sleep",
    "flexibility",
    "strength",
    "mobility",
    "digestion",
    "energy",
    "balance",
    "relaxation",
    "mental_wellbeing",
    "general_wellness",
  ]),

  difficulty: z.enum(["beginner", "intermediate", "advanced"]),

  durationMinutes: z.number().int().min(1).max(180).optional(),

  tags: z.array(z.string().trim()).optional(),

  benefits: z.array(z.string().trim().min(1).max(300)).optional(),

  instructions: z.array(z.string().trim().min(1).max(500)).optional(),

  precautions: z.array(z.string().trim().min(1).max(500)).optional(),

  contraindications: z.array(z.string().trim().min(1).max(500)).optional(),

  suitableFor: z.array(z.string().trim()).optional(),

  recommendedFor: recommendedForSchema.optional(),

  isActive: z.boolean().optional(),

  isFeatured: z.boolean().optional(),
});

export const updateYogaSchema = createYogaSchema.partial();
