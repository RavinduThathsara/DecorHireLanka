// backend/src/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    decorationId: { type: mongoose.Schema.Types.ObjectId, ref: "Decoration", required: false },
    decorationTitle: { type: String, required: true, trim: true, maxlength: 120 },

    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true, maxlength: 30 },

    eventDate: { type: String, required: true, trim: true }, // keep string for simplicity
    eventLocation: { type: String, required: true, trim: true, maxlength: 160 },

    note: { type: String, default: "", trim: true, maxlength: 2000 },

    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
