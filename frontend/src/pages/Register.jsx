// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { api } from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { loginCustomer } = useAuth();

  const [form, setForm] = useState({
    email: "",
    username: "",
    phone: "",
    location: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const res = await api.post("/api/customers/register", form);

      // ✅ set AuthContext + localStorage
      loginCustomer({ token: res.data.token, customer: res.data.customer });

      setSuccess("Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <div style={header}>
          <h1 style={title}>Create Account</h1>
          <p style={subtitle}>Register to book decorations and manage your events</p>
        </div>

        <form onSubmit={onSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={label}>Email Address</label>
            <input
              style={input}
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Full Name</label>
            <input
              style={input}
              name="username"
              type="text"
              placeholder="John Doe"
              value={form.username}
              onChange={onChange}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Phone Number</label>
            <input
              style={input}
              name="phone"
              type="tel"
              placeholder="+94 71 234 5678"
              value={form.phone}
              onChange={onChange}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Location</label>
            <input
              style={input}
              name="location"
              type="text"
              placeholder="Colombo, Sri Lanka"
              value={form.location}
              onChange={onChange}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Password</label>
            <input
              style={input}
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
            />
          </div>

          <button style={btn} disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          {error && <div style={msgError}>{error}</div>}
          {success && <div style={msgOk}>{success}</div>}
        </form>

        <div style={footer}>
          <p style={footerText}>
            Already have an account?{" "}
            <Link to="/login" style={link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Modern Industry-Level Styles */
const container = {
  minHeight: "calc(100vh - 200px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
};

const card = {
  maxWidth: 480,
  width: "100%",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
};

const header = {
  padding: "32px 32px 24px",
  textAlign: "center",
  borderBottom: "1px solid #f3f4f6",
};

const title = {
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  color: "#111827",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  letterSpacing: "-0.02em",
};

const subtitle = {
  margin: "8px 0 0",
  fontSize: 15,
  color: "#6b7280",
  lineHeight: 1.5,
};

const formStyle = {
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const label = {
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const input = {
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: 15,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontWeight: 400,
  color: "#111827",
  backgroundColor: "white",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const btn = {
  padding: "14px 16px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  fontSize: 15,
  background: "#111827",
  color: "white",
  cursor: "pointer",
  transition: "background 0.2s, transform 0.1s",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  marginTop: 8,
};

const msgError = {
  padding: "12px 14px",
  borderRadius: 8,
  background: "#fef2f2",
  color: "#991b1b",
  border: "1px solid #fecaca",
  fontSize: 14,
  fontWeight: 500,
};

const msgOk = {
  padding: "12px 14px",
  borderRadius: 8,
  background: "#f0fdf4",
  color: "#166534",
  border: "1px solid #bbf7d0",
  fontSize: 14,
  fontWeight: 500,
};

const footer = {
  padding: "20px 32px",
  background: "#f9fafb",
  borderTop: "1px solid #e5e7eb",
  textAlign: "center",
};

const footerText = {
  margin: 0,
  fontSize: 14,
  color: "#6b7280",
};

const link = {
  color: "#3b82f6",
  textDecoration: "none",
  fontWeight: 600,
  transition: "color 0.2s",
};
