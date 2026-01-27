// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/admin/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(res.data.messages || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate]);

  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <div style={topRow}>
        <div>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <p style={{ marginTop: 6, color: "#4b5563" }}>
            Welcome {admin?.email || "Admin"}
          </p>
        </div>

        <button style={btnDark} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Customer Contact Messages</h3>

        {loading && <p>Loading messages...</p>}
        {error && <div style={msgError}>{error}</div>}

        {!loading && !error && messages.length === 0 && (
          <p style={{ color: "#6b7280" }}>No messages yet.</p>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {messages.map((m) => (
            <div key={m._id} style={msgCard}>
              <div style={msgHeader}>
                <div style={{ fontWeight: 900, color: "#111827" }}>{m.name}</div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={row}>
                <span style={label}>Email:</span> {m.email}
              </div>
              {m.phone && (
                <div style={row}>
                  <span style={label}>Phone:</span> {m.phone}
                </div>
              )}
              {m.location && (
                <div style={row}>
                  <span style={label}>Location:</span> {m.location}
                </div>
              )}

              <div style={{ marginTop: 10, color: "#374151", lineHeight: 1.6 }}>
                {m.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 14,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const btnDark = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 900,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const msgCard = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 14,
  background: "#fafafa",
};

const msgHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "baseline",
};

const row = { marginTop: 6, color: "#374151" };
const label = { fontWeight: 900, color: "#111827" };

const msgError = {
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};
const btnLink = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
};

const box = {
  marginTop: 18,
  padding: 16,
  borderRadius: 14,
  border: "1px solid #eee",
  background: "white",
};

 /*
 <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
  <a href="/admin/decorations" style={btnLink}>Manage Decorations</a>
  <a href="/admin/gallery" style={btnLink}>Manage Gallery</a>
  <a href="/admin/bookings" style={btnLink}>View Bookings</a>
</div>

<div style={box}>
  <h3 style={{ marginTop: 0 }}>Admin Notes</h3>
  <ul>
    <li>Upload real gallery photos from “Manage Gallery”</li>
    <li>Add your packages from “Manage Decorations”</li>
    <li>Check bookings and update status</li>
  </ul>
</div>
*/