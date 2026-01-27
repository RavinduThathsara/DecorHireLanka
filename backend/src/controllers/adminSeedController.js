// backend/src/controllers/adminSeedController.js
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const seedAdmin = async (req, res) => {
  try {
    const { seedKey, email, password } = req.body;

    if (!seedKey || !email || !password) {
      return res.status(400).json({ message: "seedKey, email, password required." });
    }

    if (seedKey !== process.env.ADMIN_SEED_KEY) {
      return res.status(403).json({ message: "Invalid seed key." });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email: email.toLowerCase(),
      passwordHash,
    });

    return res.status(201).json({
      message: "Admin created successfully.",
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("seedAdmin error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};
