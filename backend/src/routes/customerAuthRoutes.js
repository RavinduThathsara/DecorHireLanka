// backend/src/routes/customerAuthRoutes.js
import express from "express";
import {
  googleCustomerAuth,
  loginCustomer,
  registerCustomer,
} from "../controllers/customerAuthController.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/google", googleCustomerAuth);

export default router;
