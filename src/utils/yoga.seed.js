import mongoose from "mongoose";

import { env } from "../config/env.js";
import Yoga from "../models/yoga.model.js";

const yogaData = [
  {
    title: "Child's Pose",
    slug: "childs-pose",
    description:
      "A gentle resting yoga posture commonly used for relaxation and recovery during a yoga practice.",
    type: "pose",
    category: "relaxation",
    difficulty: "beginner",
    durationMinutes: 5,
    tags: ["childs-pose", "rest", "relaxation", "beginner"],
    benefits: [
      "Encourages relaxation",
      "Provides a gentle resting posture",
      "Can be incorporated into beginner practices",
    ],
    instructions: [
      "Kneel comfortably on a yoga mat.",
      "Lower your torso toward your thighs.",
      "Rest your forehead comfortably.",
      "Breathe slowly and remain within a comfortable range.",
    ],
    precautions: ["Stop if the position causes discomfort."],
    contraindications: [
      "Seek professional guidance if you have an injury that makes kneeling or bending uncomfortable.",
    ],
    suitableFor: ["Beginners", "Relaxation practices"],
    recommendedFor: {
      stressLevels: ["high", "moderate"],
      yogaExperience: ["none", "beginner"],
      goalCategories: [
        "stress_management",
        "relaxation",
        "general_wellbeing",
        "mobility",
      ],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Cat-Cow Stretch",
    slug: "cat-cow-stretch",
    description:
      "A gentle movement sequence commonly used to mobilize the spine and prepare the body for yoga practice.",
    type: "practice",
    category: "mobility",
    difficulty: "beginner",
    durationMinutes: 5,
    tags: ["cat-cow", "mobility", "spine", "stretching"],
    benefits: [
      "Encourages gentle spinal movement",
      "Useful as a warm-up",
      "Supports mobility-focused routines",
    ],
    instructions: [
      "Begin on hands and knees.",
      "Move slowly between a comfortable rounded and extended spine position.",
      "Coordinate the movement with steady breathing.",
    ],
    precautions: ["Keep movements gentle and controlled."],
    contraindications: ["Avoid movements that aggravate an existing injury."],
    suitableFor: ["Beginners", "Mobility routines"],
    recommendedFor: {
      activityLevels: ["sedentary", "light", "moderate"],
      yogaExperience: ["none", "beginner"],
      concerns: ["body pain", "mobility"],
      goalCategories: ["mobility", "flexibility", "general_wellbeing"],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Tree Pose",
    slug: "tree-pose",
    description:
      "A standing balance posture used in yoga practices to develop balance, concentration, and body awareness.",
    type: "pose",
    category: "balance",
    difficulty: "beginner",
    durationMinutes: 3,
    tags: ["tree-pose", "balance", "standing", "focus"],
    benefits: [
      "Develops balance awareness",
      "Encourages concentration",
      "Can support body awareness",
    ],
    instructions: [
      "Stand comfortably with your weight balanced.",
      "Shift weight onto one leg.",
      "Place the other foot in a comfortable supported position.",
      "Maintain steady breathing and use support if needed.",
    ],
    precautions: [
      "Practice near a wall or stable support if balance is limited.",
    ],
    contraindications: [
      "Avoid unsupported balance work if it creates a significant fall risk.",
    ],
    suitableFor: ["Beginners", "Balance practices"],
    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["mobility", "flexibility", "general_wellbeing"],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Alternate Nostril Breathing",
    slug: "alternate-nostril-breathing",
    description:
      "A traditional breathing practice commonly included in yoga and relaxation routines.",
    type: "breathing",
    category: "stress_relief",
    difficulty: "beginner",
    durationMinutes: 5,
    tags: ["breathing", "pranayama", "relaxation", "stress"],
    benefits: [
      "Encourages slow mindful breathing",
      "Can be incorporated into relaxation routines",
      "Supports focused breathing practice",
    ],
    instructions: [
      "Sit comfortably with an upright but relaxed posture.",
      "Breathe slowly and comfortably.",
      "Follow an appropriate alternate-nostril breathing technique.",
      "Stop if you feel dizzy or uncomfortable.",
    ],
    precautions: [
      "Keep the breathing gentle and comfortable.",
      "Do not force breath retention.",
    ],
    contraindications: [
      "Seek qualified instruction if you have a respiratory or cardiovascular condition.",
    ],
    suitableFor: ["Relaxation", "Mindful breathing"],
    recommendedFor: {
      stressLevels: ["high", "moderate"],
      yogaExperience: ["none", "beginner"],
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
    title: "Gentle Morning Yoga",
    slug: "gentle-morning-yoga",
    description:
      "A short beginner-friendly yoga routine designed to introduce gentle movement into a morning wellness routine.",
    type: "routine",
    category: "energy",
    difficulty: "beginner",
    durationMinutes: 15,
    tags: ["morning", "energy", "beginner", "routine"],
    benefits: [
      "Encourages morning movement",
      "Supports a consistent wellness routine",
      "Provides gentle full-body activity",
    ],
    instructions: [
      "Begin with comfortable breathing.",
      "Perform gentle mobility movements.",
      "Include beginner-friendly standing and stretching postures.",
      "Finish with a short relaxation period.",
    ],
    precautions: ["Adjust movements to your comfort level."],
    contraindications: [
      "Seek professional guidance when adapting exercise for an existing injury or medical condition.",
    ],
    suitableFor: ["Beginners", "Morning routines"],
    recommendedFor: {
      energyLevels: ["low", "moderate"],
      activityLevels: ["sedentary", "light"],
      yogaExperience: ["none", "beginner"],
      goalCategories: ["energy", "fitness", "general_wellbeing"],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Relaxation Yoga Routine",
    slug: "relaxation-yoga-routine",
    description:
      "A gentle yoga routine focused on slow movement, comfortable breathing, and relaxation.",
    type: "routine",
    category: "stress_relief",
    difficulty: "beginner",
    durationMinutes: 20,
    tags: ["relaxation", "stress", "evening", "slow-yoga"],
    benefits: [
      "Encourages relaxation",
      "Can be used as part of an evening wellness routine",
      "Supports mindful movement",
    ],
    instructions: [
      "Begin with slow comfortable breathing.",
      "Use gentle stretching and accessible postures.",
      "Avoid forcing any movement.",
      "Finish with a short relaxation period.",
    ],
    precautions: ["Keep all movements within a comfortable range."],
    contraindications: ["Modify or avoid movements that cause pain."],
    suitableFor: ["Stress-management routines", "Evening relaxation"],
    recommendedFor: {
      stressLevels: ["high", "moderate"],
      sleepQualities: ["poor", "fair"],
      yogaExperience: ["none", "beginner"],
      goalCategories: ["stress_management", "sleep", "mental_wellbeing"],
    },
    isActive: true,
    isFeatured: true,
  },

  {
    title: "Beginner Flexibility Flow",
    slug: "beginner-flexibility-flow",
    description:
      "A gentle sequence designed to introduce flexibility-focused movement for beginners.",
    type: "routine",
    category: "flexibility",
    difficulty: "beginner",
    durationMinutes: 20,
    tags: ["flexibility", "stretching", "beginner", "mobility"],
    benefits: [
      "Encourages gentle stretching",
      "Supports flexibility-focused routines",
      "Can help establish a regular movement habit",
    ],
    instructions: [
      "Warm up with gentle movement.",
      "Perform comfortable stretches without forcing range of motion.",
      "Maintain steady breathing.",
      "Finish with a relaxed posture.",
    ],
    precautions: [
      "Do not force a stretch.",
      "Move gradually into each position.",
    ],
    contraindications: ["Avoid movements that aggravate an existing injury."],
    suitableFor: ["Beginners", "Flexibility routines"],
    recommendedFor: {
      activityLevels: ["sedentary", "light", "moderate"],
      yogaExperience: ["none", "beginner"],
      goalCategories: ["flexibility", "mobility"],
    },
    isActive: true,
    isFeatured: false,
  },
];

const seedYoga = async () => {
  try {
    await mongoose.connect(env.mongodbUri);

    await Yoga.deleteMany({});

    await Yoga.insertMany(yogaData);

    console.log(`Yoga seed completed: ${yogaData.length} items inserted.`);
  } catch (error) {
    console.error("Yoga seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedYoga();
