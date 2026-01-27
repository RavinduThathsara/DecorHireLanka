// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";

import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminSeedRoutes from "./routes/adminSeedRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminMessagesRoutes from "./routes/adminMessagesRoutes.js";
import decorationRoutes from "./routes/decorationRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

import { requireAuth, requireAdmin } from "./middleware/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/customers", customerAuthRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminSeedRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminMessagesRoutes);
app.use("/api/decorations", decorationRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/bookings", bookingRoutes);

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
