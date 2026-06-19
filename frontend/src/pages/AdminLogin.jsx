// frontend/src/pages/AdminLogin.jsx
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";


export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await api.post("/api/admin/login", form);

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainer}>
      <div style={card}>
        <h1 style={title}>Admin Login</h1>

        <form onSubmit={onSubmit} style={formStyle}>
          <input
            style={input}
            name="email"
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={onChange}
            required
          />

          <input
            style={input}
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />

          <button style={btn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <div style={msgError}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

const pageContainer = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  background: "linear-gradient(rgba(31, 26, 23, 0.75), rgba(62, 53, 47, 0.8)), url('/gallery/gallery42.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
};

const card = {
  maxWidth: 440,
  width: "100%",
  padding: 36,
  border: "1px solid rgba(155, 91, 52, 0.2)",
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(155, 91, 52, 0.3)",
};

const title = {
  marginTop: 0,
  marginBottom: 28,
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: 32,
  fontWeight: 900,
  textAlign: "center",
  color: "#1f1a17",
  letterSpacing: "-0.02em",
};

const formStyle = {
  display: "grid",
  gap: 16,
};

const input = {
  padding: "14px 16px",
  borderRadius: 12,
  border: "2px solid rgba(155, 91, 52, 0.2)",
  outline: "none",
  fontSize: 15,
  background: "rgba(255, 255, 255, 0.9)",
  transition: "all 0.3s ease",
  color: "#1f1a17",
};

const btn = {
  padding: "14px 16px",
  borderRadius: 12,
  border: "none",
  fontWeight: 800,
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  color: "white",
  cursor: "pointer",
  fontSize: 15,
  boxShadow: "0 4px 16px rgba(155, 91, 52, 0.3)",
  transition: "all 0.3s ease",
};

const msgError = {
  padding: 14,
  borderRadius: 12,
  background: "rgba(254, 226, 226, 0.95)",
  color: "#991b1b",
  fontWeight: 700,
  fontSize: 14,
  textAlign: "center",
  border: "1px solid rgba(153, 27, 27, 0.2)",
};
