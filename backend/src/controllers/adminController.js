import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// CREATE ADMIN (run once)
export const createAdmin = async (req, res) => {
  const { email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email, password: hashed });

  res.json({ message: "Admin created", admin });
};

// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};
