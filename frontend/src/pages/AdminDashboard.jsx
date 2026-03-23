import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
    <div style={pageContainer}>
      <header style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Dashboard</h1>
          <p style={pageLead}>
            Overview of bookings and contact messages. Use the sidebar or the shortcuts below to
            manage content.
          </p>
        </div>
      </header>

      {loading && <p style={mutedText}>Loading dashboard…</p>}
      {error && <div style={alertError}>{error}</div>}

      {!loading && !error && (
        <>
          {/* Stats Grid */}
          <section style={statsGrid}>
            <div style={statCard}>
              <div style={statIcon}>📦</div>
              <div style={statContent}>
                <div style={statValue}>{totalBookings}</div>
                <div style={statLabel}>Total Bookings</div>
              </div>
            </div>

            <div style={{ ...statCard, ...statCardNew }}>
              <div style={statIcon}>🆕</div>
              <div style={statContent}>
                <div style={statValue}>{newBookings}</div>
                <div style={statLabel}>New Bookings</div>
              </div>
            </div>

            <div style={statCard}>
              <div style={statIcon}>💬</div>
              <div style={statContent}>
                <div style={statValue}>{totalMessages}</div>
                <div style={statLabel}>Total Messages</div>
              </div>
            </div>

            <div style={{ ...statCard, ...statCardNew }}>
              <div style={statIcon}>✉️</div>
              <div style={statContent}>
                <div style={statValue}>{newMessages}</div>
                <div style={statLabel}>New Messages</div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section style={quickSection}>
            <h2 style={sectionTitle}>Quick Actions</h2>
            <div style={quickGrid}>
              <NavLink
                to="/admin/bookings"
                style={({ isActive }) => ({
                  ...quickCard,
                  ...(isActive ? quickCardActive : {}),
                })}
              >
                <div style={quickIcon}>📋</div>
                <div style={quickContent}>
                  <span style={quickTitle}>Bookings</span>
                  <span style={quickDesc}>View and update booking status</span>
                </div>
                <span style={quickArrow}>→</span>
              </NavLink>

              <NavLink
                to="/admin/contacts"
                style={({ isActive }) => ({
                  ...quickCard,
                  ...(isActive ? quickCardActive : {}),
                })}
              >
                <div style={quickIcon}>📨</div>
                <div style={quickContent}>
                  <span style={quickTitle}>Messages</span>
                  <span style={quickDesc}>Contact form submissions</span>
                </div>
                <span style={quickArrow}>→</span>
              </NavLink>

              <NavLink
                to="/admin/gallery"
                style={({ isActive }) => ({
                  ...quickCard,
                  ...(isActive ? quickCardActive : {}),
                })}
              >
                <div style={quickIcon}>🖼️</div>
                <div style={quickContent}>
                  <span style={quickTitle}>Gallery</span>
                  <span style={quickDesc}>Upload and manage gallery images</span>
                </div>
                <span style={quickArrow}>→</span>
              </NavLink>

              <NavLink
                to="/admin/decorations"
                style={({ isActive }) => ({
                  ...quickCard,
                  ...(isActive ? quickCardActive : {}),
                })}
              >
                <div style={quickIcon}>🎨</div>
                <div style={quickContent}>
                  <span style={quickTitle}>Decorations</span>
                  <span style={quickDesc}>Edit decoration listings</span>
                </div>
                <span style={quickArrow}>→</span>
              </NavLink>
            </div>
          </section>

          {/* Recent Activity Panels */}
          <div style={panelsGrid}>
            <section style={panel}>
              <div style={panelHeader}>
                <h2 style={panelTitle}>Recent Bookings</h2>
                <Link to="/admin/bookings" style={panelLink}>
                  View all →
                </Link>
              </div>

              <div style={panelContent}>
                {bookings.slice(0, 5).map((b) => (
                  <div key={b._id} style={panelRow}>
                    <div style={panelRowMain}>
                      <div style={panelRowTitle}>{b.decorationTitle}</div>
                      <div style={panelRowMeta}>
                        <span>{b.name}</span>
                        <span style={metaDot}>•</span>
                        <span>{b.phone}</span>
                      </div>
                    </div>
                    <div style={
                      (b.status || "NEW") === "NEW"
                        ? statusBadgeNew
                        : statusBadgeConfirmed
                    }>
                      {b.status || "NEW"}
                    </div>
                  </div>
                ))}

                {bookings.length === 0 && (
                  <p style={emptyState}>No bookings yet.</p>
                )}
              </div>
            </section>

            <section style={panel}>
              <div style={panelHeader}>
                <h2 style={panelTitle}>Recent Messages</h2>
                <Link to="/admin/contacts" style={panelLink}>
                  View all →
                </Link>
              </div>

              <div style={panelContent}>
                {messages.slice(0, 5).map((m) => (
                  <div key={m._id} style={panelRow}>
                    <div style={panelRowMain}>
                      <div style={panelRowTitle}>{m.name}</div>
                      <div style={panelRowMeta}>
                        <span>{m.email}</span>
                        {m.eventType && (
                          <>
                            <span style={metaDot}>•</span>
                            <span>{m.eventType}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={
                      (m.status || "NEW") === "NEW"
                        ? statusBadgeNew
                        : statusBadgeReplied
                    }>
                      {m.status || "NEW"}
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <p style={emptyState}>No messages yet.</p>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

/* Modern Industry-Level Styles */
const pageContainer = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  maxWidth: 1200,
  margin: "0 auto",
  padding: "24px",
};

const pageHeader = {
  marginBottom: 32,
};

const pageTitle = {
  fontSize: 32,
  fontWeight: 700,
  color: "#111827",
  margin: 0,
  letterSpacing: "-0.02em",
};

const pageLead = {
  fontSize: 16,
  color: "#6b7280",
  margin: "8px 0 0",
  lineHeight: 1.6,
  maxWidth: 600,
};

const mutedText = {
  color: "#9ca3af",
  fontSize: 15,
};

const alertError = {
  padding: "12px 16px",
  borderRadius: 8,
  background: "#fef2f2",
  color: "#991b1b",
  border: "1px solid #fecaca",
  fontSize: 14,
  fontWeight: 500,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 20,
  marginBottom: 32,
};

const statCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "default",
};

const statCardNew = {
  background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  borderColor: "#bae6fd",
};

const statIcon = {
  fontSize: 32,
  lineHeight: 1,
};

const statContent = {
  flex: 1,
};

const statValue = {
  fontSize: 36,
  fontWeight: 700,
  color: "#111827",
  lineHeight: 1,
  marginBottom: 4,
};

const statLabel = {
  fontSize: 13,
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const quickSection = {
  marginBottom: 32,
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#111827",
  margin: "0 0 16px",
};

const quickGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};

const quickCard = {
  textDecoration: "none",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  transition: "all 0.2s",
  position: "relative",
};

const quickCardActive = {
  borderColor: "#3b82f6",
  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
};

const quickIcon = {
  fontSize: 28,
  lineHeight: 1,
};

const quickContent = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const quickTitle = {
  fontSize: 16,
  fontWeight: 600,
  color: "#111827",
};

const quickDesc = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.4,
};

const quickArrow = {
  fontSize: 20,
  color: "#9ca3af",
  fontWeight: 600,
};

const panelsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  gap: 20,
};

const panel = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
};

const panelHeader = {
  padding: "20px",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const panelTitle = {
  fontSize: 16,
  fontWeight: 700,
  color: "#111827",
  margin: 0,
};

const panelLink = {
  fontSize: 14,
  fontWeight: 600,
  color: "#3b82f6",
  textDecoration: "none",
  transition: "color 0.2s",
};

const panelContent = {
  padding: "0",
};

const panelRow = {
  padding: "16px 20px",
  borderBottom: "1px solid #f3f4f6",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  transition: "background 0.2s",
};

const panelRowMain = {
  flex: 1,
  minWidth: 0,
};

const panelRowTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: "#111827",
  marginBottom: 4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const panelRowMeta = {
  fontSize: 13,
  color: "#6b7280",
  display: "flex",
  alignItems: "center",
  gap: 6,
  flexWrap: "wrap",
};

const metaDot = {
  color: "#d1d5db",
};

const statusBadgeNew = {
  padding: "4px 12px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  background: "#fef3c7",
  color: "#92400e",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
};

const statusBadgeConfirmed = {
  padding: "4px 12px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  background: "#d1fae5",
  color: "#065f46",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
};

const statusBadgeReplied = {
  padding: "4px 12px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  background: "#dbeafe",
  color: "#1e40af",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
};

const emptyState = {
  padding: "32px 20px",
  textAlign: "center",
  color: "#9ca3af",
  fontSize: 14,
  margin: 0,
};
