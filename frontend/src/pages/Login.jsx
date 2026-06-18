import React, { useState } from "react";
import { api } from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/images/logo.png";

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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.post("/api/customers/google", {
        credential: credentialResponse.credential,
      });

      loginCustomer({ token: res.data.token, customer: res.data.customer });
      setSuccess("Google login successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      console.error("Google Login API Error:", err);
      setError(err?.response?.data?.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const res = await api.post("/api/customers/login", form);

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
    <div style={pageWrap}>
      <div style={card}>
        <img src={logo} alt="DecorHire Lanka logo" style={headerLogo} />
        <h1 style={title}>Customer Login</h1>

        <form onSubmit={onSubmit} style={formStyle}>
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

          <div style={dividerWrap}>
            <span style={dividerLine} />
            <span style={dividerText}>or</span>
            <span style={dividerLine} />
          </div>

          <div style={googleSection}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed.")}
              text="signin_with"
              width="400"
              use_fedcm_for_prompt
            />
          </div>

          {error && <div style={msgError}>{error}</div>}
          {success && <div style={msgOk}>{success}</div>}
        </form>

        <p style={footerText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const pageWrap = {
  minHeight: "calc(100vh - 200px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
};

const card = {
  maxWidth: 520,
  width: "100%",
  margin: "0 auto",
  padding: 22,
  border: "1px solid #eee",
  borderRadius: 20,
  background: "white",
};

const headerLogo = {
  width: 74,
  height: "auto",
  display: "block",
  margin: "0 auto 14px",
};

const title = {
  marginTop: 0,
  marginBottom: 18,
  fontSize: 28,
  fontWeight: 800,
  color: "#111827",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
};

const formStyle = {
  display: "grid",
  gap: 14,
};

const input = {
  padding: "14px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};

const btn = {
  padding: "14px 14px",
  borderRadius: 14,
  border: "none",
  fontWeight: 800,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const dividerWrap = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginTop: 4,
};

const dividerLine = {
  flex: 1,
  height: 1,
  background: "#e5e7eb",
};

const dividerText = {
  color: "#9ca3af",
  fontSize: 13,
  fontWeight: 600,
};

const googleSection = {
  display: "flex",
  justifyContent: "center",
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

const footerText = {
  margin: "18px 0 0",
  textAlign: "center",
  color: "#6b7280",
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 700,
};