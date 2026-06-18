// backend/src/controllers/bookingController.js
import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const {
      decorationId,
      decorationTitle,
      name,
      email,
      phone,
      eventDate,
      eventLocation,
      note,
    } = req.body;

    if (!decorationTitle || !name || !email || !phone || !eventDate || !eventLocation) {
      return res.status(400).json({
        message:
          "decorationTitle, name, email, phone, eventDate, eventLocation are required.",
      });
    }

    const booking = await Booking.create({
      decorationId: decorationId || undefined,
      decorationTitle,
      name,
      email: email.toLowerCase(),
      phone,
      eventDate,
      eventLocation,
      note: note || "",
    });

    return res.status(201).json({
      message: "Booking request sent ✅ We will contact you soon.",
      bookingId: booking._id,
    });
  } catch (e) {
    console.error("createBooking:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

export const adminGetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json({ bookings });
  } catch (e) {
    console.error("adminGetAllBookings:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

export const adminUpdateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    booking.status = status;
    await booking.save();

    return res.json({ message: "Booking updated ✅", booking });
  } catch (e) {
    console.error("adminUpdateBookingStatus:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// CUSTOMER: get their own bookings by email
export const customerGetMyBookings = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const bookings = await Booking.find({ email: email.toLowerCase() }).sort({
      createdAt: -1,
    });

    return res.json({ bookings });
  } catch (e) {
    console.error("customerGetMyBookings:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

export const customerUpdateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventDate, eventLocation, note } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    if (eventDate) booking.eventDate = eventDate;
    if (eventLocation) booking.eventLocation = eventLocation;
    if (note !== undefined) booking.note = note;

    await booking.save();
    return res.json({ message: "Booking updated ✅", booking });
  } catch (e) {
    console.error("customerUpdateBooking:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

export const customerDeleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    return res.json({ message: "Booking deleted ✅" });
  } catch (e) {
    console.error("customerDeleteBooking:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};
