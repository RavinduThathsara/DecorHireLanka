import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

import Customer from "../models/Customer.js";
import { generateToken } from "../utils/token.js";

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

function buildCustomerAuthPayload(customer) {
  return {
    id: customer._id,
    email: customer.email,
    username: customer.username,
    phone: customer.phone || "",
    location: customer.location || "",
  };
}

function buildAuthResponse(customer, message) {
  const token = generateToken({ id: customer._id, role: "customer" });

  return {
    message,
    token,
    customer: buildCustomerAuthPayload(customer),
  };
}

export const registerCustomer = async (req, res) => {
  try {
    const { email, username, phone, location, password } = req.body;

    if (!email || !username || !phone || !location || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await Customer.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      email: normalizedEmail,
      username,
      phone,
      location,
      passwordHash,
      authProvider: "local",
    });

    return res.status(201).json(buildAuthResponse(customer, "Registration successful."));
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

    if (!customer.passwordHash) {
      return res.status(400).json({ message: "This account uses Google sign-in. Continue with Google." });
    }

    const ok = await bcrypt.compare(password, customer.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json(buildAuthResponse(customer, "Login successful."));
  } catch (error) {
    console.error("loginCustomer error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

export const googleCustomerAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!googleClient) {
      return res.status(503).json({ message: "Google sign-in is not configured." });
    }

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.sub) {
      return res.status(400).json({ message: "Google account data is incomplete." });
    }

    const normalizedEmail = payload.email.toLowerCase();
    let customer = await Customer.findOne({
      $or: [{ googleId: payload.sub }, { email: normalizedEmail }],
    });

    if (!customer) {
      customer = await Customer.create({
        email: normalizedEmail,
        username: payload.name || normalizedEmail.split("@")[0],
        phone: "",
        location: "",
        passwordHash: "",
        googleId: payload.sub,
        authProvider: "google",
      });
    } else {
      let changed = false;

      if (!customer.googleId) {
        customer.googleId = payload.sub;
        changed = true;
      }

      if (!customer.authProvider || customer.authProvider !== "google") {
        customer.authProvider = customer.googleId ? "google" : customer.authProvider;
        changed = true;
      }

      if (!customer.username && payload.name) {
        customer.username = payload.name;
        changed = true;
      }

      if (changed) {
        await customer.save();
      }
    }

    return res.json(buildAuthResponse(customer, "Google sign-in successful."));
  } catch (error) {
    console.error("googleCustomerAuth error:", error.message);
    return res.status(401).json({ message: "Google authentication failed." });
  }
};
