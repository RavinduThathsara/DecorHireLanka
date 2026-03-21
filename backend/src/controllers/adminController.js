import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const signAdminToken = (adminOrEmail) => {
  if (typeof adminOrEmail === "string") {
    return jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  }
  return jwt.sign(
    { id: adminOrEmail._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// CREATE ADMIN (run once)
export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalized = email.toLowerCase().trim();
    const exists = await Admin.findOne({ email: normalized });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email: normalized, passwordHash });

    return res.json({
      message: "Admin created",
      admin: { id: admin._id, email: admin.email },
    });
  } catch (err) {
    console.error("createAdmin error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// LOGIN ADMIN — env credentials (if set) OR MongoDB admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error("loginAdmin: JWT_SECRET is not set in .env");
      return res.status(500).json({ message: "Server misconfiguration (JWT_SECRET)." });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const envEmail = process.env.ADMIN_EMAIL?.trim();
    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    const emailNorm = email.trim().toLowerCase();
    if (
      envEmail &&
      envPassword &&
      emailNorm === envEmail.toLowerCase() &&
      password === envPassword
    ) {
      const token = signAdminToken(envEmail);
      return res.json({
        message: "Admin login successful.",
        token,
        admin: { email: envEmail },
      });
    }

    const admin = await Admin.findOne({ email: emailNorm });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    if (!admin.passwordHash) {
      return res.status(401).json({
        message:
          "This admin account is invalid (missing password). Create a new admin via POST /api/admin/seed or /api/admin/create.",
      });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = signAdminToken(admin);
    return res.json({
      message: "Admin login successful.",
      token,
      admin: { email: admin.email },
    });
  } catch (err) {
    console.error("loginAdmin error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};
