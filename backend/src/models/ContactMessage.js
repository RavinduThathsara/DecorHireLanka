// backend/src/models/ContactMessage.js
import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: false, trim: true, maxlength: 30 },
    location: { type: String, required: false, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    eventType: {
      type: String,
      required: false,
      enum: ["Wedding Decoration", "Birthday Decoration", "Other Event Decoration", ""],
      default: ""
    },
    eventDate: { type: Date, required: false },

    status: { type: String, default: "NEW", enum: ["NEW", "REPLIED"] },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
export default ContactMessage;
