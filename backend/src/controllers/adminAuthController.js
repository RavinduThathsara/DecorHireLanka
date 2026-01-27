// backend/src/controllers/adminAuthController.js
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/token.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken({ id: admin._id, role: "admin" });

    return res.json({
      message: "Admin login successful.",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("loginAdmin error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};
