// backend/src/models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    passwordHash: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: "",
      trim: true,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      default: "local",
      enum: ["local", "google"],
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
