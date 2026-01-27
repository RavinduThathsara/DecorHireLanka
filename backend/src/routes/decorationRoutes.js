// backend/src/routes/decorationRoutes.js
import express from "express";
import {
  getActiveDecorations,
  adminGetAllDecorations,
  adminCreateDecoration,
  adminUpdateDecoration,
  adminDeleteDecoration,
} from "../controllers/decorationController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public (customer)
router.get("/", getActiveDecorations);

// Admin CRUD
router.get("/admin/all", requireAuth, requireAdmin, adminGetAllDecorations);
router.post("/admin", requireAuth, requireAdmin, adminCreateDecoration);
router.put("/admin/:id", requireAuth, requireAdmin, adminUpdateDecoration);
router.delete("/admin/:id", requireAuth, requireAdmin, adminDeleteDecoration);

export default router;
