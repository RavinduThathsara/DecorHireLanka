// backend/src/routes/galleryRoutes.js
import express from "express";
import {
  getActiveGallery,
  adminGetAllGallery,
  adminUploadGalleryImage,
  adminUpdateGalleryImage,
  adminDeleteGalleryImage,
} from "../controllers/galleryController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Public
router.get("/", getActiveGallery);

// Admin
router.get("/admin/all", requireAuth, requireAdmin, adminGetAllGallery);
router.post(
  "/admin/upload",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  adminUploadGalleryImage
);
router.put("/admin/:id", requireAuth, requireAdmin, adminUpdateGalleryImage);
router.delete("/admin/:id", requireAuth, requireAdmin, adminDeleteGalleryImage);

export default router;
