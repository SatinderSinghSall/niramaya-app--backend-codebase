import { z } from "zod";

const notificationType = z.enum([
  "goal",
  "progress",
  "consultation",
  "yoga",
  "ayurveda",
  "general",
  "system",
]);

const notificationAction = z.object({
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
});

export const adminConsultationStatusSchema = z.object({
  status: z.string().trim().min(1).max(50),
  cancellationReason: z.string().trim().max(500).optional(),
});

export const adminConsultationScheduleSchema = z
  .object({
    preferredDate: z.coerce.date().optional(),
    preferredTime: z.string().trim().min(1).max(50).optional(),
  })
  .refine(
    (value) =>
      value.preferredDate !== undefined || value.preferredTime !== undefined,
    "At least preferredDate or preferredTime is required",
  );

export const adminConsultationNotesSchema = z.object({
  notes: z.string().trim().max(1000),
});

export const adminNotificationCreateSchema = z.object({
  type: notificationType.optional(),
  title: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(1000),
  action: notificationAction.optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  expiresAt: z.coerce.date().optional(),
});

export const adminBulkNotificationSchema = adminNotificationCreateSchema.extend(
  {
    userIds: z.array(z.string().trim().min(1)).min(1).max(100),
  },
);

export const adminNotificationReadSchema = z.object({
  isRead: z.boolean(),
});
