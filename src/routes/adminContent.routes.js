import express from "express";

import {
  createAyurvedaController,
  createYogaController,
} from "../controllers/admin/adminContent.controller.js";

import {
  authenticateAdminContent,
  requireContentRole,
} from "../middlewares/adminContentAuth.middleware.js";

const buildRouter = (controller) => {
  const router = express.Router();

  router.use(authenticateAdminContent);

  // Static routes must stay before /:id.
  router.get(
    "/categories",
    requireContentRole("super_admin", "admin", "content_manager", "support"),
    controller.categories,
  );

  router.get(
    "/stats",
    requireContentRole("super_admin", "admin", "content_manager", "support"),
    controller.stats,
  );

  router.get(
    "/",
    requireContentRole("super_admin", "admin", "content_manager", "support"),
    controller.list,
  );

  router.get(
    "/:id",
    requireContentRole("super_admin", "admin", "content_manager", "support"),
    controller.getOne,
  );

  router.post(
    "/",
    requireContentRole("super_admin", "admin", "content_manager"),
    controller.create,
  );

  router.patch(
    "/:id",
    requireContentRole("super_admin", "admin", "content_manager"),
    controller.update,
  );

  router.patch(
    "/:id/status",
    requireContentRole("super_admin", "admin", "content_manager"),
    controller.status,
  );

  router.patch(
    "/:id/featured",
    requireContentRole("super_admin", "admin", "content_manager"),
    controller.featured,
  );

  router.delete(
    "/:id",
    requireContentRole("super_admin", "admin"),
    controller.remove,
  );

  return router;
};

export const adminAyurvedaRoutes = buildRouter(createAyurvedaController);
export const adminYogaRoutes = buildRouter(createYogaController);
