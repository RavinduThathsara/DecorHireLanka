import express from "express";
import {
  createContactMessage,
  getAllContactMessagesAdmin,
  updateContactMessageStatus,
  customerGetMyMessages,
} from "../controllers/contactController.js";

const router = express.Router();

// customer
router.post("/", createContactMessage);
router.get("/customer/my-messages", customerGetMyMessages);

// admin
router.get("/admin/all", getAllContactMessagesAdmin);
router.put("/admin/:id/status", updateContactMessageStatus);

export default router;
