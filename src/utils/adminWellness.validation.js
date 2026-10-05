import { z } from "zod";

const goalStatuses = ["active", "paused", "completed", "cancelled"];
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

export const adminGoalQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  search: z.string().trim().max(100).optional(),
  status: z.enum(goalStatuses).optional(),
  category: z.enum(goalCategories).optional(),
  userId: z.string().trim().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z
    .enum([
      "createdAt",
      "updatedAt",
      "startDate",
      "targetDate",
      "progressPercentage",
      "title",
    ])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const adminGoalStatusSchema = z.object({
  status: z.enum(goalStatuses),
  reason: z.string().trim().max(500).optional(),
});

export const adminGoalProgressSchema = z.object({
  currentValue: z.number().min(0),
  progressPercentage: z.number().min(0).max(100).optional(),
});

export const adminProgressQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  userId: z.string().trim().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const adminProgressUpdateSchema = z.object({
  date: z.coerce.date().optional(),
  mood: z.number().int().min(1).max(5).optional(),
  energyLevel: z.number().int().min(1).max(5).optional(),
  stressLevel: z.number().int().min(1).max(5).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  sleepQuality: z.number().int().min(1).max(5).optional(),
  waterIntakeLiters: z.number().min(0).max(20).optional(),
  steps: z.number().int().min(0).max(200000).optional(),
  exerciseMinutes: z.number().int().min(0).max(1440).optional(),
  yogaMinutes: z.number().int().min(0).max(1440).optional(),
  meditationMinutes: z.number().int().min(0).max(1440).optional(),
  weightKg: z.number().min(1).max(500).optional(),
  notes: z.string().trim().max(1000).optional(),
  completedActivities: z.array(z.string().trim().min(1).max(100)).optional(),
});

export const parseQuery = (schema, query) => schema.parse(query);
