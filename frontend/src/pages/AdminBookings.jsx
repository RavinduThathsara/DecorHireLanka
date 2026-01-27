// frontend/src/pages/AdminBookings.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

const statuses = ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED"];

export default function AdminBookings() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const authHeader = { Authorization: `Bearer ${token}` };

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/bookings/admin/all", { headers: authHeader });
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setError("");
    try {
      await api.put(
        `/api/bookings/admin/${id}/status`,
        { status },
        { headers: authHeader }
      );
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Status update failed.");
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <div style={topRow}>
        <div>
          <h1 style={{ margin: 0 }}>Bookings</h1>
          <p style={{ marginTop: 6, color: "#4b5563" }}>
            Customer booking requests and their status.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/dashboard" style={btnLightLink}>Dashboard</Link>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div style={msgError}>{error}</div>}

      {!loading && bookings.length === 0 && (
        <p style={{ color: "#6b7280" }}>No bookings yet.</p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {bookings.map((b) => (
          <div key={b._id} style={card}>
            <div style={headerRow}>
              <div style={{ fontWeight: 900, color: "#111827" }}>
                {b.decorationTitle}
              </div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>
                {new Date(b.createdAt).toLocaleString()}
              </div>
            </div>

            <div style={row}><span style={label}>Name:</span> {b.name}</div>
            <div style={row}><span style={label}>Email:</span> {b.email}</div>
            <div style={row}><span style={label}>Phone:</span> {b.phone}</div>
            <div style={row}><span style={label}>Date:</span> {b.eventDate}</div>
            <div style={row}><span style={label}>Location:</span> {b.eventLocation}</div>

            {b.note && (
              <div style={{ marginTop: 10, color: "#374151", lineHeight: 1.6 }}>
                {b.note}
              </div>
            )}

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 900 }}>Status:</span>
              {statuses.map((s) => (
                <button
                  key={s}
                  style={s === b.status ? btnDark : btnLight}
                  onClick={() => updateStatus(b._id, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "flex-end",
  marginBottom: 14,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "baseline",
};

const row = { marginTop: 6, color: "#374151" };
const label = { fontWeight: 900, color: "#111827" };

const btnDark = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "none",
  fontWeight: 900,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const btnLight = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
};

const btnLightLink = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
};

const msgError = {
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};
