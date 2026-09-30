import { z } from "zod";

const dateSchema = z.coerce.date();

export const createProgressSchema = z.object({
  date: dateSchema.optional(),

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

export const updateProgressSchema = createProgressSchema.partial();

export const progressQuerySchema = z.object({
  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  page: z.coerce.number().int().min(1).optional().default(1),

  limit: z.coerce.number().int().min(1).max(100).optional().default(30),
});
