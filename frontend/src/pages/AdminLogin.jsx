// frontend/src/pages/AdminLogin.jsx
import { useState } from "react";
import { api } from "../services/api.js";
import { useNavigate } from "react-router-dom";

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
    <div style={card}>
      <h1 style={{ marginTop: 0 }}>Admin Login</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
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
  );
}

const card = {
  maxWidth: 420,
  margin: "40px auto",
  padding: 18,
  border: "1px solid #eee",
  borderRadius: 14,
  background: "white",
};

const input = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};

const btn = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 800,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const msgError = {
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};
