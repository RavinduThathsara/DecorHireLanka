// backend/src/controllers/adminMessagesController.js
import ContactMessage from "../models/ContactMessage.js";

export const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({ messages });
  } catch (error) {
    console.error("getAllMessages error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};
