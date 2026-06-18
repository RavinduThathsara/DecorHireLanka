// frontend/src/pages/BookDecoration.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import heroImage from "../assets/images/hero3.png";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function BookDecoration() {
  const navigate = useNavigate();
  const q = useQuery();
  const { customer, addNotification } = useAuth();

  const decorationId = q.get("id") || "";
  const decorationTitleFromUrl = q.get("title") || "";

  const [form, setForm] = useState({
    decorationId,
    decorationTitle: decorationTitleFromUrl,
    name: customer?.username || "",
    email: customer?.email || "",
    phone: "",
    eventDate: "",
    eventLocation: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const decorationOptions = useMemo(() => {
    const options = [
      decorationTitleFromUrl,
      "Wedding Decoration",
      "Birthday Decoration",
      "Other Event Decoration",
    ].filter(Boolean);

    return [...new Set(options)];
  }, [decorationTitleFromUrl]);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const res = await api.post("/api/bookings", form);
      setSuccess(res.data?.message || "Booking sent ✅");

      // Add a notification
      addNotification({
        title: `Your ${form.decorationTitle} booking has been received.`,
        subtitle: "We will review your booking and get back to you shortly.",
        type: "BOOKING"
      });

      setTimeout(() => navigate("/profile"), 1000); // Navigate to profile to see the item
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px 24px" }}>
      <section style={heroSection}>
        <div style={heroOverlay}>
          <div style={heroContent}>
            <h1 style={heroTitle}>Book Your Event</h1>
            <p style={heroLead}>
              Step into a world of curated elegance. From intimate soirees to grand matrimonial
              celebrations, we bring your vision to life with artisanal precision and Sri Lankan
              heritage.
            </p>
          </div>
        </div>
      </section>

      <div style={card}>
        <div style={formIntro}>
          <h2 style={formTitle}>Booking Details</h2>
          <p style={formLead}>
            Share your event requirements and we will prepare the right decoration plan for you.
          </p>
        </div>

        <form onSubmit={onSubmit} style={formGrid}>
          <div style={fieldBlockWide}>
            <label htmlFor="decorationTitle" style={label}>
              Event Type
            </label>
            <select
              id="decorationTitle"
              style={select}
              name="decorationTitle"
              value={form.decorationTitle}
              onChange={onChange}
              required
            >
              <option value="" disabled>
                Select your event type
              </option>
              {decorationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldBlock}>
            <label htmlFor="name" style={label}>
              Full Name
            </label>
            <input
              id="name"
              style={input}
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div style={fieldBlock}>
            <label htmlFor="email" style={label}>
              Email Address
            </label>
            <input
              id="email"
              style={input}
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div style={fieldBlock}>
            <label htmlFor="phone" style={label}>
              Phone / WhatsApp
            </label>
            <input
              id="phone"
              style={input}
              name="phone"
              placeholder="Enter your contact number"
              value={form.phone}
              onChange={onChange}
              required
            />
          </div>

          <div style={fieldBlock}>
            <label htmlFor="eventDate" style={label}>
              Event Date
            </label>
            <input
              id="eventDate"
              style={input}
              name="eventDate"
              type="date"
              value={form.eventDate}
              onChange={onChange}
              required
            />
          </div>

          <div style={fieldBlockWide}>
            <label htmlFor="eventLocation" style={label}>
              Event Location
            </label>
            <input
              id="eventLocation"
              style={input}
              name="eventLocation"
              placeholder="Hall, city, or venue name"
              value={form.eventLocation}
              onChange={onChange}
              required
            />
          </div>

          <div style={fieldBlockWide}>
            <label htmlFor="note" style={label}>
              Extra Notes
            </label>
            <textarea
              id="note"
              style={textarea}
              name="note"
              placeholder="Theme colors, guest count, stage setup, hall size, or any special requests"
              value={form.note}
              onChange={onChange}
              rows={5}
            />
          </div>

          <button style={btnDark} disabled={loading}>
            {loading ? "Sending..." : "Send Booking Request"}
          </button>

          {error && <div style={msgError}>{error}</div>}
          {success && <div style={msgOk}>{success}</div>}
        </form>
      </div>
    </div>
  );
}

const heroSection = {
  marginBottom: 18,
  minHeight: 300,
  borderRadius: 0,
  overflow: "hidden",
  width: "100vw",
  marginLeft: "calc(50% - 50vw)",
  marginRight: "calc(50% - 50vw)",
  backgroundImage: `linear-gradient(180deg, rgba(16, 11, 8, 0.48), rgba(16, 11, 8, 0.74)), url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 18px 42px rgba(52, 30, 17, 0.14)",
};

const heroOverlay = {
  minHeight: 300,
  display: "grid",
  placeItems: "center",
  padding: "38px 24px",
  background:
    "linear-gradient(180deg, rgba(15, 10, 7, 0.1) 0%, rgba(15, 10, 7, 0.38) 100%)",
};

const heroContent = {
  width: "min(100%, 620px)",
  textAlign: "center",
};

const heroTitle = {
  margin: 0,
  color: "#f6d46d",
  fontSize: "clamp(2.2rem, 4vw, 3.25rem)",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const heroLead = {
  margin: "14px 0 0",
  color: "rgba(252, 244, 231, 0.92)",
  fontSize: "1rem",
  lineHeight: 1.75,
};

const card = {
  border: "1px solid rgba(164, 124, 80, 0.14)",
  borderRadius: 22,
  padding: 24,
  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(252, 247, 241, 0.98))",
  boxShadow: "0 20px 46px rgba(76, 46, 24, 0.08)",
};

const formIntro = {
  marginBottom: 18,
};

const formTitle = {
  margin: 0,
  fontSize: "1.35rem",
  color: "#1f2937",
  fontWeight: 800,
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const formLead = {
  margin: "8px 0 0",
  color: "#6b7280",
  lineHeight: 1.6,
  fontSize: 14,
};

const formGrid = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};

const fieldBlock = {
  display: "grid",
  gap: 8,
};

const fieldBlockWide = {
  display: "grid",
  gap: 8,
  gridColumn: "1 / -1",
};

const label = {
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#8b5b33",
};

const input = {
  minHeight: 54,
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d9d2c8",
  outline: "none",
  fontSize: 14,
  color: "#1f2937",
  background: "#fffdfb",
  boxShadow: "inset 0 1px 2px rgba(31, 26, 23, 0.03)",
};

const select = {
  ...input,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  cursor: "pointer",
};

const textarea = {
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d9d2c8",
  outline: "none",
  fontSize: 14,
  color: "#1f2937",
  background: "#fffdfb",
  boxShadow: "inset 0 1px 2px rgba(31, 26, 23, 0.03)",
  resize: "vertical",
};

const btnDark = {
  gridColumn: "1 / -1",
  minHeight: 56,
  padding: "14px 16px",
  borderRadius: 14,
  border: "none",
  fontWeight: 900,
  fontSize: 15,
  letterSpacing: "0.03em",
  background: "linear-gradient(135deg, #9b5b34 0%, #7c4420 100%)",
  color: "white",
  cursor: "pointer",
  boxShadow: "0 16px 28px rgba(124, 68, 32, 0.22)",
};

const msgError = {
  gridColumn: "1 / -1",
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};

const msgOk = {
  gridColumn: "1 / -1",
  padding: 12,
  borderRadius: 10,
  background: "#dcfce7",
  color: "#166534",
  fontWeight: 700,
};
