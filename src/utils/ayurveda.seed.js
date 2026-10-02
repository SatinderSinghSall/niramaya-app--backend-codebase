import mongoose from "mongoose";

import { env } from "../config/env.js";
import Ayurveda from "../models/ayurveda.model.js";

const ayurvedaData = [
  // ============================================================
  // 1. ABHYANGA
  // ============================================================

  {
    title: "Abhyanga Self-Massage",
    slug: "abhyanga-self-massage",
    shortDescription:
      "A traditional Ayurvedic oil-massage practice used as part of a mindful self-care routine.",
    description:
      "Abhyanga is a traditional Ayurvedic oil-massage practice commonly incorporated into daily or weekly wellness routines. The practice emphasizes warm oil, gentle massage strokes, and a calm environment.",
    type: "practice",
    category: "relaxation",

    imageUrl:
      "https://djayurveda.com/cdn/shop/files/ChatGPT_Image_May_10_2026_06_46_56_PM.png?v=1778419473",

    durationMinutes: 20,
    difficulty: "beginner",

    bestTime: ["Morning", "Evening"],
    frequency: "As part of a regular self-care routine.",
    duration: "15–20 minutes",

    preparation:
      "Choose a quiet space and use an appropriate body oil. Warm the oil gently rather than heating it directly to a high temperature.",

    usage:
      "Apply a small amount of suitable oil and use gentle, comfortable strokes over the body. Avoid irritated or injured skin.",

    howToUse: [
      "Prepare a warm and comfortable space.",
      "Apply a small amount of suitable body oil.",
      "Massage using slow and comfortable strokes.",
      "Allow a short period of rest before bathing if appropriate.",
    ],

    doshas: ["vata"],
    prakriti: ["vata", "tridoshic"],

    properties: {
      rasa: [],
      guna: ["unctuous"],
      virya: "warming",
      vipaka: "",
    },

    bodySystems: ["musculoskeletal", "skin"],
    wellnessGoals: [
      "stress_management",
      "relaxation",
      "self_care",
      "general_wellbeing",
    ],

    tags: [
      "abhyanga",
      "oil massage",
      "self massage",
      "relaxation",
      "self care",
    ],

    benefits: [
      "Encourages a mindful self-care routine",
      "Supports relaxation",
      "Creates time for gentle body awareness",
    ],

    suitableFor: [
      "General wellness",
      "Relaxation routines",
      "Self-care routines",
    ],

    ingredients: [
      {
        name: "Body oil",
        description:
          "Use an appropriate body oil selected for personal preference and suitability.",
        quantity: "Small amount",
        form: "Oil",
      },
    ],

    precautions: [
      "Avoid applying oil to irritated, broken, or infected skin.",
      "Use a non-slip surface because oil can make floors slippery.",
    ],

    contraindications: [
      "Seek professional advice when dealing with significant skin conditions or acute illness.",
    ],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      concerns: ["stress", "body pain"],
      goalCategories: ["stress_management", "general_wellbeing", "mobility"],
    },

    traditionalUseNote:
      "Abhyanga is traditionally described in Ayurveda as an oil-based body massage practice used within personal care routines.",

    evidenceNote:
      "This entry describes a traditional wellness practice and does not claim that Abhyanga treats or cures a medical condition.",

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 2. ASHWAGANDHA
  // ============================================================

  {
    title: "Ashwagandha",
    slug: "ashwagandha",
    shortDescription:
      "A traditional Ayurvedic herb commonly discussed in relation to stress, sleep, and general wellbeing.",
    description:
      "Ashwagandha is the common name for Withania somnifera. Its root has a long history of use in Ayurveda and it is widely discussed today in relation to stress and sleep. Preparation, dose, and individual suitability matter.",
    type: "herb",
    category: "stress",

    imageUrl:
      "https://cdn.fastpixel.io/fp/ret_img%2Bv_5fa0%2Bw_1024%2Bh_683%2Bq_glossy%2Bto_webp/tigrisvalley.com%2Fwp-content%2Fuploads%2F2025%2F07%2Fimage-12-1024x683.png",

    bestTime: ["Evening", "As directed"],
    frequency: "Follow product directions or qualified professional guidance.",
    duration: "Depends on preparation and individual circumstances.",

    preparation:
      "Ashwagandha is available in several preparations, including powders and standardized extracts. Use a reputable preparation and follow its instructions.",

    usage:
      "Use only according to appropriate professional guidance and product instructions.",

    doshas: ["vata", "kapha"],
    prakriti: ["vata", "tridoshic"],

    properties: {
      rasa: ["bitter", "astringent", "sweet"],
      guna: ["light", "unctuous"],
      virya: "warming",
      vipaka: "sweet",
    },

    bodySystems: ["nervous system", "musculoskeletal"],
    wellnessGoals: ["stress_management", "sleep", "general_wellbeing"],

    tags: [
      "ashwagandha",
      "withania somnifera",
      "herb",
      "stress",
      "sleep",
      "rasayana",
    ],

    benefits: [
      "Traditionally used in Ayurvedic wellness practices",
      "Commonly discussed in relation to stress and sleep",
      "Used in several traditional Ayurvedic preparations",
    ],

    suitableFor: [
      "Adults seeking general wellness information",
      "Ayurveda education",
    ],

    ingredients: [
      {
        name: "Ashwagandha root",
        description: "Root of Withania somnifera.",
        form: "Root / powder / extract",
      },
    ],

    precautions: [
      "Herbal supplements can interact with medicines.",
      "Individual suitability varies by preparation and health circumstances.",
    ],

    contraindications: [
      "Avoid self-use during pregnancy or breastfeeding without professional guidance.",
      "People with certain thyroid, autoimmune, liver, or medication-related concerns should seek professional advice before use.",
    ],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      sleepQualities: ["poor", "average"],
      concerns: ["stress"],
      goalCategories: [
        "stress_management",
        "mental_wellbeing",
        "general_wellbeing",
        "sleep",
      ],
    },

    traditionalUseNote:
      "Ashwagandha has a long history of use in traditional Ayurvedic medicine, particularly as a Rasayana preparation.",

    evidenceNote:
      "Research on ashwagandha is ongoing. Some preparations have shown potential for stress and insomnia, but evidence varies by preparation and study. Safety and medication interactions should be considered.",

    sources: [
      {
        title: "Ashwagandha: Usefulness and Safety",
        url: "https://www.nccih.nih.gov/health/ashwagandha",
        publisher: "NCCIH",
      },
    ],

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 3. TRIPHALA
  // ============================================================

  {
    title: "Triphala",
    slug: "triphala",
    shortDescription:
      "A traditional three-fruit Ayurvedic formulation commonly associated with digestive wellness.",
    description:
      "Triphala is a traditional Ayurvedic formulation made from three fruits. It is widely discussed within Ayurveda in relation to digestive and general wellness practices.",
    type: "herb",
    category: "digestion",

    imageUrl:
      "https://cdn.fastpixel.io/fp/ret_img%2Bv_5fa0%2Bw_1024%2Bh_683%2Bq_glossy%2Bto_webp/tigrisvalley.com%2Fwp-content%2Fuploads%2F2025%2F07%2Fimage-12-1024x683.png",

    bestTime: ["Evening", "As directed"],
    frequency: "Follow preparation-specific instructions.",
    duration: "Depends on preparation.",

    usage:
      "Use only according to product directions or qualified professional guidance.",

    doshas: ["tridoshic"],
    prakriti: ["vata", "pitta", "kapha", "tridoshic"],

    properties: {
      rasa: ["astringent", "sweet", "sour"],
      guna: [],
      virya: "",
      vipaka: "",
    },

    bodySystems: ["digestive system"],
    wellnessGoals: ["digestion", "general_wellbeing"],

    tags: ["triphala", "digestive wellness", "herbal formulation", "ayurveda"],

    benefits: [
      "Traditionally associated with digestive wellness",
      "Used in traditional Ayurvedic formulations",
    ],

    suitableFor: ["General wellness education", "Ayurveda education"],

    ingredients: [
      {
        name: "Amalaki",
        description: "Indian gooseberry, traditionally included in Triphala.",
        form: "Fruit",
      },
      {
        name: "Bibhitaki",
        description: "A traditional Triphala fruit.",
        form: "Fruit",
      },
      {
        name: "Haritaki",
        description: "A traditional Triphala fruit.",
        form: "Fruit",
      },
    ],

    precautions: [
      "Individual suitability can vary.",
      "Digestive effects may vary between people and preparations.",
    ],

    contraindications: [
      "Consult a qualified healthcare professional before use if you have a medical condition or take medicines.",
    ],

    recommendedFor: {
      digestion: ["poor", "moderate"],
      concerns: ["digestion"],
      goalCategories: ["digestion", "general_wellbeing"],
    },

    traditionalUseNote:
      "Triphala is a traditional Ayurvedic formulation composed of three fruits.",

    evidenceNote:
      "This entry describes traditional use and general wellness information rather than a claim that Triphala treats a medical condition.",

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 4. TURMERIC
  // ============================================================

  {
    title: "Turmeric",
    slug: "turmeric",
    shortDescription:
      "A familiar Indian spice with a long history of culinary and traditional Ayurvedic use.",
    description:
      "Turmeric, or Curcuma longa, is widely used as a culinary spice and has a long history within Indian traditional medicine, including Ayurveda.",
    type: "herb",
    category: "general_wellness",

    imageUrl:
      "https://www.banyanbotanicals.com/cdn/shop/files/turmeric-powder-6752-lightbox-web-v001.jpg?v=1717705922",

    bestTime: ["With food"],
    frequency: "Food amounts can be incorporated as part of a balanced diet.",

    usage:
      "Use primarily as a culinary ingredient unless a qualified professional recommends another preparation.",

    doshas: ["kapha", "vata"],
    prakriti: ["kapha", "tridoshic"],

    properties: {
      rasa: ["bitter", "pungent"],
      guna: ["dry", "light"],
      virya: "warming",
      vipaka: "pungent",
    },

    bodySystems: ["digestive system", "skin"],
    wellnessGoals: ["general_wellbeing", "nutrition"],

    tags: ["turmeric", "curcuma longa", "spice", "nutrition", "ayurveda"],

    benefits: [
      "Adds flavor and color to food",
      "Has a long history of traditional use",
      "Provides general nutrition education opportunities",
    ],

    suitableFor: ["General nutrition", "Cooking", "Ayurveda education"],

    ingredients: [
      {
        name: "Turmeric",
        description: "Rhizome of Curcuma longa.",
        form: "Fresh root or powder",
      },
    ],

    precautions: [
      "Concentrated supplements differ from normal culinary use.",
      "Some concentrated curcumin formulations have reported safety concerns.",
    ],

    contraindications: [
      "Seek professional advice before using concentrated turmeric or curcumin supplements if you have medical conditions or take medicines.",
    ],

    recommendedFor: {
      concerns: ["nutrition"],
      goalCategories: ["nutrition", "general_wellbeing"],
    },

    traditionalUseNote:
      "Turmeric has a long history of culinary and traditional medicinal use in India, including Ayurveda.",

    evidenceNote:
      "NCCIH notes that evidence for turmeric or curcumin varies by preparation and health condition, and some highly bioavailable formulations have safety concerns.",

    sources: [
      {
        title: "Turmeric: Usefulness and Safety",
        url: "https://www.nccih.nih.gov/health/turmeric",
        publisher: "NCCIH",
      },
    ],

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 5. TULSI
  // ============================================================

  {
    title: "Tulsi",
    slug: "tulsi",
    shortDescription:
      "Holy basil, a traditional Indian herb commonly used in household wellness and culinary practices.",
    description:
      "Tulsi, also known as holy basil, is an aromatic plant with a long cultural and traditional history in India. It is commonly used in herbal preparations and beverages.",
    type: "herb",
    category: "stress",

    imageUrl:
      "https://cdn.fastpixel.io/fp/ret_img%2Bv_c323%2Bw_1024%2Bh_683%2Bq_glossy%2Bto_webp/tigrisvalley.com%2Fwp-content%2Fuploads%2F2025%2F12%2Fimage-8-1024x683.png",

    bestTime: ["Morning", "Afternoon"],
    frequency: "As a food or traditional herbal preparation.",

    usage:
      "Tulsi may be used as a culinary herb or in traditional herbal beverages. Preparation and quantity matter.",

    doshas: ["kapha", "vata"],
    prakriti: ["kapha", "vata"],

    properties: {
      rasa: ["pungent", "bitter"],
      guna: ["light"],
      virya: "warming",
      vipaka: "pungent",
    },

    bodySystems: ["respiratory system", "digestive system"],
    wellnessGoals: ["stress_management", "general_wellbeing", "nutrition"],

    tags: ["tulsi", "holy basil", "ocimum", "herbal tea", "ayurveda"],

    benefits: [
      "Can be incorporated into herbal beverage routines",
      "Provides an aromatic culinary ingredient",
      "Has a long history of traditional use",
    ],

    suitableFor: ["General wellness", "Herbal beverage routines"],

    ingredients: [
      {
        name: "Tulsi leaves",
        description:
          "Leaves of Ocimum species traditionally used as holy basil.",
        form: "Fresh or dried leaves",
      },
    ],

    precautions: ["Use caution with concentrated herbal preparations."],

    contraindications: [
      "Consult a healthcare professional before using concentrated herbal preparations when pregnant, breastfeeding, or taking medicines.",
    ],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      concerns: ["stress"],
      goalCategories: ["stress_management", "general_wellbeing"],
    },

    traditionalUseNote:
      "Tulsi has a long-standing cultural and traditional role in Indian households and wellness practices.",

    evidenceNote:
      "The entry focuses on traditional use and general wellness rather than disease treatment claims.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 6. AMLA
  // ============================================================

  {
    title: "Amla",
    slug: "amla",
    shortDescription:
      "Indian gooseberry, a traditional fruit used in Ayurvedic food and herbal preparations.",
    description:
      "Amla, or Indian gooseberry, is a sour fruit traditionally used in Ayurveda and commonly incorporated into foods and herbal preparations.",
    type: "herb",
    category: "nutrition",

    imageUrl:
      "https://cdn.fastpixel.io/fp/ret_img%2Bv_c323%2Bw_1024%2Bh_683%2Bq_glossy%2Bto_webp/tigrisvalley.com%2Fwp-content%2Fuploads%2F2025%2F12%2Fimage-8-1024x683.png",

    bestTime: ["With food", "Morning"],
    frequency: "As part of a balanced diet or preparation.",

    usage:
      "Use as a food ingredient or according to preparation-specific instructions.",

    doshas: ["tridoshic"],
    prakriti: ["vata", "pitta", "kapha", "tridoshic"],

    properties: {
      rasa: ["sour", "sweet", "astringent"],
      guna: ["light", "dry"],
      virya: "cooling",
      vipaka: "sweet",
    },

    bodySystems: ["digestive system", "skin"],
    wellnessGoals: ["nutrition", "general_wellbeing"],

    tags: ["amla", "indian gooseberry", "amalaki", "fruit", "ayurveda"],

    benefits: [
      "Provides a traditional food ingredient",
      "Commonly included in Ayurvedic formulations",
      "Supports nutrition-focused wellness education",
    ],

    suitableFor: ["General nutrition", "Ayurveda education"],

    ingredients: [
      {
        name: "Amla fruit",
        description: "Fruit of Phyllanthus emblica.",
        form: "Fresh or dried fruit",
      },
    ],

    precautions: ["Individual tolerance can vary."],

    contraindications: [],

    recommendedFor: {
      goalCategories: ["nutrition", "general_wellbeing"],
    },

    traditionalUseNote:
      "Amla is traditionally used in Ayurveda as a food and herbal ingredient.",

    evidenceNote:
      "This entry presents amla as a traditional food and wellness ingredient rather than a treatment for disease.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 7. BRAHMI
  // ============================================================

  {
    title: "Brahmi",
    slug: "brahmi",
    shortDescription:
      "A traditional Ayurvedic herb commonly included in educational discussions around calm and cognitive wellness.",
    description:
      "Brahmi is a name used for traditional Ayurvedic herbs, commonly referring to Bacopa monnieri in modern herbal contexts. It has a long history of use in Ayurveda.",
    type: "herb",
    category: "stress",

    imageUrl:
      "https://media.newindianexpress.com/TNIE/import/2015/9/24/22/original/SHEELA1.jpg?auto=format%2Ccompress&enlarge=true&fit=max&h=900&w=1200",

    bestTime: ["As directed"],
    frequency: "Preparation-specific.",

    usage:
      "Use a clearly identified preparation according to its instructions or professional guidance.",

    doshas: ["pitta", "vata"],
    prakriti: ["pitta", "vata"],

    properties: {
      rasa: ["bitter", "sweet"],
      guna: ["light"],
      virya: "cooling",
      vipaka: "sweet",
    },

    bodySystems: ["nervous system"],
    wellnessGoals: ["mental_wellbeing", "stress_management"],

    tags: ["brahmi", "bacopa", "medhya", "mental wellness", "ayurveda"],

    benefits: [
      "Used traditionally in Ayurvedic wellness practices",
      "Provides an opportunity to learn about traditional herbal preparations",
    ],

    suitableFor: ["Ayurveda education", "General wellness information"],

    precautions: ["Herbal preparations vary in strength and composition."],

    contraindications: [
      "Consult a healthcare professional before concentrated herbal use if you take medicines or have a medical condition.",
    ],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      concerns: ["stress"],
      goalCategories: ["mental_wellbeing", "stress_management"],
    },

    traditionalUseNote:
      "Brahmi has a long history within Ayurvedic herbal traditions.",

    evidenceNote:
      "Research on Bacopa monnieri continues, and evidence depends on the preparation and outcome studied.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 8. NEEM
  // ============================================================

  {
    title: "Neem",
    slug: "neem",
    shortDescription:
      "A traditional Indian botanical commonly used in Ayurvedic and household herbal practices.",
    description:
      "Neem is an Indian botanical with a long history of traditional use. Leaves and other plant parts have been incorporated into a range of traditional preparations.",
    type: "herb",
    category: "skin",

    imageUrl: "https://www.gettyimages.com/",

    bestTime: ["As directed"],
    frequency: "Preparation-specific.",

    usage:
      "Use only an appropriately identified preparation and follow its directions.",

    doshas: ["pitta", "kapha"],
    prakriti: ["pitta", "kapha"],

    properties: {
      rasa: ["bitter"],
      guna: ["light", "dry"],
      virya: "cooling",
      vipaka: "pungent",
    },

    bodySystems: ["skin"],
    wellnessGoals: ["skin_care", "general_wellbeing"],

    tags: ["neem", "azadirachta indica", "skin care", "herbal", "ayurveda"],

    benefits: [
      "Provides traditional skincare education",
      "Commonly discussed in Indian herbal traditions",
    ],

    suitableFor: ["Traditional wellness education", "Skincare education"],

    precautions: ["Topical preparations can cause irritation in some people."],

    contraindications: [
      "Avoid ingesting concentrated neem preparations without qualified professional guidance.",
    ],

    recommendedFor: {
      concerns: ["skin"],
      goalCategories: ["skin_care", "general_wellbeing"],
    },

    traditionalUseNote:
      "Neem has a long history of use in Indian traditional practices.",

    evidenceNote:
      "This entry describes traditional use and does not establish neem as a treatment for a skin disease.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 9. GINGER
  // ============================================================

  {
    title: "Ginger",
    slug: "ginger",
    shortDescription:
      "A warming kitchen spice with traditional use in digestive and herbal wellness practices.",
    description:
      "Ginger is a common culinary spice whose rhizome has also been used traditionally in herbal medicine systems. It can be incorporated into food and beverages.",
    type: "herb",
    category: "digestion",

    imageUrl:
      "https://www.baidyanathayurved.com/cdn/shop/articles/ginger_in_ayurveda.jpg?v=1766571268",

    bestTime: ["Before or with meals"],
    frequency: "Food amounts or preparation-specific.",

    usage:
      "Use fresh or dried ginger in food or beverages. Concentrated supplements should be used according to appropriate guidance.",

    doshas: ["vata", "kapha"],
    prakriti: ["vata", "kapha"],

    properties: {
      rasa: ["pungent"],
      guna: ["light", "unctuous"],
      virya: "warming",
      vipaka: "sweet",
    },

    bodySystems: ["digestive system"],
    wellnessGoals: ["digestion", "nutrition", "general_wellbeing"],

    tags: ["ginger", "zingiber officinale", "digestion", "spice", "ayurveda"],

    benefits: [
      "Useful as a culinary ingredient",
      "Traditionally associated with digestive wellness",
      "Can be incorporated into warm beverages",
    ],

    suitableFor: ["General nutrition", "Cooking", "Ayurveda education"],

    ingredients: [
      {
        name: "Ginger root",
        description: "Rhizome of Zingiber officinale.",
        form: "Fresh or dried",
      },
    ],

    precautions: [
      "Large supplemental amounts may cause digestive discomfort in some people.",
    ],

    contraindications: [
      "Consult a healthcare professional when using concentrated ginger supplements alongside medicines.",
    ],

    recommendedFor: {
      digestion: ["poor", "moderate"],
      concerns: ["digestion"],
      goalCategories: ["digestion", "nutrition"],
    },

    traditionalUseNote:
      "Ginger has been used traditionally as a food and herbal ingredient for centuries.",

    evidenceNote:
      "NCCIH notes that ginger has been studied for several conditions, but evidence varies by use and preparation.",

    sources: [
      {
        title: "Ginger: Usefulness and Safety",
        url: "https://www.nccih.nih.gov/health/ginger/",
        publisher: "NCCIH",
      },
    ],

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 10. CUMIN
  // ============================================================

  {
    title: "Cumin",
    slug: "cumin",
    shortDescription:
      "An aromatic spice commonly used in Indian cooking and traditional digestive wellness practices.",
    description:
      "Cumin seeds are widely used as a culinary spice and are also found in traditional Indian wellness preparations.",
    type: "nutrition",
    category: "digestion",

    imageUrl:
      "https://www.athreyaherbs.com/cdn/shop/products/5_a2b9b574-59f9-4f01-a8a3-61d47c28a5e0.jpg?v=1651014899&width=1200",

    bestTime: ["With meals"],
    frequency: "As a culinary ingredient.",

    usage:
      "Use cumin in food or a traditional culinary preparation according to personal tolerance.",

    doshas: ["vata", "kapha"],
    prakriti: ["vata", "kapha", "tridoshic"],

    properties: {
      rasa: ["pungent", "bitter"],
      guna: ["light", "dry"],
      virya: "warming",
      vipaka: "pungent",
    },

    bodySystems: ["digestive system"],
    wellnessGoals: ["digestion", "nutrition"],

    tags: ["cumin", "jeera", "spice", "digestion", "nutrition"],

    benefits: [
      "Adds flavor to meals",
      "Fits naturally into Indian culinary traditions",
      "Useful for nutrition and culinary education",
    ],

    suitableFor: ["General nutrition", "Cooking"],

    ingredients: [
      {
        name: "Cumin seeds",
        description: "Seeds of Cuminum cyminum.",
        form: "Whole or ground",
      },
    ],

    precautions: [],
    contraindications: [],

    recommendedFor: {
      digestion: ["poor", "moderate"],
      goalCategories: ["digestion", "nutrition"],
    },

    traditionalUseNote:
      "Cumin has long been used as a culinary spice and traditional ingredient in Indian food and wellness practices.",

    evidenceNote:
      "The content is intended as nutrition and traditional-use education rather than treatment advice.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 11. FENNEL
  // ============================================================

  {
    title: "Fennel",
    slug: "fennel",
    shortDescription:
      "An aromatic seed traditionally enjoyed after meals and used in culinary wellness routines.",
    description:
      "Fennel seeds are aromatic and commonly used in Indian cuisine. They are also traditionally consumed after meals and in herbal preparations.",
    type: "nutrition",
    category: "digestion",

    imageUrl:
      "https://cdn.fastpixel.io/fp/ret_img%2Bv_c323%2Bw_1024%2Bh_683%2Bq_glossy%2Bto_webp/tigrisvalley.com%2Fwp-content%2Fuploads%2F2025%2F12%2Fimage-8-1024x683.png",

    bestTime: ["After meals"],
    frequency: "Food amounts or traditional beverage preparation.",

    usage: "Use as a culinary ingredient or mild traditional infusion.",

    doshas: ["pitta", "vata"],
    prakriti: ["vata", "pitta", "tridoshic"],

    properties: {
      rasa: ["sweet"],
      guna: ["light"],
      virya: "cooling",
      vipaka: "sweet",
    },

    bodySystems: ["digestive system"],
    wellnessGoals: ["digestion", "nutrition"],

    tags: ["fennel", "saunf", "digestion", "spice", "tea"],

    benefits: [
      "Can be used in food and beverages",
      "Commonly consumed after meals in Indian households",
    ],

    suitableFor: ["General nutrition", "Culinary wellness"],

    ingredients: [
      {
        name: "Fennel seeds",
        description: "Seeds of Foeniculum vulgare.",
        form: "Whole seeds",
      },
    ],

    precautions: [
      "Individual sensitivities can occur with concentrated herbal preparations.",
    ],

    contraindications: [],

    recommendedFor: {
      digestion: ["poor", "moderate"],
      goalCategories: ["digestion", "nutrition"],
    },

    traditionalUseNote:
      "Fennel is widely used as a culinary spice and traditional after-meal ingredient.",

    evidenceNote:
      "This record is intended for traditional food and wellness education.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 12. CINNAMON
  // ============================================================

  {
    title: "Cinnamon",
    slug: "cinnamon",
    shortDescription:
      "A fragrant spice traditionally used in Indian cooking and warming herbal beverages.",
    description:
      "Cinnamon is the dried bark of Cinnamomum species and has a long history of culinary and traditional use across Asia.",
    type: "nutrition",
    category: "nutrition",

    imageUrl:
      "https://cdn.fastpixel.io/fp/ret_img%2Bv_c323%2Bw_1024%2Bh_683%2Bq_glossy%2Bto_webp/tigrisvalley.com%2Fwp-content%2Fuploads%2F2025%2F12%2Fimage-8-1024x683.png",

    bestTime: ["With food", "Morning"],
    frequency: "As a culinary spice.",

    usage: "Use ordinary food quantities in meals or beverages.",

    doshas: ["kapha", "vata"],
    prakriti: ["kapha", "vata"],

    properties: {
      rasa: ["pungent", "sweet"],
      guna: ["light", "dry"],
      virya: "warming",
      vipaka: "pungent",
    },

    bodySystems: ["digestive system"],
    wellnessGoals: ["nutrition", "general_wellbeing"],

    tags: ["cinnamon", "dalchini", "spice", "nutrition"],

    benefits: [
      "Adds aroma and flavor to meals",
      "Useful in warm beverage recipes",
    ],

    suitableFor: ["General nutrition", "Cooking"],

    ingredients: [
      {
        name: "Cinnamon bark",
        description: "Dried bark of Cinnamomum species.",
        form: "Stick or powder",
      },
    ],

    precautions: [
      "Concentrated or prolonged supplemental use differs from ordinary food use.",
    ],

    contraindications: [
      "People with liver conditions or those taking medicines should seek professional advice before concentrated use.",
    ],

    recommendedFor: {
      goalCategories: ["nutrition", "general_wellbeing"],
    },

    traditionalUseNote:
      "Cinnamon has a long history of culinary and traditional medicinal use in India and other regions.",

    evidenceNote:
      "NCCIH notes that research does not clearly establish cinnamon supplementation as effective for a specific health condition.",

    sources: [
      {
        title: "Cinnamon: Usefulness and Safety",
        url: "https://www.nccih.nih.gov/health/cinnamon/",
        publisher: "NCCIH",
      },
    ],

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 13. CARDAMOM
  // ============================================================

  {
    title: "Cardamom",
    slug: "cardamom",
    shortDescription:
      "An aromatic spice commonly used in Indian cuisine, tea, and traditional digestive routines.",
    description:
      "Cardamom is a fragrant spice used extensively in Indian cooking and beverages. Its aromatic seeds are also found in traditional wellness preparations.",
    type: "nutrition",
    category: "digestion",

    imageUrl:
      "https://i5.walmartimages.com/seo/Banyan-Botanicals-Cardamom-powder-spice-jar_32498aab-e0b3-4d87-9de4-6cede6c91f43.baa13a562560ef8575a95588dc564b42.jpeg",

    bestTime: ["With meals", "After meals"],
    frequency: "As a culinary ingredient.",

    usage:
      "Use cardamom in food or beverages according to taste and tolerance.",

    doshas: ["vata", "kapha"],
    prakriti: ["vata", "kapha"],

    properties: {
      rasa: ["sweet", "pungent"],
      guna: ["light"],
      virya: "cooling",
      vipaka: "sweet",
    },

    bodySystems: ["digestive system"],
    wellnessGoals: ["digestion", "nutrition"],

    tags: ["cardamom", "elaichi", "spice", "tea", "digestion"],

    benefits: [
      "Adds fragrance and flavor to beverages",
      "Fits into traditional Indian culinary routines",
    ],

    suitableFor: ["General nutrition", "Cooking", "Tea routines"],

    ingredients: [
      {
        name: "Cardamom",
        description: "Aromatic seeds of Elettaria cardamomum.",
        form: "Whole pods or powder",
      },
    ],

    precautions: [],
    contraindications: [],

    recommendedFor: {
      digestion: ["poor", "moderate"],
      goalCategories: ["digestion", "nutrition"],
    },

    traditionalUseNote:
      "Cardamom has a long history as a culinary spice and traditional ingredient.",

    evidenceNote:
      "This entry is focused on culinary and traditional wellness education.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 14. AYURVEDIC SLEEP ROUTINE
  // ============================================================

  {
    title: "Ayurvedic Evening Wind-Down",
    slug: "ayurvedic-evening-wind-down",
    shortDescription:
      "A calm evening routine inspired by traditional Ayurvedic lifestyle principles.",
    description:
      "This gentle evening routine combines consistent timing, reduced stimulation, quiet reflection, and simple self-care practices to create a calmer transition toward sleep.",
    type: "routine",
    category: "sleep",

    imageUrl:
      "https://cosmohit-ayurved.in/cdn/shop/articles/routine-image-morning-ayurvedic-self-care-setup-with-herbal-tea-oil-massage-and-yoga.png?v=1762785264",

    durationMinutes: 30,
    difficulty: "beginner",

    bestTime: ["Evening"],
    frequency: "Nightly or several evenings per week.",
    duration: "20–30 minutes",

    preparation:
      "Reduce unnecessary stimulation and prepare a comfortable, quiet environment.",

    usage:
      "Follow a consistent wind-down sequence that may include gentle breathing, reading, journaling, or quiet self-care.",

    howToUse: [
      "Dim strong lights and reduce unnecessary screen use.",
      "Take a few minutes for calm breathing.",
      "Complete a simple personal-care ritual.",
      "Keep bedtime and wake time reasonably consistent.",
    ],

    doshas: ["vata"],
    prakriti: ["vata", "tridoshic"],

    bodySystems: ["nervous system"],
    wellnessGoals: ["sleep", "stress_management", "relaxation"],

    tags: ["sleep", "evening", "routine", "wind down", "relaxation"],

    benefits: [
      "Encourages consistent evening habits",
      "Creates space for relaxation",
      "Supports healthy sleep hygiene practices",
    ],

    suitableFor: [
      "General sleep wellness",
      "Busy lifestyles",
      "Evening self-care",
    ],

    precautions: [],
    contraindications: [],

    recommendedFor: {
      sleepQualities: ["poor", "average"],
      stressLevels: ["high", "moderate"],
      concerns: ["sleep", "stress"],
      goalCategories: ["sleep", "stress_management", "general_wellbeing"],
    },

    traditionalUseNote:
      "The routine is inspired by traditional Ayurvedic lifestyle concepts around regular daily rhythms.",

    evidenceNote:
      "The individual components are presented as general sleep-hygiene and relaxation practices rather than medical treatment.",

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 15. DINACHARYA
  // ============================================================

  {
    title: "Dinacharya Daily Rhythm",
    slug: "dinacharya-daily-rhythm",
    shortDescription:
      "An educational introduction to the Ayurvedic concept of a consistent daily routine.",
    description:
      "Dinacharya refers broadly to a daily routine in Ayurveda. The concept emphasizes regularity, personal hygiene, meals, movement, rest, and mindful transitions throughout the day.",
    type: "routine",
    category: "general_wellness",

    imageUrl:
      "https://images.bhaskarassets.com/web2images/1884/2025/07/02/artboard-1_1751477465.png",

    durationMinutes: 20,
    difficulty: "beginner",

    bestTime: ["Morning"],
    frequency: "Daily.",
    duration: "Adapt to individual lifestyle.",

    preparation:
      "Start with a small number of realistic habits rather than changing the entire day at once.",

    usage:
      "Build a consistent daily rhythm around waking, meals, movement, personal care, focused work, relaxation, and sleep.",

    howToUse: [
      "Choose a reasonably consistent wake time.",
      "Begin the day with personal hygiene and hydration.",
      "Keep meals reasonably regular.",
      "Include movement and periods of rest.",
      "Create a consistent evening transition.",
    ],

    doshas: ["tridoshic"],
    prakriti: ["vata", "pitta", "kapha", "tridoshic"],

    bodySystems: ["digestive system", "nervous system"],

    wellnessGoals: [
      "general_wellbeing",
      "stress_management",
      "sleep",
      "nutrition",
    ],

    tags: ["dinacharya", "daily routine", "lifestyle", "ayurveda"],

    benefits: [
      "Encourages consistency",
      "Supports mindful daily planning",
      "Connects self-care habits into one routine",
    ],

    suitableFor: [
      "General wellness",
      "Lifestyle planning",
      "Ayurveda education",
    ],

    precautions: [],
    contraindications: [],

    recommendedFor: {
      concerns: ["stress", "sleep"],
      goalCategories: [
        "general_wellbeing",
        "stress_management",
        "sleep",
        "nutrition",
      ],
    },

    traditionalUseNote:
      "Dinacharya is a traditional Ayurvedic concept centered on daily rhythm and routine.",

    evidenceNote:
      "The app presents Dinacharya as lifestyle education rather than as a treatment protocol.",

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 16. WARM HERBAL TEA
  // ============================================================

  {
    title: "Warm Ginger Herbal Tea",
    slug: "warm-ginger-herbal-tea",
    shortDescription:
      "A simple warming beverage inspired by traditional Indian herbal routines.",
    description:
      "Warm ginger tea combines a familiar culinary spice with a calming beverage ritual. It can be enjoyed as part of a mindful morning or evening routine.",
    type: "nutrition",
    category: "digestion",

    imageUrl:
      "https://cosmohit-ayurved.in/cdn/shop/articles/routine-image-morning-ayurvedic-self-care-setup-with-herbal-tea-oil-massage-and-yoga.png?v=1762785264",

    durationMinutes: 10,
    difficulty: "beginner",

    bestTime: ["Morning", "After meals"],
    frequency: "Occasionally or as preferred.",
    duration: "5–10 minutes",

    preparation:
      "Slice or lightly crush fresh ginger and steep it in hot water. Allow the beverage to cool to a comfortable temperature.",

    usage:
      "Enjoy as a warm beverage. Avoid excessively concentrated preparations.",

    howToUse: [
      "Wash and lightly slice fresh ginger.",
      "Add a small amount to hot water.",
      "Steep for several minutes.",
      "Strain and allow to cool before drinking.",
    ],

    doshas: ["vata", "kapha"],
    prakriti: ["vata", "kapha"],

    bodySystems: ["digestive system"],
    wellnessGoals: ["digestion", "relaxation", "nutrition"],

    tags: ["ginger tea", "herbal tea", "warm beverage", "digestion"],

    benefits: [
      "Provides a warm beverage ritual",
      "Can be incorporated into mindful routines",
      "Uses a familiar culinary ingredient",
    ],

    suitableFor: ["General wellness", "Warm beverage routines"],

    ingredients: [
      {
        name: "Fresh ginger",
        description: "Fresh ginger root.",
        quantity: "Small piece",
        form: "Fresh",
      },
      {
        name: "Water",
        description: "Hot drinking water.",
        quantity: "1 cup",
        form: "Liquid",
      },
    ],

    precautions: [
      "Concentrated ginger may cause heartburn or digestive discomfort in some people.",
    ],

    contraindications: [],

    recommendedFor: {
      digestion: ["poor", "moderate"],
      goalCategories: ["digestion", "nutrition"],
    },

    traditionalUseNote:
      "Ginger has a long history of use as a food and traditional herbal ingredient.",

    evidenceNote:
      "This record is a general beverage idea and should not be interpreted as treatment advice.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 17. KITCHARI
  // ============================================================

  {
    title: "Simple Kitchari",
    slug: "simple-kitchari",
    shortDescription:
      "A gentle rice-and-lentil dish commonly discussed in Ayurvedic food traditions.",
    description:
      "Kitchari is a traditional dish commonly made with rice, split mung dal, spices, and vegetables. It can be adapted into a simple balanced meal according to individual dietary needs.",
    type: "nutrition",
    category: "nutrition",

    imageUrl: "https://ayurvedamagazine.org/uploads/news_image/news_1583_1.jpg",

    durationMinutes: 30,
    difficulty: "beginner",

    bestTime: ["Lunch", "Dinner"],
    frequency: "As a meal rather than a restrictive cleanse.",
    duration: "20–30 minutes preparation",

    preparation:
      "Rinse rice and mung dal. Cook them together with water and mild spices until soft.",

    usage:
      "Serve as a normal meal with vegetables and suitable accompaniments.",

    howToUse: [
      "Rinse rice and split mung dal.",
      "Cook with sufficient water until soft.",
      "Add mild spices according to preference.",
      "Serve warm with suitable vegetables.",
    ],

    doshas: ["tridoshic"],
    prakriti: ["vata", "pitta", "kapha", "tridoshic"],

    bodySystems: ["digestive system"],
    wellnessGoals: ["nutrition", "digestion", "general_wellbeing"],

    tags: ["kitchari", "khichdi", "nutrition", "rice", "mung dal", "ayurveda"],

    benefits: [
      "Provides a simple home-cooked meal",
      "Can be adapted to different dietary preferences",
      "Useful for nutrition education",
    ],

    suitableFor: ["General nutrition", "Home cooking"],

    ingredients: [
      {
        name: "Rice",
        description: "A staple grain.",
        quantity: "1 part",
        form: "Raw grain",
      },
      {
        name: "Split mung dal",
        description: "Split mung beans.",
        quantity: "1 part",
        form: "Dry lentil",
      },
      {
        name: "Cumin",
        description: "Optional culinary spice.",
        form: "Whole or ground",
      },
    ],

    precautions: [],
    contraindications: [],

    recommendedFor: {
      digestion: ["poor", "moderate", "good"],
      goalCategories: ["nutrition", "digestion", "general_wellbeing"],
    },

    traditionalUseNote:
      "Kitchari is a familiar dish in Indian food traditions and is frequently discussed in Ayurvedic dietary contexts.",

    evidenceNote:
      "The app presents kitchari as a food and nutrition idea, not as a medical detox or treatment.",

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 18. TURMERIC MILK
  // ============================================================

  {
    title: "Warm Turmeric Milk",
    slug: "warm-turmeric-milk",
    shortDescription:
      "A traditional-style warm beverage using turmeric and milk or a suitable alternative.",
    description:
      "Warm turmeric milk is a familiar Indian-style beverage made with turmeric, milk, and optional warming spices. It is presented here as a culinary wellness ritual.",
    type: "nutrition",
    category: "relaxation",

    imageUrl:
      "https://www.kivaorganics.co.ke/cdn/shop/collections/ChatGPT_Image_Nov_26_2025_06_31_54_PM.png?v=1765992236&width=1500",

    durationMinutes: 10,
    difficulty: "beginner",

    bestTime: ["Evening"],
    frequency: "Occasionally or according to dietary preference.",
    duration: "5–10 minutes",

    preparation:
      "Warm milk or a suitable alternative and add a small culinary amount of turmeric. Optional spices can be added for flavor.",

    usage: "Enjoy as a warm beverage rather than as a concentrated supplement.",

    howToUse: [
      "Warm one cup of milk or suitable alternative.",
      "Add a small culinary amount of turmeric.",
      "Stir well and add optional spices.",
      "Serve warm.",
    ],

    doshas: ["kapha", "vata"],
    prakriti: ["vata", "kapha"],

    bodySystems: ["digestive system"],
    wellnessGoals: ["relaxation", "nutrition", "general_wellbeing"],

    tags: [
      "turmeric milk",
      "golden milk",
      "haldi milk",
      "evening",
      "nutrition",
    ],

    benefits: [
      "Provides a comforting warm beverage ritual",
      "Uses familiar culinary ingredients",
      "Can become part of an evening routine",
    ],

    suitableFor: ["General nutrition", "Evening routines"],

    ingredients: [
      {
        name: "Turmeric",
        description: "Culinary turmeric powder.",
        quantity: "Small amount",
        form: "Powder",
      },
      {
        name: "Milk",
        description: "Dairy or suitable alternative.",
        quantity: "1 cup",
        form: "Liquid",
      },
    ],

    precautions: [
      "Concentrated curcumin supplements are different from culinary turmeric.",
    ],

    contraindications: [],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      goalCategories: ["relaxation", "nutrition", "general_wellbeing"],
    },

    traditionalUseNote:
      "Turmeric milk is a familiar Indian household beverage and culinary tradition.",

    evidenceNote:
      "NCCIH notes that evidence for turmeric varies by preparation; this record concerns ordinary culinary use rather than concentrated supplementation.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 19. HERBAL SELF-CARE MORNING
  // ============================================================

  {
    title: "Ayurvedic Morning Self-Care",
    slug: "ayurvedic-morning-self-care",
    shortDescription:
      "A simple morning sequence combining hydration, personal care, movement, and mindful breathing.",
    description:
      "This educational routine brings together simple morning habits inspired by Ayurvedic lifestyle traditions, while allowing the sequence to be adapted to modern schedules.",
    type: "routine",
    category: "energy",

    imageUrl:
      "https://cosmohit-ayurved.in/cdn/shop/articles/routine-image-morning-ayurvedic-self-care-setup-with-herbal-tea-oil-massage-and-yoga.png?v=1762785264",

    durationMinutes: 20,
    difficulty: "beginner",

    bestTime: ["Morning"],
    frequency: "Daily or several mornings per week.",
    duration: "15–20 minutes",

    preparation:
      "Prepare water, comfortable clothing, and a quiet space before beginning.",

    usage:
      "Begin with hydration and personal care, followed by gentle movement or breathing.",

    howToUse: [
      "Wake and hydrate according to personal needs.",
      "Complete basic personal hygiene.",
      "Spend a few minutes with gentle movement.",
      "Finish with calm breathing or quiet reflection.",
    ],

    doshas: ["tridoshic"],
    prakriti: ["vata", "pitta", "kapha", "tridoshic"],

    bodySystems: ["nervous system", "digestive system"],
    wellnessGoals: ["energy", "general_wellbeing", "stress_management"],

    tags: [
      "morning routine",
      "dinacharya",
      "self care",
      "morning",
      "mindfulness",
    ],

    benefits: [
      "Creates a consistent start to the day",
      "Encourages mindful transitions",
      "Combines several simple wellness habits",
    ],

    suitableFor: ["General wellness", "Morning routines"],

    precautions: [],
    contraindications: [],

    recommendedFor: {
      energyLevels: ["low", "moderate"],
      stressLevels: ["high", "moderate"],
      goalCategories: ["energy", "general_wellbeing", "stress_management"],
    },

    traditionalUseNote:
      "The routine is inspired by Ayurvedic daily-rhythm concepts.",

    evidenceNote:
      "The practices are presented as general lifestyle habits and not as treatment for a medical condition.",

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 20. AYURVEDIC SKINCARE
  // ============================================================

  {
    title: "Gentle Ayurvedic Skincare",
    slug: "gentle-ayurvedic-skincare",
    shortDescription:
      "A simple educational skincare routine inspired by traditional botanical self-care.",
    description:
      "This routine focuses on gentle cleansing, moisturizing, and mindful use of simple botanical ingredients rather than aggressive or highly concentrated preparations.",
    type: "practice",
    category: "skin",

    imageUrl: "https://sreemookambikaayurveda.com/assets/abt1-cJCMwNUN.png",

    durationMinutes: 10,
    difficulty: "beginner",

    bestTime: ["Morning", "Evening"],
    frequency: "Daily according to personal skincare needs.",
    duration: "5–10 minutes",

    preparation:
      "Choose simple products appropriate for your skin type and patch-test new topical products.",

    usage:
      "Cleanse gently and apply a suitable moisturizer or simple botanical preparation.",

    howToUse: [
      "Cleanse the skin gently.",
      "Pat dry without aggressive rubbing.",
      "Apply a suitable moisturizer.",
      "Stop using any product that causes irritation.",
    ],

    doshas: ["pitta", "vata"],
    prakriti: ["pitta", "vata", "tridoshic"],

    bodySystems: ["skin"],
    wellnessGoals: ["skin_care", "self_care"],

    tags: ["skincare", "skin", "self care", "botanical", "ayurveda"],

    benefits: [
      "Encourages gentle skincare habits",
      "Promotes consistent self-care",
      "Encourages attention to skin tolerance",
    ],

    suitableFor: ["General skincare", "Self-care routines"],

    precautions: [
      "Patch-test new topical preparations.",
      "Avoid applying irritating substances to broken skin.",
    ],

    contraindications: [
      "Seek professional dermatological advice for persistent or severe skin conditions.",
    ],

    recommendedFor: {
      concerns: ["skin"],
      goalCategories: ["skin_care", "self_care"],
    },

    traditionalUseNote:
      "Ayurvedic traditions include many botanical and oil-based personal-care practices.",

    evidenceNote:
      "This routine focuses on gentle skincare principles and does not claim to treat dermatological disease.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 21. HERBAL HAIR OILING
  // ============================================================

  {
    title: "Ayurvedic Hair Oiling",
    slug: "ayurvedic-hair-oiling",
    shortDescription:
      "A traditional-style hair and scalp oiling routine used as part of personal care.",
    description:
      "Hair oiling is a familiar personal-care practice in India. This routine focuses on gentle scalp massage and appropriate hair-oil use without making claims about treating hair loss or scalp disease.",
    type: "practice",
    category: "hair",

    imageUrl: "https://sreemookambikaayurveda.com/assets/abt1-cJCMwNUN.png",

    durationMinutes: 15,
    difficulty: "beginner",

    bestTime: ["Evening"],
    frequency: "Once or twice weekly according to preference.",
    duration: "10–15 minutes",

    preparation: "Choose a suitable hair oil and prepare a comfortable space.",

    usage:
      "Apply a small amount of oil to the scalp and hair, using gentle massage movements.",

    howToUse: [
      "Apply a small amount of suitable oil.",
      "Massage the scalp gently using fingertips.",
      "Leave for a comfortable period.",
      "Wash according to your normal hair-care routine.",
    ],

    doshas: ["vata"],
    prakriti: ["vata", "tridoshic"],

    bodySystems: ["skin", "hair"],
    wellnessGoals: ["hair_care", "self_care", "relaxation"],

    tags: ["hair oiling", "scalp massage", "hair care", "self care"],

    benefits: [
      "Creates a relaxing personal-care ritual",
      "Encourages gentle scalp care",
      "Can be incorporated into a regular hair-care routine",
    ],

    suitableFor: ["General hair care", "Self-care routines"],

    precautions: [
      "Stop if scalp irritation develops.",
      "Avoid applying oils to broken or infected skin.",
    ],

    contraindications: [
      "Seek professional advice for persistent scalp conditions or significant hair loss.",
    ],

    recommendedFor: {
      concerns: ["hair"],
      goalCategories: ["hair_care", "self_care", "relaxation"],
    },

    traditionalUseNote:
      "Hair oiling is a longstanding personal-care practice in India and appears in traditional wellness routines.",

    evidenceNote:
      "This record presents hair oiling as personal care and does not claim that it treats hair loss or scalp disease.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 22. FOOT MASSAGE
  // ============================================================

  {
    title: "Gentle Foot Oil Massage",
    slug: "gentle-foot-oil-massage",
    shortDescription:
      "A calming foot-care ritual inspired by traditional Ayurvedic oil-massage practices.",
    description:
      "A gentle foot massage can be incorporated into an evening self-care routine. This entry focuses on comfort, relaxation, and safe topical use.",
    type: "practice",
    category: "relaxation",

    imageUrl:
      "https://djayurveda.com/cdn/shop/files/ChatGPT_Image_May_10_2026_06_46_56_PM.png?v=1778419473",

    durationMinutes: 10,
    difficulty: "beginner",

    bestTime: ["Evening"],
    frequency: "Several evenings per week as comfortable.",
    duration: "5–10 minutes",

    preparation: "Sit comfortably and use a small amount of suitable body oil.",

    usage: "Massage the feet gently using comfortable pressure.",

    howToUse: [
      "Wash and dry the feet.",
      "Apply a small amount of suitable oil.",
      "Massage gently with comfortable pressure.",
      "Clean the feet or allow the oil to absorb according to preference.",
    ],

    doshas: ["vata"],
    prakriti: ["vata", "tridoshic"],

    bodySystems: ["musculoskeletal", "skin"],
    wellnessGoals: ["relaxation", "sleep", "self_care"],

    tags: ["foot massage", "padabhyanga", "relaxation", "evening"],

    benefits: [
      "Creates a calming evening ritual",
      "Encourages body awareness",
      "Can support a consistent self-care routine",
    ],

    suitableFor: ["Evening relaxation", "General self-care"],

    precautions: [
      "Avoid massage over wounds, infection, or significant swelling.",
      "Use a non-slip surface after applying oil.",
    ],

    contraindications: [
      "Seek medical advice for unexplained foot swelling or acute pain.",
    ],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      sleepQualities: ["poor", "average"],
      concerns: ["stress", "body pain", "sleep"],
      goalCategories: ["relaxation", "sleep", "stress_management"],
    },

    traditionalUseNote:
      "Foot oil massage is found within traditional Ayurvedic personal-care practices.",

    evidenceNote:
      "This record presents the practice as a relaxation and self-care routine rather than a medical treatment.",

    isActive: true,
    isFeatured: false,
  },

  // ============================================================
  // 23. AYURVEDIC BREATHING
  // ============================================================

  {
    title: "Calm Breathing Practice",
    slug: "calm-breathing-practice",
    shortDescription:
      "A gentle breathing routine that can be paired with Ayurvedic-inspired relaxation practices.",
    description:
      "Slow, comfortable breathing can be incorporated into a quiet wellness routine. The practice should remain gentle and should never involve forceful breath retention.",
    type: "practice",
    category: "stress",

    imageUrl: "https://ayurvedamagazine.org/uploads/news_image/news_1583_1.jpg",

    durationMinutes: 5,
    difficulty: "beginner",

    bestTime: ["Morning", "Evening"],
    frequency: "5 minutes daily or as comfortable.",
    duration: "3–5 minutes",

    preparation:
      "Sit comfortably in a stable position and allow the breath to remain natural.",

    usage:
      "Breathe slowly and comfortably without forcing the breath or holding it for long periods.",

    howToUse: [
      "Sit comfortably with the spine relaxed.",
      "Notice the natural breath.",
      "Gradually make the exhalation comfortable and unforced.",
      "Stop if you feel dizzy, uncomfortable, or short of breath.",
    ],

    doshas: ["vata", "pitta"],
    prakriti: ["vata", "pitta", "tridoshic"],

    bodySystems: ["respiratory system", "nervous system"],
    wellnessGoals: ["stress_management", "relaxation", "mental_wellbeing"],

    tags: ["breathing", "pranayama", "calm", "relaxation", "mindfulness"],

    benefits: [
      "Creates a short mindful pause",
      "Encourages awareness of breathing",
      "Can be included in relaxation routines",
    ],

    suitableFor: ["General wellness", "Relaxation routines"],

    precautions: [
      "Do not force the breath.",
      "Stop if dizziness, chest discomfort, or breathing difficulty occurs.",
    ],

    contraindications: [
      "People with significant respiratory or cardiovascular conditions should seek appropriate professional guidance before structured breathing exercises.",
    ],

    recommendedFor: {
      stressLevels: ["high", "moderate"],
      concerns: ["stress"],
      goalCategories: ["stress_management", "mental_wellbeing", "relaxation"],
    },

    traditionalUseNote:
      "Breathing practices are included in several Indian wellness traditions and are often paired with yoga and Ayurveda.",

    evidenceNote:
      "The app presents this as a gentle relaxation practice rather than a treatment for anxiety or respiratory disease.",

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 24. AYURVEDA EDUCATION
  // ============================================================

  {
    title: "Understanding Vata, Pitta and Kapha",
    slug: "understanding-vata-pitta-kapha",
    shortDescription:
      "An educational introduction to the three dosha concepts used in Ayurveda.",
    description:
      "Ayurveda traditionally describes three doshas—Vata, Pitta, and Kapha—as conceptual frameworks used to discuss qualities and balance in the body and mind. This entry introduces the concepts without treating them as medical diagnoses.",
    type: "knowledge",
    category: "general_wellness",

    imageUrl: "https://ayurvedamagazine.org/uploads/news_image/news_1583_1.jpg",

    bestTime: ["Anytime"],

    usage:
      "Use this content as introductory education about Ayurvedic terminology.",

    doshas: ["vata", "pitta", "kapha", "tridoshic"],
    prakriti: ["vata", "pitta", "kapha", "tridoshic"],

    bodySystems: [],
    wellnessGoals: ["general_wellbeing", "self_awareness"],

    tags: ["vata", "pitta", "kapha", "dosha", "ayurveda education"],

    benefits: [
      "Introduces important Ayurvedic terminology",
      "Provides context for understanding Ayurveda content",
      "Encourages informed exploration of traditional concepts",
    ],

    suitableFor: ["Beginners", "Ayurveda education", "General wellness"],

    precautions: [],
    contraindications: [],

    recommendedFor: {
      goalCategories: ["general_wellbeing"],
    },

    traditionalUseNote:
      "Vata, Pitta, and Kapha are foundational concepts within classical Ayurvedic frameworks.",

    evidenceNote:
      "Doshas are traditional Ayurvedic concepts and should not be presented as substitutes for medical diagnosis or laboratory assessment.",

    isActive: true,
    isFeatured: true,
  },

  // ============================================================
  // 25. YOGA + AYURVEDA
  // ============================================================

  {
    title: "Yoga and Ayurveda Lifestyle Connection",
    slug: "yoga-ayurveda-lifestyle-connection",
    shortDescription:
      "An introduction to how yoga and Ayurveda are traditionally discussed together within Indian wellness traditions.",
    description:
      "Yoga and Ayurveda are two traditional Indian systems that are often discussed together in modern wellness settings. This educational entry explores how movement, breathing, food, daily rhythm, and self-care may be combined without presenting the combination as a medical treatment.",
    type: "knowledge",
    category: "general_wellness",

    imageUrl: "https://ayurvedamagazine.org/uploads/news_image/news_1583_1.jpg",

    durationMinutes: 10,
    difficulty: "beginner",

    bestTime: ["Morning", "Evening"],

    usage:
      "Use as general educational content when exploring the relationship between yoga and Ayurvedic lifestyle practices.",

    doshas: ["tridoshic"],
    prakriti: ["vata", "pitta", "kapha", "tridoshic"],

    bodySystems: ["musculoskeletal", "nervous system", "digestive system"],

    wellnessGoals: [
      "general_wellbeing",
      "fitness",
      "stress_management",
      "flexibility",
    ],

    tags: ["yoga", "ayurveda", "lifestyle", "wellness", "mind body"],

    benefits: [
      "Connects two traditional Indian wellness systems",
      "Provides lifestyle education",
      "Encourages a holistic view of daily wellness habits",
    ],

    suitableFor: [
      "General wellness",
      "Yoga practitioners",
      "Ayurveda beginners",
    ],

    precautions: [],
    contraindications: [],

    recommendedFor: {
      goalCategories: [
        "general_wellbeing",
        "fitness",
        "stress_management",
        "flexibility",
      ],
    },

    traditionalUseNote:
      "Yoga and Ayurveda have distinct histories and frameworks but are frequently discussed together in Indian wellness traditions.",

    evidenceNote:
      "This is educational content and does not claim that combining yoga and Ayurveda treats a medical condition.",

    isActive: true,
    isFeatured: true,
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
