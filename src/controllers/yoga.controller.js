import https from "https";

import {
  getYogaItems,
  getYogaItemById,
  incrementYogaViewCount,
  getYogaCategories,
  getFeaturedYoga,
  getPersonalizedYogaRecommendations,
} from "../services/yoga.service.js";

// ─────────────────────────
// GET ALL YOGA
// ─────────────────────────

export const getAllYoga = async (req, res, next) => {
  try {
    const {
      type,
      category,
      difficulty,
      featured,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await getYogaItems({
      type,
      category,
      difficulty,
      featured: featured === "true",
      search,
      page: Math.max(Number(page) || 1, 1),
      limit: Math.min(Math.max(Number(limit) || 20, 1), 50),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────
// GET YOGA BY ID
// ─────────────────────────

export const getYogaById = async (req, res, next) => {
  try {
    const item = await getYogaItemById(req.params.id);

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────
// INCREMENT YOGA VIEW COUNT
// ─────────────────────────

export const incrementViewCount = async (req, res, next) => {
  try {
    const item = await incrementYogaViewCount(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        viewCount: item.viewCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────
// GET YOGA CATEGORIES
// ─────────────────────────

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getYogaCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────
// GET FEATURED YOGA
// ─────────────────────────

export const getFeatured = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 20);

    const items = await getFeaturedYoga(limit);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────
// GET PERSONALIZED
// RECOMMENDATIONS
// ─────────────────────────

export const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const result = await getPersonalizedYogaRecommendations(req.user._id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────
// PROXY YOGA IMAGE
// Android-safe Wikimedia image proxy
// ─────────────────────────

export const proxyYogaImage = async (req, res, next) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const decodedUrl = decodeURIComponent(imageUrl);

    if (!decodedUrl.includes("commons.wikimedia.org")) {
      return res.status(400).json({
        success: false,
        message: "Only Wikimedia Commons images are supported",
      });
    }

    const sourceUrl = new URL(decodedUrl);

    // Extract filename from:
    // /wiki/Special:FilePath/Paschimottanasana.jpg
    const parts = sourceUrl.pathname.split("/");

    const fileName = decodeURIComponent(parts[parts.length - 1]);

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "Invalid Wikimedia filename",
      });
    }

    // Ask Wikimedia API for the REAL upload.wikimedia.org URL
    const apiUrl =
      "https://commons.wikimedia.org/w/api.php" +
      `?action=query` +
      `&format=json` +
      `&prop=imageinfo` +
      `&iiprop=url` +
      `&iiurlwidth=1200` +
      `&titles=File:${encodeURIComponent(fileName)}`;

    const apiRequest = https.get(
      apiUrl,
      {
        headers: {
          "User-Agent": "Niramaya/1.0 (wellness application)",
          Accept: "application/json",
        },
      },
      (apiResponse) => {
        let body = "";

        apiResponse.on("data", (chunk) => {
          body += chunk;
        });

        apiResponse.on("end", () => {
          try {
            if (apiResponse.statusCode !== 200) {
              return res.status(apiResponse.statusCode || 502).json({
                success: false,
                message: "Unable to resolve Wikimedia image",
              });
            }

            const data = JSON.parse(body);

            const pages = data?.query?.pages;
            const page = pages ? Object.values(pages)[0] : null;

            const directUrl =
              page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;

            if (!directUrl) {
              return res.status(404).json({
                success: false,
                message: "Wikimedia image not found",
              });
            }

            // Now request the REAL image URL.
            const imageRequest = https.get(
              directUrl,
              {
                headers: {
                  "User-Agent": "Niramaya/1.0 (wellness application)",
                  Accept: "image/avif,image/webp,image/jpeg,image/png,*/*",
                },
              },
              (imageResponse) => {
                if (imageResponse.statusCode !== 200) {
                  return res.status(imageResponse.statusCode || 502).json({
                    success: false,
                    message: "Unable to download Wikimedia image",
                  });
                }

                res.setHeader(
                  "Content-Type",
                  imageResponse.headers["content-type"] || "image/jpeg",
                );

                res.setHeader("Cache-Control", "public, max-age=86400");

                imageResponse.pipe(res);
              },
            );

            imageRequest.on("error", next);
          } catch (error) {
            next(error);
          }
        });
      },
    );

    apiRequest.on("error", next);
  } catch (error) {
    next(error);
  }
};
