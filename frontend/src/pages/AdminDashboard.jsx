import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const authHeader = { Authorization: `Bearer ${token}` };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [bRes, mRes] = await Promise.all([
        api.get("/api/bookings/admin/all", { headers: authHeader }),
        api.get("/api/contact/admin/all", { headers: authHeader }),
      ]);

      setBookings(bRes.data.bookings || []);
      setMessages(mRes.data.messages || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const totalBookings = bookings.length;
  const newBookings = bookings.filter((b) => (b.status || "NEW") === "NEW").length;

  const totalMessages = messages.length;
  const newMessages = messages.filter((m) => (m.status || "NEW") === "NEW").length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <div style={topRow}>
        <div>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <p style={{ marginTop: 6, color: "#4b5563" }}>
            Manage bookings, contacts, gallery, and decorations.
          </p>
        </div>

        <button
          type="button"
          style={btnLight}
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
          }}
        >
          Logout
        </button>
      </div>

      {loading && <p>Loading dashboard...</p>}
      {error && <div style={msgError}>{error}</div>}

      {!loading && !error && (
        <>
          {/* Stats */}
          <div style={grid4}>
            <div style={statCard}>
              <div style={statNum}>{totalBookings}</div>
              <div style={statLabel}>Total Bookings</div>
            </div>

            <div style={statCard}>
              <div style={statNum}>{newBookings}</div>
              <div style={statLabel}>New Bookings</div>
            </div>

            <div style={statCard}>
              <div style={statNum}>{totalMessages}</div>
              <div style={statLabel}>Total Messages</div>
            </div>

            <div style={statCard}>
              <div style={statNum}>{newMessages}</div>
              <div style={statLabel}>New Messages</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" style={btnDark} onClick={() => navigate("/admin/bookings")}>
              View Bookings
            </button>
            <button type="button" style={btnDark} onClick={() => navigate("/admin/contacts")}>
              View Messages
            </button>
            <button type="button" style={btnLight} onClick={() => navigate("/admin/gallery")}>
              Manage Gallery
            </button>
            <button type="button" style={btnLight} onClick={() => navigate("/admin/decorations")}>
              Manage Decorations
            </button>
          </div>

          {/* Recent Items */}
          <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
            <div style={panel}>
              <div style={panelHeader}>
                <div style={panelTitle}>Recent Bookings</div>
                <button type="button" style={btnLightSmall} onClick={() => navigate("/admin/bookings")}>
                  Open
                </button>
              </div>

              {bookings.slice(0, 3).map((b) => (
                <div key={b._id} style={miniRow}>
                  <div style={{ fontWeight: 900 }}>{b.decorationTitle}</div>
                  <div style={miniMeta}>
                    {b.name} • {b.phone} • {(b.status || "NEW")}
                  </div>
                </div>
              ))}

              {bookings.length === 0 && <div style={{ color: "#6b7280" }}>No bookings yet.</div>}
            </div>

            <div style={panel}>
              <div style={panelHeader}>
                <div style={panelTitle}>Recent Messages</div>
                <button type="button" style={btnLightSmall} onClick={() => navigate("/admin/contacts")}>
                  Open
                </button>
              </div>

              {messages.slice(0, 3).map((m) => (
                <div key={m._id} style={miniRow}>
                  <div style={{ fontWeight: 900 }}>{m.name}</div>
                  <div style={miniMeta}>
                    {m.email} • {(m.status || "NEW")}
                  </div>
                </div>
              ))}

              {messages.length === 0 && <div style={{ color: "#6b7280" }}>No messages yet.</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Styles */
const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "flex-end",
  marginBottom: 14,
};

const grid4 = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const statCard = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const statNum = { fontSize: 26, fontWeight: 900, color: "#111827" };
const statLabel = { marginTop: 6, color: "#6b7280", fontWeight: 800 };

const panel = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const panelHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

const panelTitle = { fontWeight: 900, color: "#111827" };

const miniRow = {
  padding: "10px 0",
  borderTop: "1px solid #f1f5f9",
};

const miniMeta = { marginTop: 4, color: "#6b7280", fontSize: 13 };

const btnDark = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 900,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const btnLight = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
};

const btnLightSmall = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
};

const msgError = {
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};
