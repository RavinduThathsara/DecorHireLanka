// backend/src/routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  adminGetAllBookings,
  adminUpdateBookingStatus,
  customerGetMyBookings,
  customerUpdateBooking,
  customerDeleteBooking,
} from "../controllers/bookingController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: customer can book (no login required)
router.post("/", createBooking);

// Customer: get their own bookings
router.get("/customer/my-bookings", customerGetMyBookings);
router.put("/customer/:id", customerUpdateBooking);
router.delete("/customer/:id", customerDeleteBooking);

// Admin: view + update status
router.get("/admin/all", requireAuth, requireAdmin, adminGetAllBookings);
router.put("/admin/:id/status", requireAuth, requireAdmin, adminUpdateBookingStatus);

export default router;
