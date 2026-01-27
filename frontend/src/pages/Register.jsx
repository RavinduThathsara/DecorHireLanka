// frontend/src/pages/Register.jsx
import { useState } from "react";
import { api } from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
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

      // Save token + customer
      localStorage.setItem("customerToken", res.data.token);
      localStorage.setItem("customer", JSON.stringify(res.data.customer));

      setSuccess("Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h1 style={{ marginTop: 0 }}>Customer Register</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          style={input}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />

        <input
          style={input}
          name="username"
          type="text"
          placeholder="User Name"
          value={form.username}
          onChange={onChange}
          required
        />

        <input
          style={input}
          name="location"
          type="text"
          placeholder="Location"
          value={form.location}
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
          minLength={6}
        />

        <button style={btn} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <div style={msgError}>{error}</div>}
        {success && <div style={msgOk}>{success}</div>}
      </form>
    </div>
  );
}

const card = {
  maxWidth: 420,
  margin: "0 auto",
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

const msgOk = {
  padding: 12,
  borderRadius: 10,
  background: "#dcfce7",
  color: "#166534",
  fontWeight: 700,
};
