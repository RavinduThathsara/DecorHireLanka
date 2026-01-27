// frontend/src/pages/BookDecoration.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function BookDecoration() {
  const navigate = useNavigate();
  const q = useQuery();
  const { customer } = useAuth();

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
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Book Decoration</h1>
      <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
        Send your wedding details. We will contact you and confirm the package.
      </p>

      <div style={card}>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            style={input}
            name="decorationTitle"
            placeholder="Decoration Title"
            value={form.decorationTitle}
            onChange={onChange}
            required
          />

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
            placeholder="Phone / WhatsApp"
            value={form.phone}
            onChange={onChange}
            required
          />

          <input
            style={input}
            name="eventDate"
            type="date"
            value={form.eventDate}
            onChange={onChange}
            required
            />


          <input
            style={input}
            name="eventLocation"
            placeholder="Event Location (Hall / City)"
            value={form.eventLocation}
            onChange={onChange}
            required
          />

          <textarea
            style={textarea}
            name="note"
            placeholder="Note (theme colors, hall size, guests, etc.)"
            value={form.note}
            onChange={onChange}
            rows={5}
          />

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
