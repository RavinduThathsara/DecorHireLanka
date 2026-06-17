import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const authHeader = { Authorization: `Bearer ${token}` };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const monthBars = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const counts = new Array(MONTH_LABELS.length).fill(0);

    bookings.forEach((booking) => {
      const sourceDate = booking.createdAt || booking.eventDate;
      const parsed = new Date(sourceDate);
      if (Number.isNaN(parsed.getTime())) return;
      if (parsed.getFullYear() !== currentYear) return;
      const monthIndex = parsed.getMonth();
      if (monthIndex >= 0 && monthIndex < MONTH_LABELS.length) {
        counts[monthIndex] += 1;
      }
    });

    const highest = Math.max(...counts, 1);

    return MONTH_LABELS.map((label, index) => ({
      label,
      value: counts[index],
      height: 38 + (counts[index] / highest) * 70,
      active: counts[index] === highest && counts[index] > 0,
    }));
  }, [bookings]);

  const quickActions = [
    {
      to: "/admin/bookings",
      title: "New Booking",
      icon: "+",
      primary: true,
    },
    {
      to: "/admin/contacts",
      title: "Broadcast Message",
      icon: "~",
    },
    {
      to: "/admin/decorations",
      title: "Add Decoration",
      icon: "[]",
    },
    {
      to: "/admin/gallery",
      title: "Update Gallery",
      icon: "R",
    },
  ];

  const filteredQuickActions = quickActions.filter((item) =>
    normalizedSearch
      ? item.title.toLowerCase().includes(normalizedSearch)
      : true
  );

  const filteredBookings = bookings.filter((booking) =>
    normalizedSearch
      ? [booking.decorationTitle, booking.name, booking.phone, booking.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch))
      : true
  );

  const filteredMessages = messages.filter((message) =>
    normalizedSearch
      ? [message.name, message.email, message.eventType, message.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch))
      : true
  );

  const formatShortDate = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (value) =>
    String(value || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");

  return (
    <div style={pageContainer}>
      <header style={pageHeader}>
        <div style={pageHeaderCopy}>
          <h1 style={pageTitle}>Dashboard Overview</h1>
          <p style={pageLead}>Manage bookings, messages, gallery updates, and monthly activity.</p>
        </div>
        <label style={searchWrap}>
          <span style={searchIcon}>Q</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search actions, bookings, or messages..."
            style={searchInput}
          />
        </label>
      </header>

      {loading && <p style={mutedText}>Loading dashboard...</p>}
      {error && <div style={alertError}>{error}</div>}

      {!loading && !error && (
        <>
          <section style={overviewGrid}>
            <div style={actionsCard}>
              <h2 style={actionsTitle}>Quick Actions</h2>
              <div style={actionsList}>
                {filteredQuickActions.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    style={({ isActive }) => ({
                      ...actionButton,
                      ...(item.primary ? actionButtonPrimary : {}),
                      ...(isActive ? actionButtonActive : {}),
                    })}
                  >
                    <span style={item.primary ? actionIconPrimary : actionIcon}>{item.icon}</span>
                    <span style={item.primary ? actionTextPrimary : actionText}>{item.title}</span>
                  </NavLink>
                ))}
                {filteredQuickActions.length === 0 && (
                  <p style={emptySearchState}>No matching actions.</p>
                )}
              </div>
            </div>

            <div style={chartCard}>
              <div style={chartHead}>
                <div>
                  <h2 style={chartTitle}>Bookings by Month</h2>
                  <p style={chartSubhead}>YEAR-TO-DATE COMPARISON</p>
                </div>
                <span style={chartYearBadge}>{new Date().getFullYear()}</span>
              </div>

              <div style={chartBars}>
                {monthBars.map((bar) => (
                  <div key={bar.label} style={chartBarItem}>
                    <div
                      style={{
                        ...chartBar,
                        height: `${bar.height}px`,
                        ...(bar.active ? chartBarActive : {}),
                      }}
                      title={`${bar.label}: ${bar.value}`}
                    />
                    <span style={{ ...chartLabel, ...(bar.active ? chartLabelActive : {}) }}>
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={statsGrid}>
            <div style={statCard}>
              <div style={statIcon}>BK</div>
              <div style={statContent}>
                <div style={statValue}>{totalBookings}</div>
                <div style={statLabel}>Total Bookings</div>
              </div>
            </div>

            <div style={{ ...statCard, ...statCardSoft }}>
              <div style={statIcon}>NW</div>
              <div style={statContent}>
                <div style={statValue}>{newBookings}</div>
                <div style={statLabel}>New Bookings</div>
              </div>
            </div>

            <div style={statCard}>
              <div style={statIcon}>MS</div>
              <div style={statContent}>
                <div style={statValue}>{totalMessages}</div>
                <div style={statLabel}>Total Messages</div>
              </div>
            </div>

            <div style={{ ...statCard, ...statCardSoft }}>
              <div style={statIcon}>NM</div>
              <div style={statContent}>
                <div style={statValue}>{newMessages}</div>
                <div style={statLabel}>New Messages</div>
              </div>
            </div>
          </section>

          <div style={panelsGrid}>
            <section style={panel}>
              <div style={panelHeader}>
                <h2 style={panelTitle}>Recent Bookings</h2>
                <Link to="/admin/bookings" style={panelLink}>
                  View all &gt;
                </Link>
              </div>

              <div style={panelContent}>
                {filteredBookings.slice(0, 5).map((b) => (
                  <div key={b._id} style={panelRow}>
                    <div style={panelRowIdentity}>
                      <div style={panelAvatar}>{getInitials(b.name || b.decorationTitle)}</div>
                      <div style={panelRowMain}>
                        <div style={panelRowTop}>
                          <div style={panelRowTitle}>{b.decorationTitle}</div>
                          <div style={panelRowDate}>{formatShortDate(b.createdAt)}</div>
                        </div>
                        <div style={panelRowMeta}>
                          <span>{b.name}</span>
                          <span style={metaDot}>/</span>
                          <span>{b.phone}</span>
                        </div>
                        <div style={panelRowSubmeta}>
                          <span>Event date</span>
                          <span style={metaDot}>/</span>
                          <span>{b.eventDate}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={
                        (b.status || "NEW") === "NEW" ? statusBadgeNew : statusBadgeConfirmed
                      }
                    >
                      {b.status || "NEW"}
                    </div>
                  </div>
                ))}

                {filteredBookings.length === 0 && (
                  <div style={emptyStateCard}>
                    <div style={emptyStateIcon}>BK</div>
                    <p style={emptyStateTitle}>
                      {normalizedSearch ? "No matching bookings found" : "No bookings yet"}
                    </p>
                    <p style={emptyStateText}>
                      {normalizedSearch
                        ? "Try a different search term to find booking records."
                        : "New booking requests will appear here for quick review."}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section style={panel}>
              <div style={panelHeader}>
                <h2 style={panelTitle}>Recent Messages</h2>
                <Link to="/admin/contacts" style={panelLink}>
                  View all &gt;
                </Link>
              </div>

              <div style={panelContent}>
                {filteredMessages.slice(0, 5).map((m) => (
                  <div key={m._id} style={panelRow}>
                    <div style={panelRowIdentity}>
                      <div style={panelAvatar}>{getInitials(m.name)}</div>
                      <div style={panelRowMain}>
                        <div style={panelRowTop}>
                          <div style={panelRowTitle}>{m.name}</div>
                          <div style={panelRowDate}>{formatShortDate(m.createdAt)}</div>
                        </div>
                        <div style={panelRowMeta}>
                          <span>{m.email}</span>
                          {m.eventType && (
                            <>
                              <span style={metaDot}>/</span>
                              <span>{m.eventType}</span>
                            </>
                          )}
                        </div>
                        <div style={panelRowSubmeta}>
                          <span>Contact message</span>
                          <span style={metaDot}>/</span>
                          <span>{m.status || "NEW"}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={
                        (m.status || "NEW") === "NEW" ? statusBadgeNew : statusBadgeReplied
                      }
                    >
                      {m.status || "NEW"}
                    </div>
                  </div>
                ))}

                {filteredMessages.length === 0 && (
                  <div style={emptyStateCard}>
                    <div style={emptyStateIcon}>MS</div>
                    <p style={emptyStateTitle}>
                      {normalizedSearch ? "No matching messages found" : "No messages yet"}
                    </p>
                    <p style={emptyStateText}>
                      {normalizedSearch
                        ? "Try a broader keyword to surface customer conversations."
                        : "Incoming customer messages will be listed here."}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

const pageContainer = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  maxWidth: 1200,
  margin: "0 auto",
  padding: "24px",
};

const pageHeader = {
  marginBottom: 20,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap",
};

const pageHeaderCopy = {
  flex: "1 1 420px",
  minWidth: 0,
};

const pageTitle = {
  margin: 0,
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#1d2430",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const pageLead = {
  margin: "8px 0 0",
  color: "#776b60",
  fontSize: 14,
  lineHeight: 1.6,
};

const searchWrap = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  maxWidth: 420,
  marginLeft: "auto",
  flex: "0 0 420px",
  padding: "12px 14px",
  borderRadius: 10,
  background: "#ffffff",
  border: "1px solid #ddd4c8",
  boxShadow: "0 2px 6px rgba(90, 68, 39, 0.05)",
};

const searchIcon = {
  width: 20,
  height: 20,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  background: "#f2e1cf",
  color: "#9b6a3a",
  fontSize: 11,
  fontWeight: 900,
};

const searchInput = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#1f2937",
  fontSize: 14,
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

const overviewGrid = {
  display: "grid",
  gridTemplateColumns: "320px minmax(0, 1fr)",
  gap: 18,
  alignItems: "stretch",
  marginBottom: 24,
};

const actionsCard = {
  padding: "10px 0 0",
};

const actionsTitle = {
  margin: "0 0 12px",
  fontSize: 22,
  fontWeight: 800,
  color: "#1f2937",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const actionsList = {
  display: "grid",
  gap: 10,
};

const actionButton = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minHeight: 46,
  padding: "0 14px",
  borderRadius: 8,
  border: "1px solid #d6cfc4",
  background: "#ffffff",
  textDecoration: "none",
  boxShadow: "0 1px 2px rgba(17, 24, 39, 0.04)",
};

const actionButtonPrimary = {
  background: "#b0814d",
  borderColor: "#b0814d",
};

const actionButtonActive = {
  boxShadow: "0 0 0 2px rgba(176, 129, 77, 0.14)",
};

const actionIcon = {
  width: 18,
  color: "#b0814d",
  fontSize: 12,
  fontWeight: 900,
  textAlign: "center",
  flexShrink: 0,
};

const actionIconPrimary = {
  ...actionIcon,
  color: "#fff7ed",
};

const actionText = {
  fontSize: 13,
  fontWeight: 700,
  color: "#9c6c40",
};

const actionTextPrimary = {
  ...actionText,
  color: "#ffffff",
};

const chartCard = {
  padding: "18px 18px 14px",
  borderRadius: 10,
  background: "#ffffff",
  border: "1px solid #e7dfd2",
  boxShadow: "0 2px 6px rgba(90, 68, 39, 0.05)",
};

const chartHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const chartTitle = {
  margin: 0,
  fontSize: 24,
  fontWeight: 800,
  color: "#3a332d",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const chartSubhead = {
  margin: "4px 0 0",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.08em",
  color: "#9b8f81",
};

const chartYearBadge = {
  padding: "3px 8px",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 700,
  color: "#756a5d",
  background: "#f4ede4",
  border: "1px solid #e5dccf",
};

const chartBars = {
  marginTop: 20,
  height: 122,
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gap: 10,
  alignItems: "end",
};

const chartBarItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 8,
  height: "100%",
};

const chartBar = {
  width: "100%",
  maxWidth: 44,
  borderRadius: "2px 2px 0 0",
  background: "#e9e2d7",
};

const chartBarActive = {
  background: "#b0814d",
};

const chartLabel = {
  fontSize: 11,
  fontWeight: 800,
  color: "#8f8375",
};

const chartLabelActive = {
  color: "#b0814d",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const statCard = {
  background: "#ffffff",
  border: "1px solid #e7dfd2",
  borderRadius: 14,
  padding: "18px",
  display: "flex",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 8px 24px rgba(17, 24, 39, 0.04)",
};

const statCardSoft = {
  background: "#fbf6ef",
};

const statIcon = {
  width: 42,
  height: 42,
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f2e1cf",
  color: "#9b6a3a",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.06em",
  flexShrink: 0,
};

const statContent = {
  flex: 1,
};

const statValue = {
  fontSize: 34,
  fontWeight: 800,
  color: "#111827",
  lineHeight: 1,
  marginBottom: 4,
};

const statLabel = {
  fontSize: 12,
  fontWeight: 700,
  color: "#7a6c5f",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const panelsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  gap: 20,
};

const panel = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 10px 24px rgba(17, 24, 39, 0.04)",
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
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const panelLink = {
  fontSize: 14,
  fontWeight: 600,
  color: "#3b82f6",
  textDecoration: "none",
};

const panelContent = {
  padding: 0,
};

const panelRow = {
  padding: "18px 20px",
  borderBottom: "1px solid #f3f4f6",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
};

const panelRowIdentity = {
  display: "flex",
  alignItems: "flex-start",
  gap: 14,
  flex: 1,
  minWidth: 0,
};

const panelAvatar = {
  width: 42,
  height: 42,
  borderRadius: 14,
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f3e2cf 0%, #ead3b6 100%)",
  color: "#9b6a3a",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.06em",
};

const panelRowMain = {
  flex: 1,
  minWidth: 0,
};

const panelRowTop = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const panelRowTitle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#111827",
  marginBottom: 4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const panelRowDate = {
  flexShrink: 0,
  color: "#9ca3af",
  fontSize: 12,
  fontWeight: 700,
};

const panelRowMeta = {
  fontSize: 13,
  color: "#5f6b7a",
  display: "flex",
  alignItems: "center",
  gap: 6,
  flexWrap: "wrap",
};

const panelRowSubmeta = {
  marginTop: 6,
  fontSize: 12,
  color: "#9a8d7c",
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

const emptyStateCard = {
  minHeight: 220,
  padding: "32px 24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const emptyStateIcon = {
  width: 52,
  height: 52,
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f3e2cf 0%, #ead3b6 100%)",
  color: "#9b6a3a",
  fontSize: 14,
  fontWeight: 800,
  letterSpacing: "0.08em",
};

const emptyStateTitle = {
  margin: "16px 0 6px",
  color: "#1f2937",
  fontSize: 18,
  fontWeight: 700,
};

const emptyStateText = {
  maxWidth: 320,
  margin: 0,
  color: "#9ca3af",
  fontSize: 14,
  lineHeight: 1.6,
};

const emptyState = {
  padding: "32px 20px",
  textAlign: "center",
  color: "#9ca3af",
  fontSize: 14,
  margin: 0,
};

const emptySearchState = {
  margin: 0,
  padding: "10px 2px 0",
  color: "#9ca3af",
  fontSize: 13,
};
