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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const trimmed = value.trim();

    switch (name) {
      case "email": {
        if (!trimmed) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
        return "";
      }
      case "username": {
        if (!trimmed) return "Full name is required.";
        if (trimmed.length < 3) return "Full name must be at least 3 characters.";
        if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmed)) return "Full name can contain alphabets only.";
        return "";
      }
      case "phone": {
        if (!trimmed) return "Phone number is required.";
        if (!/^\+?[\d\s()-]+$/.test(trimmed)) {
          return "Phone number can contain digits, spaces, and + - ( ) only.";
        }
        const plusCount = (trimmed.match(/\+/g) || []).length;
        if (plusCount > 1 || (plusCount === 1 && !trimmed.startsWith("+"))) {
          return "Enter a valid phone number.";
        }
        const digits = trimmed.replace(/\D/g, "");
        const localDigits = digits.startsWith("94") && digits.length === 11 ? `0${digits.slice(2)}` : digits;
        const validPrefixes = ["070", "071", "072", "074", "075", "076", "077", "078"];

        if (localDigits.length !== 10) {
          return "Phone number must be exactly 10 digits.";
        }

        if (!validPrefixes.some((prefix) => localDigits.startsWith(prefix))) {
          return "Phone number start digits are invalid.";
        }

        return "";
      }
      case "location": {
        if (!trimmed) return "Location is required.";
        if (trimmed.length < 2) return "Location must be at least 2 characters.";
        return "";
      }
      case "password": {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Password must include letters and numbers.";
        return "";
      }
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
      const fieldError = validateField(name, value);
      setErrors((p) => ({ ...p, [name]: fieldError }));
    }
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: fieldError }));
  };

  const sanitizeForm = (values) => ({
    ...values,
    email: values.email.trim().toLowerCase(),
    username: values.username.trim(),
    phone: values.phone.trim(),
    location: values.location.trim(),
  });

  const getInputStyle = (name) => {
    if (!touched[name]) return input;
    return errors[name] ? { ...input, ...inputError } : { ...input, ...inputValid };
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

    const cleanedForm = sanitizeForm(form);

    try {
      setLoading(true);

      const res = await api.post("/api/customers/register", cleanedForm);

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
              pattern="[A-Za-z]+( [A-Za-z]+)*"
              title="Full name can contain alphabets only"
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
              pattern="\+?[0-9()\-\s]{10,20}"
              title="Use a valid Sri Lankan mobile number with 10 digits starting 070, 071, 072, 074, 075, 076, 077, or 078"
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
