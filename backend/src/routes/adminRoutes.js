import express from "express";
import { createAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/create", createAdmin);   // run once
router.post("/login", loginAdmin);

export default router;
