import { z } from "zod";

const goalCategories = [
  "sleep",
  "stress_management",
  "fitness",
  "flexibility",
  "strength",
  "weight_management",
  "digestion",
  "energy",
  "mental_wellbeing",
  "mobility",
  "skin_wellness",
  "hair_wellness",
  "general_wellbeing",
  "other",
];

export const createGoalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Goal title must contain at least 2 characters")
    .max(100),

  description: z.string().trim().max(500).nullable().optional(),

  category: z.enum(goalCategories),

  target: z
    .object({
      value: z.number().nullable().optional(),

      unit: z.string().trim().max(30).nullable().optional(),

      description: z.string().trim().max(200).nullable().optional(),
    })
    .optional(),

  currentValue: z.number().optional(),

  startDate: z.string().datetime(),

  targetDate: z.string().datetime().nullable().optional(),

  milestones: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(100),

        targetValue: z.number().nullable().optional(),
      }),
    )
    .optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().trim().min(2).max(100).optional(),

  description: z.string().trim().max(500).nullable().optional(),

  category: z.enum(goalCategories).optional(),

  target: z
    .object({
      value: z.number().nullable().optional(),

      unit: z.string().trim().max(30).nullable().optional(),

      description: z.string().trim().max(200).nullable().optional(),
    })
    .optional(),

  startDate: z.string().datetime().optional(),

  targetDate: z.string().datetime().nullable().optional(),

  milestones: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(100),

        targetValue: z.number().nullable().optional(),

        completed: z.boolean().optional(),
      }),
    )
    .optional(),
});

export const progressSchema = z.object({
  currentValue: z.number().min(0),

  progressPercentage: z.number().min(0).max(100).optional(),
});
