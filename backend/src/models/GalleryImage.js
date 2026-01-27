// backend/src/models/GalleryImage.js
import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true, maxlength: 120 },
    imageUrl: { type: String, required: true }, // e.g. "/uploads/1700000-photo.jpg"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
export default GalleryImage;
