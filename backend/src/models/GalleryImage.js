// backend/src/models/GalleryImage.js
import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true, maxlength: 120 },
    // Category shown on the public gallery page.
    // Expected values: "wedding" | "birthday" | "other"
    category: { type: String, default: "other", trim: true, lowercase: true },
    imageUrl: { type: String, required: true }, // e.g. "/uploads/1700000-photo.jpg"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
export default GalleryImage;
