// backend/src/controllers/contactController.js
import ContactMessage from "../models/ContactMessage.js";

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
