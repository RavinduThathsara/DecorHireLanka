// frontend/src/pages/ContactUs.jsx
import React from "react";
import { useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";

export default function ContactUs() {
  const { addNotification } = useAuth();
  const shopAddress = "149, Kowil Kade, Passara, Sri Lanka";
  const mapSrc =
    "https://www.google.com/maps?q=149%2C%20Kowil%20Kade%2C%20Passara%2C%20Sri%20Lanka&z=17&output=embed";
  const mapLink =
    "https://www.google.com/maps/search/?api=1&query=149%2C%20Kowil%20Kade%2C%20Passara%2C%20Sri%20Lanka";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    eventType: "",
    eventDate: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // --- Validation Logic ---
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(form.name.trim())) {
      setError("Please enter a valid name (letters only, minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.phone.trim() !== "") {
      const phoneRegex = /^(?:\+94|0)[0-9]{9}$/; // e.g., 0771234567 or +94771234567
      if (!phoneRegex.test(form.phone.trim())) {
        setError("Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567).");
        return;
      }
    }
    // ------------------------

    try {
      setLoading(true);
      const res = await api.post("/api/contact", form);
      const msg = res.data?.message || "Message sent successfully ✅";
      setSuccess(msg);

      // Add notification
      addNotification({
        title: "Your message has been sent to our team.",
        subtitle: "We will get back to you with a response as soon as possible.",
        type: "MESSAGE"
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        eventType: "",
        eventDate: "",
        message: ""
      });

      Swal.fire({
        title: "Message Sent!",
        text: "Thank you for contacting us. We'll get back to you soon!",
        icon: "success",
        confirmButtonColor: "#9b5b34",
        timer: 3000,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send message.");
      Swal.fire({
        title: "Error!",
        text: err?.response?.data?.message || "Failed to send message.",
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={topBar}>
          <div style={{ textAlign: "center", padding: "40px 0 20px" }}>
            <h1 style={{
              margin: 0,
              fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "16px"
            }}>
              Contact Us
            </h1>
            <p style={{
              margin: "0 auto",
              color: "#6f645a",
              lineHeight: 1.7,
              fontSize: "1.1rem",
              maxWidth: "600px"
            }}>
              Send your event details, date, location, and theme idea. We'll contact you soon.
            </p>
          </div>
        </div>

        <div style={grid}>
          {/* Form */}
          <div style={card}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(155, 91, 52, 0.25)"
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3 style={{
                margin: 0,
                fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#1a1a1a"
              }}>
                Send a Message
              </h3>
            </div>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
              <input
                style={input}
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={onChange}
                required
              />

              <input
                style={input}
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                required
              />

              <input
                style={input}
                name="phone"
                placeholder="Phone / WhatsApp (optional)"
                value={form.phone}
                onChange={onChange}
              />

              <select
                style={input}
                name="eventType"
                value={form.eventType}
                onChange={onChange}
              >
                <option value="">Select Event Type (optional)</option>
                <option value="Wedding Decoration">Wedding Decoration</option>
                <option value="Birthday Decoration">Birthday Decoration</option>
                <option value="Other Event Decoration">Other Event Decoration</option>
              </select>

              <div style={{ display: "grid", gap: 8 }}>
                <label style={label}>Event Date (optional)</label>
                <input
                  style={input}
                  name="eventDate"
                  type="date"
                  min={today}
                  value={form.eventDate}
                  onChange={onChange}
                />
              </div>

              <input
                style={input}
                name="location"
                placeholder="Event Location (optional)"
                value={form.location}
                onChange={onChange}
              />

              <textarea
                style={textarea}
                name="message"
                placeholder="Message (ex: Hall name, theme colors, special requirements...)"
                value={form.message}
                onChange={onChange}
                required
                rows={6}
              />

              <button style={btnDark} disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>

              {error && <div style={msgError}>{error}</div>}
              {success && <div style={msgOk}>{success}</div>}
            </form>
          </div>

          {/* Info */}
          <div style={card}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #d4af7a 0%, #9b5b34 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(212, 175, 122, 0.3)"
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 style={{
                margin: 0,
                fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#1a1a1a"
              }}>
                Business Details
              </h3>
            </div>

            <div style={{ display: "grid", gap: 16, marginBottom: "28px" }}>
              <div style={infoItem}>
                <div style={infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <div style={infoLabel}>Business Name</div>
                  <div style={infoValue}>Sri Lankan Wedding Decoration</div>
                </div>
              </div>

              <div style={infoItem}>
                <div style={infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <div style={infoLabel}>Phone</div>
                  <div style={infoValue}>+94 713187790</div>
                </div>
              </div>

              <div style={infoItem}>
                <div style={infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <div style={infoLabel}>WhatsApp</div>
                  <div style={infoValue}>+94 713187790</div>
                </div>
              </div>

              <div style={infoItem}>
                <div style={infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <div style={infoLabel}>Email</div>
                  <div style={infoValue}>ravinduthathsara38@gmail.com</div>
                </div>
              </div>

              <div style={infoItem}>
                <div style={infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <div style={infoLabel}>Location</div>
                  <div style={infoValue}>{shopAddress}</div>
                </div>
              </div>
            </div>

            <div style={mapBox}>
              <iframe
                title="DecorHire Lanka shop location"
                src={mapSrc}
                style={mapFrame}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a href={mapLink} target="_blank" rel="noreferrer" style={mapLinkStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px" }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const topBar = {
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
  gap: 24,
  marginTop: 20,
};

const card = {
  border: "none",
  borderRadius: 24,
  padding: 32,
  background: "#fff",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
};

const input = {
  padding: "16px 20px",
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  outline: "none",
  fontSize: 15,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontWeight: 500,
  color: "#1a1a1a",
  backgroundColor: "#fff",
  transition: "all 0.3s ease",
};

const label = {
  fontSize: 14,
  fontWeight: 700,
  color: "#4a443f",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const textarea = {
  padding: "16px 20px",
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  outline: "none",
  fontSize: 15,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontWeight: 500,
  color: "#1a1a1a",
  backgroundColor: "#fff",
  resize: "vertical",
  transition: "all 0.3s ease",
};

const btnDark = {
  padding: "16px 24px",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  fontSize: "16px",
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  color: "white",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(155, 91, 52, 0.3)",
};

const msgError = {
  padding: 16,
  borderRadius: 12,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 600,
  border: "2px solid #fecaca",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const msgOk = {
  padding: 16,
  borderRadius: 12,
  background: "#d1fae5",
  color: "#065f46",
  fontWeight: 600,
  border: "2px solid #6ee7b7",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const infoItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  padding: "16px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #fdf8f0 0%, #fff 100%)",
  border: "1px solid rgba(155, 91, 52, 0.1)",
};

const infoIcon = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #9b5b34 0%, #d4af7a 100%)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const infoLabel = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#9b5b34",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "4px",
};

const infoValue = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#1a1a1a",
  lineHeight: "1.5",
};

const mapBox = {
  marginTop: 0,
  borderRadius: 16,
  overflow: "hidden",
  border: "2px solid rgba(155, 91, 52, 0.15)",
  background: "#f8fafc",
  minHeight: 280,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
};

const mapFrame = {
  width: "100%",
  height: 260,
  border: "none",
};

const mapLinkStyle = {
  textDecoration: "none",
  padding: "16px 20px",
  fontWeight: 700,
  fontSize: "15px",
  color: "#fff",
  borderTop: "none",
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
