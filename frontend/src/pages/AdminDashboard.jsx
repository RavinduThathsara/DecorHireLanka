// frontend/src/pages/AdminDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome {admin?.email || "Admin"} 👋</p>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button style={btn} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={box}>
        <h3 style={{ marginTop: 0 }}>Next features we can add</h3>
        <ul>
          <li>Add Popular Decorations (CRUD)</li>
          <li>Upload Gallery photos</li>
          <li>View customer inquiries (Contact messages)</li>
        </ul>
      </div>
    </div>
  );
}

const btn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 800,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const box = {
  marginTop: 18,
  padding: 16,
  borderRadius: 14,
  border: "1px solid #eee",
  background: "white",
};
