// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { api } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { loginCustomer } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
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

      const res = await api.post("/api/customers/login", form);

      // ✅ set AuthContext + localStorage
      loginCustomer({ token: res.data.token, customer: res.data.customer });

      setSuccess("Login successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h1 style={{ marginTop: 0 }}>Customer Login</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input style={input} name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input style={input} name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />

        <button style={btn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <div style={msgError}>{error}</div>}
        {success && <div style={msgOk}>{success}</div>}
      </form>
    </div>
  );
}

const card = { maxWidth: 420, margin: "0 auto", padding: 18, border: "1px solid #eee", borderRadius: 14, background: "white" };
const input = { padding: "12px 12px", borderRadius: 10, border: "1px solid #ddd", outline: "none", fontSize: 14 };
const btn = { padding: "12px 12px", borderRadius: 10, border: "none", fontWeight: 800, background: "#111827", color: "white", cursor: "pointer" };
const msgError = { padding: 12, borderRadius: 10, background: "#fee2e2", color: "#991b1b", fontWeight: 700 };
const msgOk = { padding: 12, borderRadius: 10, background: "#dcfce7", color: "#166534", fontWeight: 700 };
