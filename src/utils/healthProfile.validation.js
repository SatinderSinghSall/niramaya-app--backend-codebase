import { z } from "zod";

const nullableString = z.string().trim().nullable().optional();

const stringArray = z.array(z.string().trim()).optional();

export const healthProfileSchema = z.object({
  personal: z
    .object({
      dateOfBirth: z.string().optional(),
      gender: z
        .enum(["male", "female", "other", "prefer_not_to_say"])
        .optional(),

      heightCm: z.number().min(30).max(300).nullable().optional(),

      weightKg: z.number().min(1).max(500).nullable().optional(),

      occupation: nullableString,
    })
    .optional(),

  physicalHealth: z
    .object({
      energyLevel: z
        .enum(["very_low", "low", "moderate", "high", "very_high"])
        .optional(),

      digestion: z
        .enum(["poor", "below_average", "normal", "good", "very_good"])
        .optional(),

      skinConcerns: stringArray,

      hairConcerns: stringArray,

      bodyPainAreas: stringArray,

      otherConcerns: nullableString,
    })
    .optional(),

  wellbeing: z
    .object({
      stressLevel: z
        .enum(["very_low", "low", "moderate", "high", "very_high"])
        .optional(),

      mood: z
        .enum(["very_low", "low", "neutral", "good", "very_good"])
        .optional(),

      focusLevel: z
        .enum(["very_low", "low", "moderate", "high", "very_high"])
        .optional(),

      relaxationLevel: z
        .enum(["very_low", "low", "moderate", "high", "very_high"])
        .optional(),
    })
    .optional(),

  lifestyle: z
    .object({
      activityLevel: z
        .enum(["sedentary", "light", "moderate", "active", "very_active"])
        .optional(),

      smoking: z.enum(["never", "former", "occasional", "regular"]).optional(),

      alcoholConsumption: z.enum(["none", "occasional", "regular"]).optional(),

      waterIntakeLiters: z.number().min(0).max(20).nullable().optional(),

      dailyScreenTimeHours: z.number().min(0).max(24).nullable().optional(),
    })
    .optional(),

  nutrition: z
    .object({
      dietType: z
        .enum(["vegetarian", "vegan", "eggetarian", "non_vegetarian", "other"])
        .optional(),

      mealsPerDay: z.number().min(1).max(10).nullable().optional(),

      dietaryPreferences: stringArray,

      foodAllergies: stringArray,

      waterConsumption: z.enum(["low", "moderate", "high"]).optional(),
    })
    .optional(),

  sleep: z
    .object({
      averageHours: z.number().min(0).max(24).nullable().optional(),

      sleepQuality: z
        .enum(["very_poor", "poor", "average", "good", "very_good"])
        .optional(),

      bedtime: nullableString,

      wakeTime: nullableString,

      sleepDifficulties: stringArray,
    })
    .optional(),

  fitness: z
    .object({
      exerciseFrequency: z
        .enum(["never", "rarely", "1_2_days", "3_4_days", "5_plus_days"])
        .optional(),

      exerciseTypes: stringArray,

      yogaExperience: z
        .enum(["none", "beginner", "intermediate", "advanced"])
        .optional(),

      averageDailySteps: z.number().min(0).max(100000).nullable().optional(),
    })
    .optional(),

  medicalHistory: z
    .object({
      existingConditions: stringArray,

      allergies: stringArray,

      currentMedications: stringArray,

      previousSurgeries: stringArray,

      familyHistory: stringArray,

      additionalInformation: nullableString,
    })
    .optional(),

  preferences: z
    .object({
      preferredYogaDuration: z.number().min(1).max(180).nullable().optional(),

      preferredActivityTime: z
        .enum(["morning", "afternoon", "evening", "night", "anytime"])
        .optional(),

      wellnessInterests: stringArray,
    })
    .optional(),

  onboarding: z
    .object({
      completed: z.boolean().optional(),

      completionPercentage: z.number().min(0).max(100).optional(),
    })
    .optional(),
});
