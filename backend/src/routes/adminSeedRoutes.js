// backend/src/routes/adminSeedRoutes.js
import express from "express";
import { seedAdmin } from "../controllers/adminSeedController.js";

const router = express.Router();

// DEV ONLY: create first admin
router.post("/seed", seedAdmin);

export default router;
