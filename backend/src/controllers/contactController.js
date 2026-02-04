// backend/src/controllers/contactController.js
import ContactMessage from "../models/ContactMessage.js";

// CUSTOMER: submit contact form
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, location, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    const saved = await ContactMessage.create({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      location: location || "",
      message,
      status: "NEW",
    });

    return res.status(201).json({
      message: "Message sent successfully. We will contact you soon ✅",
      data: { id: saved._id },
    });
  } catch (error) {
    console.error("createContactMessage error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: get all messages
export const getAllContactMessagesAdmin = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({ messages });
  } catch (error) {
    console.error("getAllContactMessagesAdmin error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: update message status
export const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Message not found." });
    }

    return res.json({ message: "Status updated.", updated });
  } catch (error) {
    console.error("updateContactMessageStatus error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};
