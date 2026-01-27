// backend/src/routes/adminMessagesRoutes.js
import express from "express";
import { getAllMessages } from "../controllers/adminMessagesController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin only
router.get("/messages", requireAuth, requireAdmin, getAllMessages);

export default router;
