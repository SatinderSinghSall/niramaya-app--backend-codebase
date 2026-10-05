import express from "express";
import {
  create,
  getCollection,
  getCollections,
  getDocuments,
  getOne,
  getSchema,
  remove,
  update,
} from "../controllers/admin/adminDatabase.controller.js";
import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(authenticateAdmin);

router.get("/collections", getCollections);
router.get("/collections/:name/schema", getSchema);
router.get("/collections/:name/stats", getCollection);
router.get("/collections/:name/documents", getDocuments);
router.get("/collections/:name/documents/:id", getOne);

router.post(
  "/collections/:name/documents",
  requireAdminRole("super_admin", "admin", "content_manager"),
  create,
);

router.patch(
  "/collections/:name/documents/:id",
  requireAdminRole("super_admin", "admin", "content_manager"),
  update,
);

router.delete(
  "/collections/:name/documents/:id",
  requireAdminRole("super_admin", "admin"),
  remove,
);

export default router;
