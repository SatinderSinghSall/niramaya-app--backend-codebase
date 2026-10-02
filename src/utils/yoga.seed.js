import mongoose from "mongoose";

import { env } from "../config/env.js";
import Yoga from "../models/yoga.model.js";

const yogaData = [
  // ============================================================
  // POSES
  // ============================================================

  {
    title: "Child's Pose",
    slug: "childs-pose",
    description:
      "A gentle resting yoga posture commonly used for relaxation, recovery, and comfortable movement between poses.",
    type: "pose",
    category: "relaxation",
    difficulty: "beginner",
    durationMinutes: 5,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Balasana.JPG",

    tags: ["childs-pose", "balasana", "rest", "relaxation", "beginner"],

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

    precautions: [
      "Stop if the position causes discomfort.",
      "Use a cushion or folded blanket if additional support is needed.",
    ],

    contraindications: [
      "Seek professional guidance if an injury makes kneeling or bending uncomfortable.",
    ],

    suitableFor: ["Beginners", "Relaxation practices", "Recovery sessions"],

    equipment: ["yoga mat"],

    bodyFocus: ["hips", "back", "spine"],

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
      "A gentle movement sequence that alternates spinal flexion and extension and is commonly used for warm-up and mobility practice.",
    type: "practice",
    category: "mobility",
    difficulty: "beginner",
    durationMinutes: 5,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Yoga_at_Your_Park_-_Bidalasana.jpg",

    tags: ["cat-cow", "marjaryasana", "bitilasana", "mobility", "spine"],

    benefits: [
      "Encourages gentle spinal movement",
      "Useful as a warm-up",
      "Supports mobility-focused routines",
    ],

    instructions: [
      "Begin on hands and knees.",
      "Move slowly between a comfortable rounded and extended spine position.",
      "Coordinate the movement with steady breathing.",
      "Repeat at a comfortable pace.",
    ],

    precautions: [
      "Keep movements gentle and controlled.",
      "Avoid forcing the range of motion.",
    ],

    contraindications: ["Avoid movements that aggravate an existing injury."],

    suitableFor: ["Beginners", "Mobility routines", "Warm-ups"],

    equipment: ["yoga mat"],

    bodyFocus: ["spine", "back", "shoulders"],

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
    title: "Mountain Pose",
    slug: "mountain-pose",
    description:
      "A foundational standing yoga posture that emphasizes upright alignment, balance, and body awareness.",
    type: "pose",
    category: "balance",
    difficulty: "beginner",
    durationMinutes: 3,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tadasana.jpg",

    tags: ["tadasana", "standing", "balance", "alignment", "beginner"],

    benefits: [
      "Encourages upright posture awareness",
      "Develops standing balance",
      "Provides a foundation for standing poses",
    ],

    instructions: [
      "Stand comfortably with your feet grounded.",
      "Lengthen your spine without creating tension.",
      "Relax your shoulders.",
      "Breathe slowly while maintaining a comfortable standing position.",
    ],

    precautions: ["Use support if standing balance is limited."],

    contraindications: [
      "Modify the practice if prolonged standing causes discomfort.",
    ],

    suitableFor: ["Beginners", "Standing practices", "Balance practice"],

    equipment: ["yoga mat"],

    bodyFocus: ["legs", "spine", "feet"],

    recommendedFor: {
      activityLevels: ["sedentary", "light", "moderate"],
      yogaExperience: ["none", "beginner"],
      goalCategories: ["balance", "mobility", "general_wellbeing"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Tree Pose",
    slug: "tree-pose",
    description:
      "A standing balance posture used to develop balance, concentration, stability, and body awareness.",
    type: "pose",
    category: "balance",
    difficulty: "beginner",
    durationMinutes: 3,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Vrikshasana-Dr-Igor-Popov.jpg",

    tags: ["tree-pose", "vrikshasana", "balance", "standing", "focus"],

    benefits: [
      "Develops balance awareness",
      "Encourages concentration",
      "Supports body awareness and stability",
    ],

    instructions: [
      "Stand comfortably with your weight balanced.",
      "Shift your weight onto one leg.",
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

    equipment: ["yoga mat", "wall optional"],

    bodyFocus: ["legs", "ankles", "hips", "core"],

    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["balance", "mobility", "general_wellbeing"],
    },

    isActive: true,
    isFeatured: true,
  },

  {
    title: "Downward-Facing Dog",
    slug: "downward-facing-dog",
    description:
      "A foundational yoga posture that combines shoulder, leg, and spinal movement and is commonly used in yoga sequences.",
    type: "pose",
    category: "flexibility",
    difficulty: "beginner",
    durationMinutes: 3,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Adho_mukha_shvanasana.jpg",

    tags: ["downward-dog", "adho-mukha-svanasana", "flexibility", "hamstrings"],

    benefits: [
      "Encourages posterior-chain stretching",
      "Supports shoulder and hip mobility",
      "Commonly used as a transition posture",
    ],

    instructions: [
      "Begin on hands and knees.",
      "Lift your hips upward and backward.",
      "Lengthen your spine comfortably.",
      "Keep your knees slightly bent if needed.",
    ],

    precautions: [
      "Avoid forcing the heels toward the floor.",
      "Keep the neck relaxed.",
    ],

    contraindications: [
      "Seek professional guidance if wrist, shoulder, or other injuries make weight-bearing uncomfortable.",
    ],

    suitableFor: ["Beginners", "Flexibility practices", "Yoga flows"],

    equipment: ["yoga mat"],

    bodyFocus: ["shoulders", "hamstrings", "calves", "back"],

    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["flexibility", "mobility", "strength"],
    },

    isActive: true,
    isFeatured: true,
  },

  {
    title: "Cobra Pose",
    slug: "cobra-pose",
    description:
      "A prone back-extension posture commonly included in yoga sequences and gentle mobility practices.",
    type: "pose",
    category: "mobility",
    difficulty: "beginner",
    durationMinutes: 3,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bhujangasana.jpg",

    tags: ["cobra", "bhujangasana", "backbend", "spine", "mobility"],

    benefits: [
      "Encourages spinal extension",
      "Supports gentle chest opening",
      "Can be incorporated into mobility-focused sequences",
    ],

    instructions: [
      "Lie face down with your hands near your shoulders.",
      "Press gently through your hands.",
      "Lift the chest only as far as comfortable.",
      "Keep the movement controlled and breathe steadily.",
    ],

    precautions: ["Avoid forcing the backbend.", "Keep the shoulders relaxed."],

    contraindications: [
      "Avoid if spinal extension causes pain or if advised otherwise by a qualified professional.",
    ],

    suitableFor: ["Beginners", "Mobility routines"],

    equipment: ["yoga mat"],

    bodyFocus: ["spine", "chest", "shoulders", "abdomen"],

    recommendedFor: {
      activityLevels: ["light", "moderate"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["mobility", "flexibility"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Triangle Pose",
    slug: "triangle-pose",
    description:
      "A standing lateral-extension posture that combines balance, hip mobility, and side-body movement.",
    type: "pose",
    category: "flexibility",
    difficulty: "beginner",
    durationMinutes: 4,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Uttitha_Trikonasana.jpg",

    tags: ["triangle", "trikonasana", "standing", "flexibility", "balance"],

    benefits: [
      "Encourages hip mobility",
      "Supports side-body stretching",
      "Develops standing balance and awareness",
    ],

    instructions: [
      "Stand with your feet comfortably apart.",
      "Turn one foot outward.",
      "Extend your arms and lean gently toward the front leg.",
      "Use a block if reaching the floor is uncomfortable.",
    ],

    precautions: [
      "Avoid collapsing into the supporting side.",
      "Use a yoga block for additional support.",
    ],

    contraindications: [
      "Modify or avoid the pose if it aggravates an existing injury.",
    ],

    suitableFor: ["Beginners", "Flexibility practice", "Balance practice"],

    equipment: ["yoga mat", "yoga block"],

    bodyFocus: ["hips", "hamstrings", "legs", "side_body"],

    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["flexibility", "mobility", "balance"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Warrior I",
    slug: "warrior-one",
    description:
      "A standing yoga posture that develops lower-body stability and introduces a strong standing position.",
    type: "pose",
    category: "strength",
    difficulty: "beginner",
    durationMinutes: 4,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Rocket-yoga-01-4000px.jpg",

    tags: ["warrior-one", "virabhadrasana", "strength", "standing"],

    benefits: [
      "Builds lower-body strength and stability",
      "Encourages upright posture",
      "Can support strength-focused yoga flows",
    ],

    instructions: [
      "Step one foot forward and place the rear foot at a comfortable angle.",
      "Bend the front knee within a comfortable range.",
      "Lift the torso upright.",
      "Reach the arms upward while maintaining steady breathing.",
    ],

    precautions: [
      "Keep the front knee comfortable and aligned.",
      "Use a shorter stance if needed.",
    ],

    contraindications: [
      "Modify the pose if it causes significant knee, hip, or ankle discomfort.",
    ],

    suitableFor: ["Beginners", "Strength routines", "Standing flows"],

    equipment: ["yoga mat"],

    bodyFocus: ["legs", "hips", "shoulders", "core"],

    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["strength", "balance", "fitness"],
    },

    isActive: true,
    isFeatured: true,
  },

  {
    title: "Warrior II",
    slug: "warrior-two",
    description:
      "A standing yoga posture that emphasizes leg strength, hip mobility, balance, and body awareness.",
    type: "pose",
    category: "strength",
    difficulty: "beginner",
    durationMinutes: 4,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Virabhadrasana_II_-_Warrior_II_Pose.jpg",

    tags: ["warrior-two", "virabhadrasana", "strength", "balance"],

    benefits: [
      "Develops lower-body endurance",
      "Encourages hip mobility",
      "Supports standing balance and stability",
    ],

    instructions: [
      "Stand with your feet comfortably apart.",
      "Turn one foot outward.",
      "Bend the front knee comfortably.",
      "Extend both arms and maintain steady breathing.",
    ],

    precautions: [
      "Avoid allowing the front knee to collapse inward.",
      "Adjust the stance for comfort.",
    ],

    contraindications: [
      "Modify the pose if it aggravates knee, hip, or ankle problems.",
    ],

    suitableFor: ["Beginners", "Strength practice", "Balance practice"],

    equipment: ["yoga mat"],

    bodyFocus: ["legs", "hips", "shoulders", "core"],

    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["strength", "balance", "fitness"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Chair Pose",
    slug: "chair-pose",
    description:
      "A standing posture that challenges the legs and core while developing controlled strength and stability.",
    type: "pose",
    category: "strength",
    difficulty: "beginner",
    durationMinutes: 3,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Utkatasana.jpg",

    tags: ["chair-pose", "utkatasana", "strength", "legs", "core"],

    benefits: [
      "Challenges the lower body",
      "Encourages core engagement",
      "Supports strength-focused practices",
    ],

    instructions: [
      "Stand with your feet comfortably positioned.",
      "Bend your knees as if sitting into an imaginary chair.",
      "Keep your torso lifted.",
      "Reach your arms upward or forward as comfortable.",
    ],

    precautions: [
      "Keep the knee position comfortable.",
      "Do not hold the pose longer than you can maintain good control.",
    ],

    contraindications: [
      "Modify the pose if knee or lower-back discomfort occurs.",
    ],

    suitableFor: ["Beginners", "Strength routines"],

    equipment: ["yoga mat"],

    bodyFocus: ["quadriceps", "glutes", "legs", "core"],

    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["strength", "fitness", "energy"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Bridge Pose",
    slug: "bridge-pose",
    description:
      "A supported back-extension posture that can be included in strength and mobility-oriented yoga practices.",
    type: "pose",
    category: "strength",
    difficulty: "beginner",
    durationMinutes: 4,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Setubandhasana_oblique_view.JPG",

    tags: ["bridge", "setu-bandhasana", "backbend", "glutes", "strength"],

    benefits: [
      "Engages the posterior chain",
      "Encourages hip extension",
      "Can be included in strength-focused routines",
    ],

    instructions: [
      "Lie on your back with your knees bent.",
      "Place your feet comfortably on the mat.",
      "Lift your hips gradually.",
      "Lower back down slowly and repeat as appropriate.",
    ],

    precautions: [
      "Avoid forcing the height of the lift.",
      "Keep the movement controlled.",
    ],

    contraindications: [
      "Modify or avoid the pose if it causes back or neck discomfort.",
    ],

    suitableFor: ["Beginners", "Strength routines", "Mobility routines"],

    equipment: ["yoga mat"],

    bodyFocus: ["glutes", "hamstrings", "back", "hips"],

    recommendedFor: {
      activityLevels: ["light", "moderate"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["strength", "mobility", "flexibility"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Boat Pose",
    slug: "boat-pose",
    description:
      "A seated balance posture that challenges the abdominal and hip-flexor muscles.",
    type: "pose",
    category: "strength",
    difficulty: "intermediate",
    durationMinutes: 3,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Navasana.jpg",

    tags: ["boat-pose", "navasana", "core", "strength", "balance"],

    benefits: [
      "Challenges core strength",
      "Develops seated balance",
      "Supports strength-focused yoga practices",
    ],

    instructions: [
      "Sit with your knees bent.",
      "Lean back slightly while maintaining a long spine.",
      "Lift your feet as comfortable.",
      "Extend your legs only if you can maintain control.",
    ],

    precautions: [
      "Keep the spine comfortable and controlled.",
      "Use a modified version if needed.",
    ],

    contraindications: ["Modify the pose if it aggravates the lower back."],

    suitableFor: ["Intermediate practitioners", "Core routines"],

    equipment: ["yoga mat"],

    bodyFocus: ["core", "hip_flexors", "abdomen"],

    recommendedFor: {
      activityLevels: ["moderate", "active"],
      yogaExperience: ["intermediate", "advanced"],
      goalCategories: ["strength", "fitness", "balance"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Seated Forward Fold",
    slug: "seated-forward-fold",
    description:
      "A seated forward-bending posture commonly used in flexibility and relaxation-focused yoga practices.",
    type: "pose",
    category: "flexibility",
    difficulty: "beginner",
    durationMinutes: 4,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Paschimottanasana.jpg",

    tags: [
      "seated-forward-fold",
      "paschimottanasana",
      "flexibility",
      "hamstrings",
    ],

    benefits: [
      "Encourages posterior-chain stretching",
      "Supports flexibility practice",
      "Can be incorporated into relaxation routines",
    ],

    instructions: [
      "Sit with your legs extended comfortably.",
      "Lengthen your spine.",
      "Lean forward gradually from the hips.",
      "Reach toward your legs only as far as comfortable.",
    ],

    precautions: [
      "Do not force the stretch.",
      "Keep a slight bend in the knees if needed.",
    ],

    contraindications: [
      "Modify the pose if forward bending aggravates an existing injury.",
    ],

    suitableFor: ["Beginners", "Flexibility routines", "Relaxation"],

    equipment: ["yoga mat", "yoga strap optional"],

    bodyFocus: ["hamstrings", "hips", "back"],

    recommendedFor: {
      activityLevels: ["sedentary", "light", "moderate"],
      yogaExperience: ["beginner", "intermediate"],
      goalCategories: ["flexibility", "relaxation", "mobility"],
    },

    isActive: true,
    isFeatured: true,
  },

  {
    title: "Half Lord of the Fishes",
    slug: "half-lord-of-the-fishes",
    description:
      "A seated spinal twisting posture used in yoga practices focused on mobility and controlled rotation.",
    type: "pose",
    category: "mobility",
    difficulty: "intermediate",
    durationMinutes: 4,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ardha_matsyendrasana.jpg",

    tags: ["twist", "ardha-matsyendrasana", "spine", "mobility"],

    benefits: [
      "Encourages controlled spinal rotation",
      "Supports mobility-focused practices",
      "Promotes body awareness",
    ],

    instructions: [
      "Sit comfortably with your legs positioned for a supported twist.",
      "Lengthen your spine.",
      "Rotate gently toward one side.",
      "Return to center and repeat on the other side.",
    ],

    precautions: ["Keep the rotation controlled.", "Do not force the twist."],

    contraindications: ["Avoid if twisting aggravates an existing injury."],

    suitableFor: ["Intermediate practitioners", "Mobility routines"],

    equipment: ["yoga mat"],

    bodyFocus: ["spine", "hips", "back"],

    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["intermediate", "advanced"],
      goalCategories: ["mobility", "flexibility"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Bow Pose",
    slug: "bow-pose",
    description:
      "An intermediate back-extension posture involving the legs, hips, chest, and back.",
    type: "pose",
    category: "strength",
    difficulty: "intermediate",
    durationMinutes: 3,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dhanurasana.jpg",

    tags: ["bow-pose", "dhanurasana", "backbend", "strength"],

    benefits: [
      "Engages multiple muscle groups",
      "Encourages spinal extension",
      "Can be included in intermediate yoga practices",
    ],

    instructions: [
      "Lie face down.",
      "Bend your knees and reach toward your ankles.",
      "Lift the chest and thighs only as comfortable.",
      "Maintain steady breathing.",
    ],

    precautions: [
      "Do not force the backbend.",
      "Practice only within a comfortable range.",
    ],

    contraindications: [
      "Avoid if the pose is unsuitable for an existing back, knee, or shoulder condition.",
    ],

    suitableFor: ["Intermediate practitioners"],

    equipment: ["yoga mat"],

    bodyFocus: ["back", "chest", "hips", "thighs"],

    recommendedFor: {
      activityLevels: ["moderate", "active"],
      yogaExperience: ["intermediate", "advanced"],
      goalCategories: ["strength", "flexibility", "mobility"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Pigeon Pose",
    slug: "pigeon-pose",
    description:
      "A hip-focused yoga posture commonly used in flexibility practices with careful attention to individual range of motion.",
    type: "pose",
    category: "flexibility",
    difficulty: "intermediate",
    durationMinutes: 4,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kapotasana_-_Pigeon_pose.jpg",

    tags: ["pigeon-pose", "kapotasana", "hips", "flexibility"],

    benefits: [
      "Encourages hip mobility",
      "Supports flexibility-focused practices",
      "Can be incorporated into lower-body mobility routines",
    ],

    instructions: [
      "Begin from a supported tabletop or downward-facing dog position.",
      "Bring one leg forward into a comfortable position.",
      "Support the hips as needed.",
      "Hold only within a comfortable range and switch sides.",
    ],

    precautions: [
      "Use cushions or blocks for support.",
      "Do not force the hip into a deep position.",
    ],

    contraindications: [
      "Modify or avoid the pose if it causes hip, knee, or groin pain.",
    ],

    suitableFor: ["Intermediate practitioners", "Flexibility routines"],

    equipment: ["yoga mat", "yoga blocks optional"],

    bodyFocus: ["hips", "glutes", "groin"],

    recommendedFor: {
      activityLevels: ["light", "moderate", "active"],
      yogaExperience: ["intermediate", "advanced"],
      goalCategories: ["flexibility", "mobility"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Thunderbolt Pose",
    slug: "thunderbolt-pose",
    description:
      "A seated kneeling posture commonly used for breathing, meditation, and quiet practices.",
    type: "pose",
    category: "general_wellness",
    difficulty: "beginner",
    durationMinutes: 5,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Vajrasana.jpg",

    tags: ["vajrasana", "thunderbolt", "meditation", "breathing"],

    benefits: [
      "Provides a seated position for quiet practices",
      "Supports meditation and breathing sessions",
      "Can be used as a beginner-friendly seated posture",
    ],

    instructions: [
      "Kneel comfortably with your legs folded beneath you.",
      "Sit upright without creating unnecessary tension.",
      "Relax your shoulders.",
      "Maintain slow and comfortable breathing.",
    ],

    precautions: [
      "Use a cushion under the hips if needed.",
      "Avoid prolonged kneeling if it causes discomfort.",
    ],

    contraindications: [
      "Modify or avoid if kneeling causes significant knee or ankle discomfort.",
    ],

    suitableFor: ["Beginners", "Meditation", "Breathing practices"],

    equipment: ["yoga mat", "meditation cushion optional"],

    bodyFocus: ["ankles", "knees", "hips", "spine"],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      yogaExperience: ["none", "beginner"],
      goalCategories: ["relaxation", "mental_wellbeing", "general_wellbeing"],
    },

    isActive: true,
    isFeatured: false,
  },

  {
    title: "Lotus Pose Meditation",
    slug: "lotus-pose-meditation",
    description:
      "A traditional seated meditation posture that can be used for quiet attention and mindfulness practices.",
    type: "meditation",
    category: "mental_wellbeing",
    difficulty: "intermediate",
    durationMinutes: 10,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tanum%C3%A2nas%C3%AE_en_Meditacion_Loto_Padmasana.JPG",

    tags: ["padmasana", "lotus", "meditation", "mindfulness"],

    benefits: [
      "Provides a traditional seated meditation posture",
      "Encourages stillness and focused attention",
      "Can be incorporated into mindfulness routines",
    ],

    instructions: [
      "Sit comfortably with your spine upright.",
      "Place the legs into a comfortable seated position.",
      "Rest your hands comfortably.",
      "Focus on slow, natural breathing.",
    ],

    precautions: [
      "Use a simpler cross-legged position if lotus position is uncomfortable.",
    ],

    contraindications: ["Avoid forcing the knees or hips into the position."],

    suitableFor: ["Meditation", "Mindfulness", "Experienced practitioners"],

    equipment: ["meditation cushion optional"],

    bodyFocus: ["hips", "knees", "spine"],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      yogaExperience: ["beginner", "intermediate", "advanced"],
      goalCategories: ["mental_wellbeing", "stress_management", "relaxation"],
    },

    isActive: true,
    isFeatured: true,
  },

  {
    title: "Guided Yoga Meditation",
    slug: "guided-yoga-meditation",
    description:
      "A seated mindfulness practice combining comfortable posture, steady breathing, and focused attention.",
    type: "meditation",
    category: "mental_wellbeing",
    difficulty: "beginner",
    durationMinutes: 10,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Meditation_yoga_posture_for_reflection_on_Om.jpg",

    tags: ["meditation", "mindfulness", "om", "relaxation"],

    benefits: [
      "Encourages focused attention",
      "Supports relaxation practices",
      "Can be used as part of a daily mindfulness routine",
    ],

    instructions: [
      "Sit in a comfortable supported position.",
      "Close your eyes if comfortable.",
      "Observe your natural breathing.",
      "Return your attention gently whenever your mind wanders.",
    ],

    precautions: ["Practice in a quiet and comfortable environment."],

    contraindications: [],

    suitableFor: ["Beginners", "Mindfulness", "Relaxation"],

    equipment: ["meditation cushion optional"],

    bodyFocus: ["mind", "breathing", "posture"],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      sleepQualities: ["poor", "average"],
      yogaExperience: ["none", "beginner"],
      goalCategories: [
        "stress_management",
        "mental_wellbeing",
        "relaxation",
        "sleep",
      ],
    },

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // BREATHING
  // ============================================================

  {
    title: "Alternate Nostril Breathing",
    slug: "alternate-nostril-breathing",
    description:
      "A traditional yogic breathing practice commonly used as part of relaxation and focused breathing routines.",
    type: "breathing",
    category: "stress_relief",
    difficulty: "beginner",
    durationMinutes: 5,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Respiraci%C3%B3n_alterna.jpg",

    tags: [
      "nadi-shodhana",
      "alternate-nostril",
      "pranayama",
      "breathing",
      "relaxation",
    ],

    benefits: [
      "Encourages slow mindful breathing",
      "Can be incorporated into relaxation routines",
      "Supports focused breathing practice",
    ],

    instructions: [
      "Sit comfortably with an upright but relaxed posture.",
      "Breathe slowly and comfortably.",
      "Use a gentle alternate-nostril breathing technique.",
      "Stop if you feel dizzy or uncomfortable.",
    ],

    precautions: [
      "Keep the breathing gentle and comfortable.",
      "Do not force breath retention.",
    ],

    contraindications: [
      "Seek qualified instruction if you have a respiratory or cardiovascular condition.",
    ],

    suitableFor: ["Relaxation", "Mindful breathing", "Beginners"],

    equipment: ["none"],

    bodyFocus: ["breathing", "chest", "mind"],

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
    title: "Kapalabhati Breathing",
    slug: "kapalabhati-breathing",
    description:
      "A traditional yogic breathing practice involving active exhalations and passive inhalations that should be learned progressively.",
    type: "breathing",
    category: "energy",
    difficulty: "intermediate",
    durationMinutes: 5,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tanum%C3%A2nas%C3%AE_kapalabhati.JPG",

    tags: ["kapalabhati", "pranayama", "breathing", "energy"],

    benefits: [
      "Provides a structured breathing practice",
      "Can be incorporated into selected yoga routines",
      "Encourages awareness of breathing rhythm",
    ],

    instructions: [
      "Sit comfortably with an upright posture.",
      "Learn the breathing technique from a qualified instructor.",
      "Use controlled active exhalations.",
      "Stop immediately if dizziness or discomfort occurs.",
    ],

    precautions: [
      "Do not force the breathing pattern.",
      "Begin with short, comfortable practice periods.",
    ],

    contraindications: [
      "Not appropriate for everyone; seek professional guidance when you have relevant respiratory, cardiovascular, pregnancy, or other health considerations.",
    ],

    suitableFor: ["Intermediate practitioners", "Pranayama practice"],

    equipment: ["none"],

    bodyFocus: ["breathing", "abdomen", "core"],

    recommendedFor: {
      energyLevels: ["low", "moderate"],
      yogaExperience: ["intermediate", "advanced"],
      goalCategories: ["energy", "mental_wellbeing"],
    },

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // ROUTINES / PRACTICES
  // ============================================================

  {
    title: "Sun Salutation",
    slug: "sun-salutation",
    description:
      "A flowing sequence of yoga movements traditionally practiced as a connected series of postures.",
    type: "routine",
    category: "energy",
    difficulty: "beginner",
    durationMinutes: 10,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Surya_Namaskar.jpg",

    tags: ["surya-namaskar", "sun-salutation", "flow", "energy"],

    benefits: [
      "Combines multiple yoga movements into one sequence",
      "Supports whole-body movement",
      "Can be adapted to different practice levels",
    ],

    instructions: [
      "Begin in a comfortable standing posture.",
      "Move through the sequence slowly and with control.",
      "Coordinate movement with comfortable breathing.",
      "Modify movements according to your ability.",
    ],

    precautions: [
      "Use a modified version if needed.",
      "Avoid rushing through the sequence.",
    ],

    contraindications: [
      "Modify or avoid movements that aggravate an existing injury.",
    ],

    suitableFor: ["Beginners", "Morning routines", "Movement practice"],

    equipment: ["yoga mat"],

    bodyFocus: ["full_body", "legs", "arms", "spine"],

    recommendedFor: {
      energyLevels: ["low", "moderate"],
      activityLevels: ["sedentary", "light", "moderate"],
      yogaExperience: ["none", "beginner", "intermediate"],
      goalCategories: ["energy", "fitness", "general_wellbeing"],
    },

    isActive: true,
    isFeatured: true,
  },

  {
    title: "Gentle Morning Yoga",
    slug: "gentle-morning-yoga",
    description:
      "A short beginner-friendly routine designed to introduce gentle movement into a morning wellness routine.",
    type: "routine",
    category: "energy",
    difficulty: "beginner",
    durationMinutes: 15,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tadasana.jpg",

    tags: ["morning", "energy", "beginner", "routine", "mobility"],

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
      "Modify movements when an existing injury or condition requires adaptation.",
    ],

    suitableFor: ["Beginners", "Morning routines"],

    equipment: ["yoga mat"],

    bodyFocus: ["full_body", "spine", "legs", "shoulders"],

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
      "A gentle routine focused on slow movement, comfortable breathing, and relaxation.",
    type: "routine",
    category: "stress_relief",
    difficulty: "beginner",
    durationMinutes: 20,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Shavasana.jpg",

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

    equipment: ["yoga mat", "meditation cushion optional"],

    bodyFocus: ["full_body", "spine", "hips", "breathing"],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      sleepQualities: ["poor", "average"],
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

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Paschimottanasana.jpg",

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

    equipment: ["yoga mat", "yoga strap optional"],

    bodyFocus: ["hamstrings", "hips", "back", "full_body"],

    recommendedFor: {
      activityLevels: ["sedentary", "light", "moderate"],
      yogaExperience: ["none", "beginner"],
      goalCategories: ["flexibility", "mobility"],
    },

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // KNOWLEDGE
  // ============================================================

  {
    title: "Understanding Yoga for Spinal Mobility",
    slug: "understanding-yoga-for-spinal-mobility",
    description:
      "Educational content explaining how gentle yoga movements can be incorporated into mobility-focused routines.",
    type: "knowledge",
    category: "mobility",
    difficulty: "beginner",
    durationMinutes: 5,

    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ardha_matsyendrasana.jpg",

    tags: ["yoga", "spine", "mobility", "education", "back"],

    benefits: [
      "Introduces basic concepts of spinal mobility",
      "Helps users understand movement-focused yoga practices",
      "Provides educational context for mobility routines",
    ],

    instructions: [
      "Read the educational content before beginning a new routine.",
      "Choose movements appropriate for your experience level.",
      "Keep all movements controlled and comfortable.",
    ],

    precautions: [
      "Educational content does not replace individualized professional guidance.",
    ],

    contraindications: [],

    suitableFor: ["Beginners", "Yoga learners", "Mobility-focused users"],

    equipment: ["none"],

    bodyFocus: ["spine", "back", "hips"],

    recommendedFor: {
      concerns: ["mobility", "body pain"],
      yogaExperience: ["none", "beginner", "intermediate"],
      goalCategories: ["mobility", "flexibility", "general_wellbeing"],
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
