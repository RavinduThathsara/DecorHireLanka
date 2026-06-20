// frontend/src/pages/BookDecoration.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import heroImage from "../assets/images/hero3.png";
import Swal from "sweetalert2";

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

      Swal.fire({
        title: "Booking Submitted!",
        text: "Thank you for your booking. We'll review and contact you shortly!",
        icon: "success",
        confirmButtonColor: "#9b5b34",
        timer: 3000,
      });

      setTimeout(() => navigate("/profile"), 1000); // Navigate to profile to see the item
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed.");
      Swal.fire({
        title: "Booking Failed!",
        text: err?.response?.data?.message || "Booking failed.",
        icon: "error",
        confirmButtonColor: "#9b5b34",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      background: "linear-gradient(135deg, #fdf8f0 0%, #f9f2e8 100%)",
      minHeight: "100vh",
      paddingBottom: "60px"
    }}>
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
          {/* Decorative Top Element */}
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, rgba(155, 91, 52, 0.05) 0%, transparent 100%)",
            borderRadius: "0 0 0 200px",
            pointerEvents: "none"
          }}></div>

          <div style={formIntro}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(155, 91, 52, 0.3)"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div>
                <h2 style={formTitle}>Booking Details</h2>
                <p style={formLead}>
                  Share your event requirements and we will prepare the right decoration plan for you.
                </p>
              </div>
            </div>
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

            {error && <div style={msgError}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>}
            {success && <div style={msgOk}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              {success}
            </div>}
          </form>
        </div>
      </div>
    </div>
  );
}

const heroSection = {
  marginBottom: 32,
  minHeight: 380,
  borderRadius: 0,
  overflow: "hidden",
  width: "100vw",
  marginLeft: "calc(50% - 50vw)",
  marginRight: "calc(50% - 50vw)",
  backgroundImage: `linear-gradient(135deg, rgba(26, 18, 11, 0.75), rgba(59, 39, 25, 0.65)), url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
  position: "relative",
};

const heroOverlay = {
  minHeight: 380,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 24px",
  background: "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)",
};

const heroContent = {
  width: "min(100%, 720px)",
  textAlign: "center",
};

const heroTitle = {
  margin: "0 0 20px",
  color: "#f6d46d",
  fontSize: "clamp(2.8rem, 5vw, 4rem)",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
  textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const heroLead = {
  margin: "0 auto",
  color: "rgba(255, 255, 255, 0.95)",
  fontSize: "1.15rem",
  lineHeight: 1.8,
  fontWeight: 400,
  maxWidth: "600px",
};

const card = {
  border: "none",
  borderRadius: 28,
  padding: 48,
  background: "#ffffff",
  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.12)",
  position: "relative",
  overflow: "hidden",
};

const formIntro = {
  marginBottom: 36,
  paddingBottom: 28,
  borderBottom: "2px solid rgba(155, 91, 52, 0.1)",
  position: "relative",
};

const formTitle = {
  margin: 0,
  fontSize: "2.25rem",
  color: "#1a1a1a",
  fontWeight: 800,
  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
  marginBottom: "12px",
};

const formLead = {
  margin: "0",
  color: "#6f645a",
  lineHeight: 1.7,
  fontSize: "1.05rem",
  fontWeight: 400,
};

const formGrid = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const fieldBlock = {
  display: "grid",
  gap: 10,
};

const fieldBlockWide = {
  display: "grid",
  gap: 10,
  gridColumn: "1 / -1",
};

const label = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  color: "#9b5b34",
  marginBottom: "4px",
};

const input = {
  minHeight: 58,
  padding: "18px 20px",
  borderRadius: 14,
  border: "2px solid #e5e7eb",
  outline: "none",
  fontSize: 15,
  color: "#1a1a1a",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
  transition: "all 0.3s ease",
  fontWeight: 500,
};

const select = {
  ...input,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  cursor: "pointer",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239b5b34' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: "48px",
};

const textarea = {
  padding: "18px 20px",
  borderRadius: 14,
  border: "2px solid #e5e7eb",
  outline: "none",
  fontSize: 15,
  color: "#1a1a1a",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
  resize: "vertical",
  transition: "all 0.3s ease",
  fontWeight: 500,
  lineHeight: 1.6,
};

const btnDark = {
  gridColumn: "1 / -1",
  minHeight: 62,
  padding: "18px 32px",
  borderRadius: 14,
  border: "none",
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: "0.5px",
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  color: "white",
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(155, 91, 52, 0.35)",
  transition: "all 0.3s ease",
  textTransform: "uppercase",
};

const msgError = {
  gridColumn: "1 / -1",
  padding: 18,
  borderRadius: 14,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 600,
  border: "2px solid #fecaca",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
};

const msgOk = {
  gridColumn: "1 / -1",
  padding: 18,
  borderRadius: 14,
  background: "#d1fae5",
  color: "#065f46",
  fontWeight: 600,
  border: "2px solid #6ee7b7",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
};
