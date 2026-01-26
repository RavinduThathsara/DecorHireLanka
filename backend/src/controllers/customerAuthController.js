// backend/src/controllers/customerAuthController.js
import bcrypt from "bcrypt";
import Customer from "../models/Customer.js";
import { generateToken } from "../utils/token.js";

export const registerCustomer = async (req, res) => {
  try {
    const { email, username, location, password } = req.body;

    if (!email || !username || !location || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      email: email.toLowerCase(),
      username,
      location,
      passwordHash,
    });

    const token = generateToken({ id: customer._id, role: "customer" });

    return res.status(201).json({
      message: "Registration successful.",
      token,
      customer: {
        id: customer._id,
        email: customer.email,
        username: customer.username,
        location: customer.location,
      },
    });
  } catch (error) {
    console.error("registerCustomer error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const ok = await bcrypt.compare(password, customer.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken({ id: customer._id, role: "customer" });

    return res.json({
      message: "Login successful.",
      token,
      customer: {
        id: customer._id,
        email: customer.email,
        username: customer.username,
        location: customer.location,
      },
    });
  } catch (error) {
    console.error("loginCustomer error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};
