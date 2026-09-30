import { z } from "zod";

export const createNotificationSchema = z.object({
  type: z
    .enum([
      "goal",
      "progress",
      "consultation",
      "yoga",
      "ayurveda",
      "general",
      "system",
    ])
    .optional(),

  title: z.string().trim().min(1).max(150),

  message: z.string().trim().min(1).max(1000),

  action: z
    .object({
      type: z
        .enum([
          "goal",
          "progress",
          "consultation",
          "yoga",
          "ayurveda",
          "dashboard",
          "none",
        ])
        .optional(),

      referenceId: z.string().optional(),

      route: z.string().trim().max(300).optional(),
    })
    .optional(),

  metadata: z.record(z.string(), z.any()).optional(),

  expiresAt: z.coerce.date().optional(),
});

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(50).optional(),

  type: z
    .enum([
      "goal",
      "progress",
      "consultation",
      "yoga",
      "ayurveda",
      "general",
      "system",
    ])
    .optional(),

  read: z.enum(["true", "false"]).optional(),
});

export const markReadSchema = z.object({
  isRead: z.boolean().optional(),
});
