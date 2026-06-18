import express from "express";
import {
  createContactMessage,
  getAllContactMessagesAdmin,
  updateContactMessageStatus,
  customerGetMyMessages,
  customerUpdateContactMessage,
  customerDeleteContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

// customer
router.post("/", createContactMessage);
router.get("/customer/my-messages", customerGetMyMessages);
router.put("/customer/:id", customerUpdateContactMessage);
router.delete("/customer/:id", customerDeleteContactMessage);

// admin
router.get("/admin/all", getAllContactMessagesAdmin);
router.put("/admin/:id/status", updateContactMessageStatus);

export default router;
