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
          <div style={headerBadge}>📊</div>
          <h1 style={pageTitle}>Dashboard Overview</h1>
          <p style={pageLead}>Manage bookings, messages, gallery updates, and monthly activity.</p>
        </div>
        <div style={headerActions}>
          <div style={notificationGroup}>
            <Link to="/admin/bookings" style={notificationButton}>
              <span style={notificationIcon}>🔔</span>
              {newBookings > 0 && <span style={notificationBadge}>{newBookings}</span>}
              <span style={notificationLabel}>Bookings</span>
            </Link>
            <Link to="/admin/contacts" style={notificationButton}>
              <span style={notificationIcon}>✉️</span>
              {newMessages > 0 && <span style={notificationBadge}>{newMessages}</span>}
              <span style={notificationLabel}>Messages</span>
            </Link>
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
        </div>
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
              <div style={statIconGradient}>📅</div>
              <div style={statContent}>
                <div style={statValue}>{totalBookings}</div>
                <div style={statLabel}>Total Bookings</div>
              </div>
            </div>

            <div style={{ ...statCard, ...statCardHighlight }}>
              <div style={statIconGradientAccent}>🔔</div>
              <div style={statContent}>
                <div style={statValue}>{newBookings}</div>
                <div style={statLabel}>New Bookings</div>
                {newBookings > 0 && <div style={statPulse} />}
              </div>
            </div>

            <div style={statCard}>
              <div style={statIconGradient}>💬</div>
              <div style={statContent}>
                <div style={statValue}>{totalMessages}</div>
                <div style={statLabel}>Total Messages</div>
              </div>
            </div>

            <div style={{ ...statCard, ...statCardHighlight }}>
              <div style={statIconGradientAccent}>✉️</div>
              <div style={statContent}>
                <div style={statValue}>{newMessages}</div>
                <div style={statLabel}>New Messages</div>
                {newMessages > 0 && <div style={statPulse} />}
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
  padding: "32px 24px",
  minHeight: "100vh",
  background: "linear-gradient(to bottom, #fdf8f0 0%, #f9f2e8 100%)",
};

const pageHeader = {
  marginBottom: 32,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 24,
  flexWrap: "wrap",
  animation: "fadeInDown 0.5s ease-out",
};

const pageHeaderCopy = {
  flex: "1 1 420px",
  minWidth: 0,
};

const headerBadge = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: 16,
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  fontSize: 28,
  marginBottom: 16,
  boxShadow: "0 8px 24px rgba(155, 91, 52, 0.25)",
};

const pageTitle = {
  margin: 0,
  fontSize: 36,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#1d2430",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const pageLead = {
  margin: "10px 0 0",
  color: "#776b60",
  fontSize: 15,
  lineHeight: 1.6,
};

const headerActions = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  alignItems: "flex-end",
};

const notificationGroup = {
  display: "flex",
  gap: 12,
  alignItems: "center",
};

const notificationButton = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 18px",
  borderRadius: 12,
  background: "#ffffff",
  border: "2px solid #e7dfd2",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(90, 68, 39, 0.08)",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

const notificationIcon = {
  fontSize: 20,
  lineHeight: 1,
};

const notificationLabel = {
  fontSize: 13,
  fontWeight: 700,
  color: "#1f2937",
};

const notificationBadge = {
  position: "absolute",
  top: -6,
  right: -6,
  minWidth: 22,
  height: 22,
  padding: "0 6px",
  borderRadius: 999,
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "#ffffff",
  fontSize: 11,
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
  animation: "pulse 2s ease-in-out infinite",
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
  padding: "24px",
  background: "#ffffff",
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
  border: "1px solid #e7dfd2",
};

const actionsTitle = {
  margin: "0 0 18px",
  fontSize: 24,
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
  minHeight: 52,
  padding: "0 16px",
  borderRadius: 12,
  border: "2px solid #e7dfd2",
  background: "#fdfbf7",
  textDecoration: "none",
  boxShadow: "0 2px 8px rgba(17, 24, 39, 0.04)",
  transition: "all 0.3s ease",
};

const actionButtonPrimary = {
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  borderColor: "transparent",
  boxShadow: "0 4px 16px rgba(155, 91, 52, 0.25)",
};

const actionButtonActive = {
  boxShadow: "0 0 0 3px rgba(155, 91, 52, 0.2)",
  transform: "translateY(-2px)",
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
  padding: "24px",
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid #e7dfd2",
  boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
};

const chartHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 8,
};

const chartTitle = {
  margin: 0,
  fontSize: 26,
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
  borderRadius: "6px 6px 0 0",
  background: "linear-gradient(to top, #e9e2d7 0%, #f0ebe0 100%)",
  transition: "all 0.3s ease",
};

const chartBarActive = {
  background: "linear-gradient(to top, #9b5b34 0%, #b5754a 100%)",
  boxShadow: "0 -4px 12px rgba(155, 91, 52, 0.3)",
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
  position: "relative",
  background: "#ffffff",
  border: "2px solid #e7dfd2",
  borderRadius: 18,
  padding: "24px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
  transition: "all 0.3s ease",
  overflow: "hidden",
};

const statCardHighlight = {
  background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
  borderColor: "#fed7aa",
};

const statIconGradient = {
  width: 56,
  height: 56,
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f3e2cf 0%, #ead3b6 100%)",
  fontSize: 24,
  flexShrink: 0,
  boxShadow: "0 4px 12px rgba(155, 106, 58, 0.15)",
};

const statIconGradientAccent = {
  width: 56,
  height: 56,
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  fontSize: 24,
  flexShrink: 0,
  boxShadow: "0 4px 12px rgba(155, 91, 52, 0.3)",
};

const statPulse = {
  position: "absolute",
  top: 24,
  right: 24,
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: "#ef4444",
  animation: "pulse 2s ease-in-out infinite",
  boxShadow: "0 0 12px rgba(239, 68, 68, 0.6)",
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
  fontSize: 42,
  fontWeight: 900,
  color: "#111827",
  lineHeight: 1,
  marginBottom: 6,
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const statLabel = {
  fontSize: 13,
  fontWeight: 700,
  color: "#7a6c5f",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const panelsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  gap: 20,
};

const panel = {
  background: "#ffffff",
  border: "2px solid #e7dfd2",
  borderRadius: 18,
  overflow: "hidden",
  boxShadow: "0 10px 32px rgba(17, 24, 39, 0.08)",
};

const panelHeader = {
  padding: "24px",
  borderBottom: "2px solid #f3f4f6",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "linear-gradient(to right, #fdfbf7 0%, #ffffff 100%)",
};

const panelTitle = {
  fontSize: 20,
  fontWeight: 800,
  color: "#111827",
  margin: 0,
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const panelLink = {
  fontSize: 14,
  fontWeight: 700,
  color: "#9b5b34",
  textDecoration: "none",
  transition: "all 0.3s ease",
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
  width: 48,
  height: 48,
  borderRadius: 14,
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 800,
  letterSpacing: "0.06em",
  boxShadow: "0 4px 12px rgba(155, 91, 52, 0.2)",
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
  width: 64,
  height: 64,
  borderRadius: 20,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f3e2cf 0%, #ead3b6 100%)",
  color: "#9b6a3a",
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: "0.08em",
  boxShadow: "0 8px 24px rgba(155, 106, 58, 0.15)",
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
