import mongoose from "mongoose";

import { env } from "../config/env.js";
import Ayurveda from "../models/ayurveda.model.js";

const ayurvedaData = [
  {
    title: "Abhyanga",
    slug: "abhyanga",
    description:
      "A traditional Ayurvedic self-massage practice commonly used as part of a wellness routine.",
    type: "practice",
    category: "relaxation",
    tags: ["massage", "relaxation", "self-care", "wellness"],
    benefits: [
      "Supports relaxation",
      "Can be included in a self-care routine",
      "Encourages mindful wellness practices",
    ],
    suitableFor: ["General wellness", "Relaxation routines"],
    usage:
      "Follow an appropriate traditional self-care routine and seek qualified guidance when necessary.",
    precautions: ["Avoid use on irritated or injured skin."],
    recommendedFor: {
      stressLevels: ["high", "moderate"],
      concerns: ["body pain", "stress"],
      goalCategories: ["stress_management", "general_wellbeing", "mobility"],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Triphala",
    slug: "triphala",
    description:
      "A traditional Ayurvedic herbal formulation commonly discussed in relation to digestive wellness.",
    type: "herb",
    category: "digestion",
    tags: ["triphala", "digestion", "herbal", "wellness"],
    benefits: [
      "Traditionally associated with digestive wellness",
      "Used in traditional Ayurvedic practices",
    ],
    suitableFor: ["Digestive wellness"],
    usage:
      "Use only according to appropriate professional guidance and product instructions.",
    precautions: ["Individual suitability can vary."],
    contraindications: [
      "Consult a qualified healthcare professional before use if you have medical conditions or take medications.",
    ],
    recommendedFor: {
      digestion: ["poor", "moderate"],
      concerns: ["digestion"],
      goalCategories: ["digestion", "general_wellbeing"],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Ashwagandha",
    slug: "ashwagandha",
    description:
      "An Ayurvedic herb traditionally used in wellness practices and commonly associated with stress and general wellbeing.",
    type: "herb",
    category: "stress",
    tags: ["ashwagandha", "stress", "herbal", "wellness"],
    benefits: [
      "Traditionally associated with stress-related wellness",
      "Commonly included in Ayurvedic wellness practices",
    ],
    suitableFor: ["General wellness", "Stress-management routines"],
    usage:
      "Use according to qualified professional guidance and applicable product instructions.",
    precautions: ["Individual suitability varies."],
    contraindications: [
      "Consult a qualified healthcare professional before using herbal products, particularly when taking medications or managing a medical condition.",
    ],
    recommendedFor: {
      stressLevels: ["high", "moderate"],
      concerns: ["stress"],
      goalCategories: [
        "stress_management",
        "mental_wellbeing",
        "general_wellbeing",
      ],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Ayurvedic Sleep Routine",
    slug: "ayurvedic-sleep-routine",
    description:
      "A general evening wellness routine inspired by traditional Ayurvedic lifestyle practices.",
    type: "routine",
    category: "sleep",
    tags: ["sleep", "evening", "routine", "relaxation"],
    benefits: [
      "Encourages a consistent evening routine",
      "Supports relaxation before sleep",
      "Promotes mindful bedtime habits",
    ],
    suitableFor: ["General sleep wellness"],
    usage:
      "Create a consistent relaxing evening routine and maintain healthy sleep habits.",
    precautions: [],
    recommendedFor: {
      sleepQualities: ["poor", "fair"],
      stressLevels: ["high", "moderate"],
      concerns: ["sleep"],
      goalCategories: ["sleep", "stress_management", "general_wellbeing"],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Ayurvedic Nutrition Basics",
    slug: "ayurvedic-nutrition-basics",
    description:
      "General educational information about mindful eating and traditional Ayurvedic nutrition concepts.",
    type: "nutrition",
    category: "nutrition",
    tags: ["nutrition", "food", "mindful-eating", "wellness"],
    benefits: [
      "Encourages mindful eating",
      "Provides general wellness education",
    ],
    suitableFor: ["General wellness", "Nutrition education"],
    usage:
      "Use as general wellness education rather than as a substitute for individualized medical or nutritional advice.",
    precautions: [],
    recommendedFor: {
      goalCategories: [
        "general_wellbeing",
        "digestion",
        "energy",
        "weight_management",
      ],
    },
    isActive: true,
    isFeatured: false,
  },

  {
    title: "Yoga and Ayurveda Lifestyle Connection",
    slug: "yoga-ayurveda-lifestyle-connection",
    description:
      "Educational content about how yoga and traditional Ayurvedic lifestyle practices are commonly combined in wellness routines.",
    type: "knowledge",
    category: "general_wellness",
    tags: ["yoga", "ayurveda", "lifestyle", "wellness"],
    benefits: [
      "Provides general wellness education",
      "Introduces the traditional relationship between yoga and Ayurveda",
    ],
    suitableFor: ["General wellness", "Wellness education"],
    usage: "Use as general educational information.",
    precautions: [],
    recommendedFor: {
      goalCategories: [
        "general_wellbeing",
        "fitness",
        "stress_management",
        "flexibility",
      ],
    },
    isActive: true,
    isFeatured: false,
  },
];

const seedAyurveda = async () => {
  try {
    await mongoose.connect(env.mongodbUri);

    await Ayurveda.deleteMany({});

    await Ayurveda.insertMany(ayurvedaData);

    console.log(
      `Ayurveda seed completed: ${ayurvedaData.length} items inserted.`,
    );
  } catch (error) {
    console.error("Ayurveda seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAyurveda();
