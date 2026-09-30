import express from "express";

import {
  create,
  getAll,
  getOne,
  check,
  remove,
  removeByItem,
  removeByType,
} from "../controllers/favorite.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { createFavoriteSchema } from "../utils/favorite.validation.js";

const router = express.Router();

router.use(authenticate);

/*
 * Add favorite
 */
router.post("/", validate(createFavoriteSchema), create);

/*
 * Get favorites
 */
router.get("/", getAll);

/*
 * Check whether an item is favorited.
 *
 * This must come before /:id.
 */
router.get("/check/:itemType/:itemId", check);

/*
 * Remove all favorites of a type.
 *
 * Must come before /:id.
 */
router.delete("/type/:itemType", removeByType);

/*
 * Remove favorite using item type + item ID.
 *
 * Must come before /:id.
 */
router.delete("/:itemType/:itemId", removeByItem);

/*
 * Get one favorite
 */
router.get("/:id", getOne);

/*
 * Remove one favorite by favorite ID
 */
router.delete("/:id", remove);

export default router;
