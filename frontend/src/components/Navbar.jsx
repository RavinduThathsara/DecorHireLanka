import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { customer, logoutCustomer } = useAuth();

  return (
    <header style={wrap}>
      <div style={inner}>
        <Link to="/" style={brand}>
          DecorHire Lanka
        </Link>

        <nav style={nav}>
          <NavLink to="/" style={navLink}>
            Home
          </NavLink>
          <NavLink to="/services" style={navLink}>
            Services
          </NavLink>
          <NavLink to="/popular" style={navLink}>
            Popular
          </NavLink>
          <NavLink to="/gallery" style={navLink}>
            Gallery
          </NavLink>
          <NavLink to="/contact" style={navLink}>
            Contact
          </NavLink>
        </nav>

        <div style={right}>
          {!customer ? (
            <>
              <Link to="/login" style={btnLight}>
                Login
              </Link>
              <Link to="/register" style={btnDark}>
                Register
              </Link>
            </>
          ) : (
            <>
              <span style={userText}>Hi, {customer?.username || "Customer"}</span>
              <button style={btnLight} onClick={logoutCustomer}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const wrap = {
  background: "#3e0202",
  borderBottom: "3px solid #f97316",
  position: "sticky",
  top: 0,
  zIndex: 50,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
};

const inner = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const brand = {
  textDecoration: "none",
  fontWeight: 900,
  color: "#f97316",
  fontSize: 22,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const nav = {
  display: "flex",
  gap: 15,
  flexWrap: "wrap",
  alignItems: "center",
};

const navLink = ({ isActive }) => ({
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  color: isActive ? "#ffffff" : "#9ca3af",
  padding: "8px 16px",
  borderRadius: 4,
  background: isActive ? "#374151" : "transparent",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  border: isActive ? "1px solid #4b5563" : "1px solid transparent",
  transition: "all 0.2s ease-in-out",
});

const right = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const btnDark = {
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: 4,
  border: "none",
  fontWeight: 800,
  background: "#f97316",
  color: "#111827",
  textTransform: "uppercase",
  letterSpacing: "1px",
  boxShadow: "0 2px 4px rgba(249, 115, 22, 0.4)",
  transition: "all 0.2s ease",
};

const btnLight = {
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: 4,
  border: "2px solid #4b5563",
  fontWeight: 800,
  background: "transparent",
  color: "#e5e7eb",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "1px",
  transition: "all 0.2s ease",
};

const userText = {
  fontWeight: 800,
  color: "#f97316",
};
