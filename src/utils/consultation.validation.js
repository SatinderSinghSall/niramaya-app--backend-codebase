import { z } from "zod";

export const createConsultationSchema = z.object({
  consultationType: z.enum(["online", "offline"]),

  preferredDate: z.coerce.date(),

  preferredTime: z.string().trim().min(1).max(50),

  concern: z.string().trim().min(5).max(2000),

  goals: z.array(z.string().trim().min(1).max(200)).optional(),

  notes: z.string().trim().max(1000).optional(),
});

export const updateConsultationSchema = z.object({
  consultationType: z.enum(["online", "offline"]).optional(),

  preferredDate: z.coerce.date().optional(),

  preferredTime: z.string().trim().min(1).max(50).optional(),

  concern: z.string().trim().min(5).max(2000).optional(),

  goals: z.array(z.string().trim().min(1).max(200)).optional(),

  notes: z.string().trim().max(1000).optional(),
});

export const cancellationSchema = z.object({
  reason: z.string().trim().min(3).max(500).optional(),
});
