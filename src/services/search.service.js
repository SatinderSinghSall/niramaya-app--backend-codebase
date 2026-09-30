import Ayurveda from "../models/ayurveda.model.js";
import Yoga from "../models/yoga.model.js";

const buildSearchRegex = (query) => {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(escaped, "i");
};

const buildAyurvedaFilter = ({ regex, category, ayurvedaType }) => {
  const filter = {
    isActive: true,

    $or: [
      {
        title: regex,
      },
      {
        description: regex,
      },
      {
        slug: regex,
      },
      {
        tags: regex,
      },
      {
        benefits: regex,
      },
      {
        usage: regex,
      },
      {
        precautions: regex,
      },
      {
        "ingredients.name": regex,
      },
    ],
  };

  if (category) {
    filter.category = category;
  }

  if (ayurvedaType) {
    filter.type = ayurvedaType;
  }

  return filter;
};

const buildYogaFilter = ({ regex, category, difficulty }) => {
  const filter = {
    isActive: true,

    $or: [
      {
        title: regex,
      },
      {
        description: regex,
      },
      {
        slug: regex,
      },
      {
        tags: regex,
      },
      {
        benefits: regex,
      },
      {
        instructions: regex,
      },
      {
        precautions: regex,
      },
      {
        contraindications: regex,
      },
    ],
  };

  if (category) {
    filter.category = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  return filter;
};

const normalizeResult = (item, type) => ({
  ...item,
  resultType: type,
});

export const searchContent = async ({
  query,
  type = "all",
  category,
  difficulty,
  ayurvedaType,
  page = 1,
  limit = 20,
}) => {
  const regex = buildSearchRegex(query);

  const skip = (page - 1) * limit;

  const searchAyurveda = type === "all" || type === "ayurveda";

  const searchYoga = type === "all" || type === "yoga";

  const results = [];
  let total = 0;

  if (searchAyurveda) {
    const filter = buildAyurvedaFilter({
      regex,
      category,
      ayurvedaType,
    });

    const [items, count] = await Promise.all([
      Ayurveda.find(filter)
        .sort({
          isFeatured: -1,
          createdAt: -1,
        })
        .lean(),

      Ayurveda.countDocuments(filter),
    ]);

    results.push(...items.map((item) => normalizeResult(item, "ayurveda")));

    total += count;
  }

  if (searchYoga) {
    const filter = buildYogaFilter({
      regex,
      category,
      difficulty,
    });

    const [items, count] = await Promise.all([
      Yoga.find(filter)
        .sort({
          isFeatured: -1,
          createdAt: -1,
        })
        .lean(),

      Yoga.countDocuments(filter),
    ]);

    results.push(...items.map((item) => normalizeResult(item, "yoga")));

    total += count;
  }

  results.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const paginatedResults = results.slice(skip, skip + limit);

  const totalPages = Math.ceil(total / limit);

  return {
    query,
    type,
    results: paginatedResults,

    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
