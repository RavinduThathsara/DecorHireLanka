import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/images/logo.png";

function navLinkClass({ isActive }) {
  return `site-nav__link${isActive ? " site-nav__link--active" : ""}`;
}

export default function Navbar() {
  const { customer, logoutCustomer } = useAuth();
  const profileName = customer?.username || "Customer";
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "C";

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
