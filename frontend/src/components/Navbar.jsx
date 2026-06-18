import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/images/logo.png";

function navLinkClass({ isActive }) {
  return `site-nav__link${isActive ? " site-nav__link--active" : ""}`;
}

export default function Navbar() {
  const { customer, logoutCustomer, notifications, markAllAsRead } = useAuth();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);

  const profileName = customer?.username || "Customer";
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "C";
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs) markAllAsRead();
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-brand" aria-label="DecorHire Lanka home">
          <img src={logo} alt="DecorHire Lanka logo" className="site-brand__logo" />
          <span className="site-brand__copy">
            <strong>DecorHire Lanka</strong>
            <span>Wedding Decoration Studio</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/popular" className={navLinkClass}>
            Popular
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass}>
            Gallery
          </NavLink>
          <NavLink to="/book" className={navLinkClass}>
            Booking
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="site-actions">
          {customer && (
            <div style={{ position: "relative" }}>
              <div
                style={notificationBadge}
                title="Notifications"
                onClick={handleNotifClick}
              >
                <span style={{ fontSize: 20 }}>🔔</span>
                {unreadCount > 0 && <span style={notificationDot}></span>}
              </div>

              {/* Industry-Level Notification Dropdown */}
              {showNotifs && (
                <div style={notifDropdown}>
                  <div style={notifHeader}>
                    <span style={notifTitle}>Notifications</span>
                    <div style={notifHeaderActions}>
                      <span style={notifActionIcon}>✓</span>
                      <span style={notifActionIcon}>⚙</span>
                      <span style={notifActionIcon} onClick={() => setShowNotifs(false)}>✕</span>
                    </div>
                  </div>

                  <div style={notifList}>
                    {notifications.length === 0 ? (
                      <div style={emptyNotifs}>No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          style={notifItem}
                          onClick={() => {
                            setShowNotifs(false);
                            navigate("/profile");
                          }}
                        >
                          <div style={notifIcon}>✎</div>
                          <div style={notifContent}>
                            <div style={notifText}>{n.title}</div>
                            <div style={notifMeta}>
                              <span>{n.time}</span>
                              <span style={notifLink}>View full notification</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div
                    style={notifFooter}
                    onClick={() => {
                      setShowNotifs(false);
                      navigate("/profile");
                    }}
                  >
                    See all
                  </div>
                </div>
              )}
            </div>
          )}
          {!customer ? (
            <>
              <Link to="/login" className="site-btn site-btn--ghost">
                Login
              </Link>
              <Link to="/register" className="site-btn site-btn--solid">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" style={profileChip} aria-label="Customer profile">
                <span style={profileAvatar}>{profileInitial}</span>
                <div style={profileCopy}>
                  <span style={profileLabel}>Profile</span>
                  <span style={profileNameStyle}>{profileName}</span>
                </div>
              </Link>
              <button
                type="button"
                className="site-btn site-btn--ghost"
                onClick={logoutCustomer}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const notifDropdown = {
  position: "absolute",
  top: "50px",
  right: "0px",
  width: "380px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  border: "1px solid rgba(155, 91, 52, 0.12)",
  zIndex: 1000,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const notifHeader = {
  padding: "14px 18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #f0f0f0",
};

const notifTitle = {
  fontSize: "16px",
  fontWeight: "800",
  color: "#1f1a17",
};

const notifHeaderActions = {
  display: "flex",
  gap: "12px",
  color: "#d4b99a",
  fontSize: "14px",
  cursor: "pointer",
};

const notifActionIcon = {
  padding: "4px",
  cursor: "pointer",
};

const notifList = {
  maxHeight: "400px",
  overflowY: "auto",
};

const notifItem = {
  padding: "16px 18px",
  display: "flex",
  gap: "14px",
  borderBottom: "1px solid #f8f8f8",
  cursor: "pointer",
  transition: "background 0.2s",
};

const notifIcon = {
  fontSize: "16px",
  color: "#6f645a",
  marginTop: "2px",
};

const notifContent = {
  flex: 1,
};

const notifText = {
  fontSize: "13.5px",
  fontWeight: "600",
  lineHeight: "1.4",
  color: "#4a443f",
  marginBottom: "6px",
};

const notifMeta = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "11px",
  color: "#999",
};

const notifLink = {
  color: "#d4b99a",
  fontWeight: "700",
};

const notifFooter = {
  padding: "12px",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: "800",
  color: "#d4b99a",
  borderTop: "1px solid #f0f0f0",
  cursor: "pointer",
};

const emptyNotifs = {
  padding: "30px",
  textAlign: "center",
  color: "#999",
  fontSize: "14px",
};

const notificationBadge = {
  position: "relative",
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255, 255, 255, 0.7)",
  border: "1px solid rgba(102, 79, 58, 0.12)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  color: "#9b5b34",
};

const notificationDot = {
  position: "absolute",
  top: 10,
  right: 10,
  width: 8,
  height: 8,
  background: "#ef4444",
  borderRadius: "50%",
  border: "2px solid #fff",
};

const profileChip = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 999,
  border: "1px solid rgba(102, 79, 58, 0.18)",
  background: "rgba(255, 255, 255, 0.78)",
  boxShadow: "0 8px 18px rgba(70, 43, 22, 0.08)",
  flex: "0 0 auto",
  textDecoration: "none",
  cursor: "pointer",
  transition: "background 160ms ease, transform 160ms ease",
};

const profileAvatar = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(135deg, #9b5b34 0%, #7c4420 100%)",
  color: "#fff",
  fontWeight: 900,
  fontSize: 13,
  flex: "0 0 auto",
};

const profileCopy = {
  display: "grid",
  gap: 0,
  minWidth: 0,
};

const profileLabel = {
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#9b5b34",
};

const profileNameStyle = {
  fontSize: 12,
  fontWeight: 900,
  color: "#1f1a17",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
