import React, { useState } from "react";
import { api } from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/images/logo.png";

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const trimmed = value.trim();

    switch (name) {
      case "email":
        if (!trimmed) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
        return "";

      case "username":
        if (!trimmed) return "Full name is required.";
        if (trimmed.length < 3) return "Full name must be at least 3 characters.";
        if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmed)) return "Full name can contain alphabets only.";
        return "";

      case "phone": {
        if (!trimmed) return "Phone number is required.";
        if (!/^\+?[\d\s()-]+$/.test(trimmed)) return "Enter a valid phone number.";

        const digits = trimmed.replace(/\D/g, "");
        const localDigits = digits.startsWith("94") && digits.length === 11 ? `0${digits.slice(2)}` : digits;
        const validPrefixes = ["070", "071", "072", "074", "075", "076", "077", "078"];

        if (localDigits.length !== 10) return "Phone number must be exactly 10 digits.";
        if (!validPrefixes.some((prefix) => localDigits.startsWith(prefix))) return "Phone number start digits are invalid.";
        return "";
      }

      case "location":
        if (!trimmed) return "Location is required.";
        if (trimmed.length < 2) return "Location must be at least 2 characters.";
        return "";

      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Password must include letters and numbers.";
        return "";

      default:
        return "";
    }
  };

  const validateForm = (values) => {
    const nextErrors = {};
    Object.keys(values).forEach((field) => {
      const fieldError = validateField(field, values[field]);
      if (fieldError) nextErrors[field] = fieldError;
    });
    return nextErrors;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
    }
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const sanitizeForm = (values) => ({
    ...values,
    email: values.email.trim().toLowerCase(),
    username: values.username.trim(),
    phone: values.phone.trim(),
    location: values.location.trim(),
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.post("/api/customers/google", {
        credential: credentialResponse.credential,
      });

      loginCustomer({ token: res.data.token, customer: res.data.customer });
      setSuccess("Google sign-up successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      console.error("Google Register API Error:", err);
      setError(err?.response?.data?.message || "Google sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/customers/register", sanitizeForm(form));

      loginCustomer({ token: res.data.token, customer: res.data.customer });
      setSuccess("Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (name) => {
    if (!touched[name]) return input;
    return errors[name] ? { ...input, ...inputError } : { ...input, ...inputValid };
  };

  return (
    <div style={container}>
      <div style={card}>
        <div style={header}>
          <img src={logo} alt="DecorHire Lanka logo" style={headerLogo} />
          <h1 style={title}>Create Account</h1>
          <p style={subtitle}>Register to book decorations and manage your events</p>
        </div>

        <form onSubmit={onSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={label}>Email Address</label>
            <input
              style={getInputStyle("email")}
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={onChange}
              onBlur={onBlur}
              required
            />
            {touched.email && errors.email && <span style={fieldError}>{errors.email}</span>}
          </div>

          <div style={inputGroup}>
            <label style={label}>Full Name</label>
            <input
              style={getInputStyle("username")}
              name="username"
              type="text"
              placeholder="John Doe"
              value={form.username}
              onChange={onChange}
              onBlur={onBlur}
              required
            />
            {touched.username && errors.username && <span style={fieldError}>{errors.username}</span>}
          </div>

          <div style={inputGroup}>
            <label style={label}>Phone Number</label>
            <input
              style={getInputStyle("phone")}
              name="phone"
              type="tel"
              placeholder="+94 71 234 5678"
              value={form.phone}
              onChange={onChange}
              onBlur={onBlur}
              required
            />
            {touched.phone && errors.phone && <span style={fieldError}>{errors.phone}</span>}
          </div>

          <div style={inputGroup}>
            <label style={label}>Location</label>
            <input
              style={getInputStyle("location")}
              name="location"
              type="text"
              placeholder="Colombo, Sri Lanka"
              value={form.location}
              onChange={onChange}
              onBlur={onBlur}
              required
            />
            {touched.location && errors.location && <span style={fieldError}>{errors.location}</span>}
          </div>

          <div style={inputGroup}>
            <label style={label}>Password</label>
            <input
              style={getInputStyle("password")}
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={onChange}
              onBlur={onBlur}
              required
              minLength={6}
            />
            {touched.password && errors.password && <span style={fieldError}>{errors.password}</span>}
          </div>

          <button style={btn} disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          <div style={dividerWrap}>
            <span style={dividerLine} />
            <span style={dividerText}>or</span>
            <span style={dividerLine} />
          </div>

          <div style={googleSection}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-up failed.")}
              text="signup_with"
              width="416"
            />
          </div>

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

const headerLogo = {
  width: 74,
  height: "auto",
  display: "block",
  margin: "0 auto 14px",
};

const title = {
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  color: "#111827",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
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
};

const input = {
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: 15,
  color: "#111827",
  backgroundColor: "white",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const inputError = {
  border: "1px solid #dc2626",
  boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.12)",
};

const inputValid = {
  border: "1px solid #16a34a",
  boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)",
};

const fieldError = {
  marginTop: 2,
  fontSize: 13,
  color: "#b91c1c",
  fontWeight: 500,
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
  marginTop: 8,
};

const dividerWrap = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginTop: -4,
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
};