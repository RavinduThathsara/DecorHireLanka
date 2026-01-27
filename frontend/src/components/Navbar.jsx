// frontend/src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const linkStyle = ({ isActive }) => ({
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: "10px",
  fontWeight: 600,
  color: isActive ? "#ffffff" : "#222",
  background: isActive ? "#111827" : "transparent",
});

export default function Navbar() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const c = localStorage.getItem("customer");
    setCustomer(c ? JSON.parse(c) : null);
  }, []);

  const logoutCustomer = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    setCustomer(null);
    navigate("/");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Brand */}
        <NavLink to="/" style={{ textDecoration: "none", color: "#111" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 18, fontWeight: 800 }}>
              Sri Lankan Wedding Decoration
            </span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              Elegant • Traditional • Modern
            </span>
          </div>
        </NavLink>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <NavLink to="/popular" style={linkStyle}>
            Popular Wedding Decoration
          </NavLink>
          <NavLink to="/gallery" style={linkStyle}>
            Gallery
          </NavLink>
          <NavLink to="/contact" style={linkStyle}>
            Contact Us
          </NavLink>
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {customer ? (
            <>
              <span style={{ fontWeight: 800, color: "#111827" }}>
                Hi, {customer.username}
              </span>
              <button style={btnLight} onClick={logoutCustomer}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/register" style={btnLightLink}>
                Register
              </NavLink>
              <NavLink to="/login" style={btnDarkLink}>
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const btnLightLink = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  background: "#f3f4f6",
  color: "#111",
  fontWeight: 700,
};

const btnDarkLink = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  background: "#111827",
  color: "white",
  fontWeight: 700,
};

const btnLight = {
  padding: "10px 12px",
  borderRadius: 10,
  background: "#f3f4f6",
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
};
