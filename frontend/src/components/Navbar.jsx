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
  background: "white",
  borderBottom: "1px solid #eee",
  position: "sticky",
  top: 0,
  zIndex: 50,
};

const inner = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "14px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const brand = {
  textDecoration: "none",
  fontWeight: 900,
  color: "#111827",
  fontSize: 18,
};

const nav = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const navLink = ({ isActive }) => ({
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  color: isActive ? "#111827" : "#4b5563",
  padding: "8px 10px",
  borderRadius: 10,
  background: isActive ? "#f3f4f6" : "transparent",
});

const right = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
};

const btnDark = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 900,
  background: "#111827",
  color: "white",
};

const btnLight = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
};

const userText = {
  fontWeight: 800,
  color: "#111827",
};
