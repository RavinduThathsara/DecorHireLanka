// frontend/src/pages/ContactUs.jsx
import React from "react";
import { useState } from "react";
import { api } from "../services/api.js";

export default function ContactUs() {
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
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const res = await api.post("/api/contact", form);
      setSuccess(res.data?.message || "Message sent successfully ✅");
      setForm({ name: "", email: "", phone: "", location: "", message: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={topBar}>
        <div>
          <h1 style={{ margin: 0 }}>Contact Us</h1>
          <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.6 }}>
            Send your wedding date, location, and theme idea. We’ll contact you soon.
          </p>
        </div>
      </div>

      <div style={grid}>
        {/* Form */}
        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Send a Message</h3>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
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

            <input
              style={input}
              name="location"
              placeholder="Wedding Location (optional)"
              value={form.location}
              onChange={onChange}
            />

            <textarea
              style={textarea}
              name="message"
              placeholder="Message (ex: Wedding date, hall name, theme colors...)"
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
          <h3 style={{ marginTop: 0 }}>Business Details</h3>

          <div style={{ display: "grid", gap: 10, color: "#374151" }}>
            <div>
              <strong>Business Name:</strong> Sri Lankan Wedding Decoration
            </div>
            <div>
              <strong>Phone:</strong> +94 3187790
            </div>
            <div>
              <strong>WhatsApp:</strong> +94 3187790
            </div>
            <div>
              <strong>Email:</strong> ravinduthathsara38@gmail.com
            </div>
            <div>
              <strong>Location:</strong> {shopAddress}
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
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const topBar = {
  marginBottom: 14,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 12,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const input = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};

const textarea = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
  resize: "vertical",
};

const btnDark = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 900,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const msgError = {
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};

const msgOk = {
  padding: 12,
  borderRadius: 10,
  background: "#dcfce7",
  color: "#166534",
  fontWeight: 700,
};

const mapBox = {
  marginTop: 14,
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid #d1d5db",
  background: "#f8fafc",
  minHeight: 260,
  display: "flex",
  flexDirection: "column",
};

const mapFrame = {
  width: "100%",
  height: 220,
  border: "none",
};

const mapLinkStyle = {
  textDecoration: "none",
  padding: "12px 14px",
  fontWeight: 800,
  color: "#111827",
  borderTop: "1px solid #e5e7eb",
  background: "white",
};
