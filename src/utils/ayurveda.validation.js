import { z } from "zod";

// ------------------------------------------------------------
// Ingredient
// ------------------------------------------------------------

const ingredientSchema = z.object({
  name: z.string().trim().min(1).max(100),

  description: z.string().trim().max(500).optional(),

  quantity: z.string().trim().max(100).optional(),

  form: z.string().trim().max(100).optional(),
});

// ------------------------------------------------------------
// Ayurvedic properties
// ------------------------------------------------------------

const propertiesSchema = z.object({
  rasa: z.array(z.string().trim()).optional(),

  guna: z.array(z.string().trim()).optional(),

  virya: z.string().trim().max(100).optional(),

  vipaka: z.string().trim().max(100).optional(),
});

// ------------------------------------------------------------
// Recommended for
// ------------------------------------------------------------

const recommendedForSchema = z.object({
  energyLevels: z.array(z.string().trim()).optional(),

  digestion: z.array(z.string().trim()).optional(),

  stressLevels: z.array(z.string().trim()).optional(),

  sleepQualities: z.array(z.string().trim()).optional(),

  activityLevels: z.array(z.string().trim()).optional(),

  concerns: z.array(z.string().trim().toLowerCase()).optional(),

  goalCategories: z.array(z.string().trim().toLowerCase()).optional(),
});

// ------------------------------------------------------------
// Source
// ------------------------------------------------------------

const sourceSchema = z.object({
  title: z.string().trim().min(1).max(300),

  url: z.string().trim().url().optional(),

  publisher: z.string().trim().max(200).optional(),
});

// ------------------------------------------------------------
// Create Ayurveda
// ------------------------------------------------------------

export const createAyurvedaSchema = z.object({
  // Basic information
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

  shortDescription: z.string().trim().max(300).optional(),

  // Content type
  type: z.enum([
    "practice",
    "herb",
    "product",
    "routine",
    "nutrition",
    "knowledge",
  ]),

  category: z.enum([
    "digestion",
    "stress",
    "sleep",
    "energy",
    "skin",
    "hair",
    "immunity",
    "fitness",
    "relaxation",
    "nutrition",
    "general_wellness",
  ]),

  // Media
  imageUrl: z.string().trim().url().optional(),

  videoUrl: z.string().trim().url().optional(),

  // Practice / routine
  durationMinutes: z.number().int().min(1).max(1440).optional(),

  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),

  bestTime: z.array(z.string().trim()).optional(),

  frequency: z.string().trim().max(300).optional(),

  duration: z.string().trim().max(300).optional(),

  preparation: z.string().trim().max(1500).optional(),

  usage: z.string().trim().max(1000).optional(),

  howToUse: z.array(z.string().trim().min(1).max(1000)).optional(),

  // Ayurveda
  doshas: z.array(z.enum(["vata", "pitta", "kapha", "tridoshic"])).optional(),

  prakriti: z.array(z.enum(["vata", "pitta", "kapha", "tridoshic"])).optional(),

  properties: propertiesSchema.optional(),

  // Wellness
  bodySystems: z.array(z.string().trim()).optional(),

  wellnessGoals: z.array(z.string().trim().toLowerCase()).optional(),

  tags: z.array(z.string().trim()).optional(),

  benefits: z.array(z.string().trim().min(1).max(300)).optional(),

  suitableFor: z.array(z.string().trim()).optional(),

  // Ingredients
  ingredients: z.array(ingredientSchema).optional(),

  // Safety
  precautions: z.array(z.string().trim().min(1).max(500)).optional(),

  contraindications: z.array(z.string().trim().min(1).max(500)).optional(),

  // Personalization
  recommendedFor: recommendedForSchema.optional(),

  // Educational information
  traditionalUseNote: z.string().trim().max(1500).optional(),

  evidenceNote: z.string().trim().max(1500).optional(),

  sources: z.array(sourceSchema).optional(),

  // App metadata
  isActive: z.boolean().optional(),

  isFeatured: z.boolean().optional(),
});

// ------------------------------------------------------------
// Update Ayurveda
// ------------------------------------------------------------

export const updateAyurvedaSchema = createAyurvedaSchema.partial();
