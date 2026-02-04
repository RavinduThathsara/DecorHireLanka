import express from "express";
import {
  createContactMessage,
  getAllContactMessagesAdmin,
  updateContactMessageStatus,
} from "../controllers/contactController.js";

const router = express.Router();

// customer
router.post("/", createContactMessage);

// admin
router.get("/admin/all", getAllContactMessagesAdmin);
router.put("/admin/:id/status", updateContactMessageStatus);

export default router;
