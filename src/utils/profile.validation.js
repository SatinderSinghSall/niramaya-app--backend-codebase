import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(50).optional(),

  lastName: z.string().trim().min(1).max(50).optional(),

  phone: z.string().trim().max(30).optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),

  newPassword: z.string().min(8).max(100),
});

export const updateSettingsSchema = z.object({
  notifications: z
    .object({
      enabled: z.boolean().optional(),

      goalReminders: z.boolean().optional(),

      progressReminders: z.boolean().optional(),

      consultationUpdates: z.boolean().optional(),

      wellnessReminders: z.boolean().optional(),
    })
    .optional(),

  reminders: z
    .object({
      enabled: z.boolean().optional(),

      preferredTime: z
        .string()
        .regex(
          /^(?:[01]\d|2[0-3]):[0-5]\d$/,
          "Preferred time must use HH:mm format",
        )
        .optional(),
    })
    .optional(),

  appearance: z
    .object({
      theme: z.enum(["system", "light", "dark"]).optional(),
    })
    .optional(),

  privacy: z
    .object({
      analyticsEnabled: z.boolean().optional(),
    })
    .optional(),

  preferences: z
    .object({
      language: z.string().trim().min(2).max(10).optional(),

      timezone: z.string().trim().min(1).max(100).optional(),
    })
    .optional(),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1),
});
