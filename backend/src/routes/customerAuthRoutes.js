// backend/src/routes/customerAuthRoutes.js
import express from "express";
import { loginCustomer, registerCustomer } from "../controllers/customerAuthController.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

export default router;
