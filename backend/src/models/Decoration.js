// backend/src/models/Decoration.js
import mongoose from "mongoose";

const decorationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    priceFrom: { type: String, required: true, trim: true, maxlength: 60 }, // e.g. "From LKR 150,000"
    tag: { type: String, default: "", trim: true, maxlength: 40 }, // e.g. "Best Seller"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Decoration = mongoose.model("Decoration", decorationSchema);
export default Decoration;
