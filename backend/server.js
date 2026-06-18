import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./src/config/db.js";

import customerAuthRoutes from "./src/routes/customerAuthRoutes.js";
import adminSeedRoutes from "./src/routes/adminSeedRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import adminMessagesRoutes from "./src/routes/adminMessagesRoutes.js";
import decorationRoutes from "./src/routes/decorationRoutes.js";
import galleryRoutes from "./src/routes/galleryRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

import { requireAuth, requireAdmin } from "./src/middleware/auth.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "uploads");

fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/customers", customerAuthRoutes);
app.use("/api/admin", adminSeedRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminMessagesRoutes);
app.use("/api/decorations", decorationRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Root test
app.get("/", (req, res) => {
  res.json({ message: "Wedding Decorator API is running ✅" });
});

// Protected test route
app.get("/api/admin/protected", requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "Admin protected route works ✅", user: req.user });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // this should log MongoDB Connected ✅ inside db.js
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  }
};

startServer();
