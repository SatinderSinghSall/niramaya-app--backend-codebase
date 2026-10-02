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
  // ─────────────────────────
  // BASIC INFORMATION
  // ─────────────────────────

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

  // ─────────────────────────
  // MEDIA
  // ─────────────────────────

  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be a valid URL")
    .max(1000)
    .optional(),

  videoUrl: z
    .string()
    .trim()
    .url("Video URL must be a valid URL")
    .max(1000)
    .optional(),

  // ─────────────────────────
  // CLASSIFICATION
  // ─────────────────────────

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

  // ─────────────────────────
  // DURATION
  // ─────────────────────────

  durationMinutes: z.number().int().min(1).max(180).optional(),

  // ─────────────────────────
  // PRACTICE INFORMATION
  // ─────────────────────────

  equipment: z.array(z.string().trim().min(1)).optional(),

  bodyFocus: z.array(z.string().trim().min(1).toLowerCase()).optional(),

  // ─────────────────────────
  // CONTENT
  // ─────────────────────────

  tags: z.array(z.string().trim().min(1).toLowerCase()).optional(),

  benefits: z.array(z.string().trim().min(1).max(300)).optional(),

  instructions: z.array(z.string().trim().min(1).max(500)).optional(),

  precautions: z.array(z.string().trim().min(1).max(500)).optional(),

  contraindications: z.array(z.string().trim().min(1).max(500)).optional(),

  suitableFor: z.array(z.string().trim().min(1)).optional(),

  // ─────────────────────────
  // PERSONALIZATION
  // ─────────────────────────

  recommendedFor: recommendedForSchema.optional(),

  // ─────────────────────────
  // CONTENT MANAGEMENT
  // ─────────────────────────

  isActive: z.boolean().optional(),

  isFeatured: z.boolean().optional(),

  viewCount: z.number().int().min(0).optional(),
});

export const updateYogaSchema = createYogaSchema.partial();
