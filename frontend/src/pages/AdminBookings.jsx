// frontend/src/pages/AdminBookings.jsx
import React from "react";
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

  const cleanPhone = (phone) => String(phone || "").replace(/\D/g, "");

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW": return { bg: "#dbeafe", text: "#1e3a8a", border: "#bfdbfe" }; // blue
      case "CONTACTED": return { bg: "#fef3c7", text: "#92400e", border: "#fde68a" }; // yellow
      case "CONFIRMED": return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" }; // green
      case "CANCELLED": return { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" }; // red
      default: return { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" }; // gray
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 20px" }}>
      <div style={topRow}>
        <div>
          <h1 style={{ margin: 0, color: "#111827", fontSize: "2rem" }}>Bookings Management</h1>
          <p style={{ marginTop: 8, color: "#4b5563", fontSize: "1.1rem" }}>
            Review customer booking requests, event details, and manage their status.
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <h2>Loading bookings...</h2>
        </div>
      )}

      {error && <div style={msgError}>{error}</div>}

      {!loading && bookings.length === 0 && (
        <div style={emptyState}>
          <h3 style={{ margin: 0, color: "#374151" }}>No bookings found</h3>
          <p style={{ color: "#6b7280", marginTop: 8 }}>There are currently no decoration booking requests.</p>
        </div>
      )}

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))" }}>
        {bookings.map((b) => {
          const sColor = getStatusColor(b.status || "NEW");

          return (
            <div key={b._id} style={card}>
              <div style={cardHeader}>
                <div>
                  <h3 style={decorTitle}>{b.decorationTitle}</h3>
                  <div style={dateText}>Requested: {new Date(b.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{
                  padding: "4px 10px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: "bold",
                  backgroundColor: sColor.bg,
                  color: sColor.text,
                  border: `1px solid ${sColor.border}`
                }}>
                  {b.status || "NEW"}
                </div>
              </div>

              <div style={cardBody}>
                <div style={infoSection}>
                  <h4 style={sectionHeading}>Customer Details</h4>
                  <div style={row}><span style={icon}>👤</span> <strong>{b.name}</strong></div>
                  <div style={row}><span style={icon}>📧</span> <a href={`mailto:${b.email}`} style={linkText}>{b.email}</a></div>
                  <div style={row}><span style={icon}>📞</span> <a href={`tel:${cleanPhone(b.phone)}`} style={linkText}>{b.phone}</a></div>
                </div>

                <div style={infoSection}>
                  <h4 style={sectionHeading}>Event Details</h4>
                  <div style={row}><span style={icon}>📅</span> <strong>{b.eventDate}</strong></div>
                  <div style={row}><span style={icon}>📍</span> {b.eventLocation}</div>
                </div>

                {b.note && (
                  <div style={noteSection}>
                    <strong>Notes/Requirements:</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: 13 }}>{b.note}</p>
                  </div>
                )}
              </div>

              <div style={cardFooter}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <a
                    href={`mailto:${b.email}?subject=DecorHire Lanka - Booking Update&body=Hi ${encodeURIComponent(b.name || "")},%0D%0A%0D%0A`}
                    style={actionBtnFill}
                  >
                    ✉️ Email
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhone(b.phone)}?text=${encodeURIComponent(`Hi ${b.name || ""}, regarding your decor booking...`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={actionBtnOutline}
                  >
                    💬 WhatsApp
                  </a>
                </div>

                <div style={statusUpdateWrapper}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6, display: "block" }}>
                    UPDATE STATUS:
                  </span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {statuses.map((s) => (
                      <button
                        key={s}
                        style={s === b.status ? activeStatusBtn : inactiveStatusBtn}
                        onClick={() => updateStatus(b._id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  alignItems: "center",
  marginBottom: 30,
  paddingBottom: 20,
  borderBottom: "1px solid #e5e7eb"
};

const emptyState = {
  padding: 40,
  textAlign: "center",
  background: "#f9fafb",
  borderRadius: 16,
  border: "1px dashed #d1d5db",
  marginTop: 20,
};

const card = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  overflow: "hidden"
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "16px 20px",
  backgroundColor: "#f9fafb",
  borderBottom: "1px solid #e5e7eb",
};

const decorTitle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 800,
  color: "#111827"
};

const dateText = {
  fontSize: 12,
  color: "#6b7280",
  marginTop: 4
};

const cardBody = {
  padding: "20px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 16
};

const infoSection = {
  display: "flex",
  flexDirection: "column",
  gap: 6
};

const sectionHeading = {
  margin: "0 0 4px 0",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  color: "#9ca3af",
  fontWeight: 700
};

const row = {
  display: "flex",
  alignItems: "center",
  color: "#374151",
  fontSize: 14
};

const icon = {
  marginRight: 8,
  fontSize: 14
};

const linkText = {
  color: "#2563eb",
  textDecoration: "none"
};

const noteSection = {
  marginTop: "auto",
  padding: 12,
  background: "#fefce8",
  borderLeft: "4px solid #facc15",
  borderRadius: "0 8px 8px 0",
  color: "#854d0e",
  fontSize: 14
};

const cardFooter = {
  padding: "16px 20px",
  borderTop: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
};

const actionBtnFill = {
  flex: 1,
  textAlign: "center",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 13,
  background: "#111827",
  color: "#ffffff",
  transition: "all 0.2s"
};

const actionBtnOutline = {
  flex: 1,
  textAlign: "center",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 13,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  color: "#374151",
  transition: "all 0.2s"
};

const statusUpdateWrapper = {
  background: "#f3f4f6",
  padding: 12,
  borderRadius: 8,
};

const activeStatusBtn = {
  flex: 1,
  padding: "6px 8px",
  borderRadius: 6,
  border: "none",
  fontSize: 11,
  fontWeight: 800,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const inactiveStatusBtn = {
  flex: 1,
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 11,
  fontWeight: 700,
  background: "#ffffff",
  color: "#4b5563",
  cursor: "pointer",
};

const btnLightLink = {
  textDecoration: "none",
  padding: "10px 16px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontWeight: 600,
  background: "#ffffff",
  color: "#111827",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
};

const msgError = {
  padding: 16,
  borderRadius: 8,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 600,
  marginBottom: 20
};

