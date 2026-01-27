// frontend/src/pages/AdminDecorations.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api.js";

export default function AdminDecorations() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("adminToken"), []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceFrom: "",
    tag: "",
    isActive: true,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/decorations/admin/all", { headers: authHeader });
      setItems(res.data.decorations || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load decorations.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", description: "", priceFrom: "", tag: "", isActive: true });
  };

  const startEdit = (d) => {
    setEditingId(d._id);
    setForm({
      title: d.title || "",
      description: d.description || "",
      priceFrom: d.priceFrom || "",
      tag: d.tag || "",
      isActive: !!d.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!form.title || !form.description || !form.priceFrom) {
        setError("Title, Description, Price From are required.");
        return;
      }

      if (editingId) {
        await api.put(`/api/decorations/admin/${editingId}`, form, { headers: authHeader });
      } else {
        await api.post("/api/decorations/admin", form, { headers: authHeader });
      }

      resetForm();
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed.");
    }
  };

  const removeItem = async (id) => {
    setError("");
    try {
      await api.delete(`/api/decorations/admin/${id}`, { headers: authHeader });
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <div style={topRow}>
        <div>
          <h1 style={{ margin: 0 }}>Manage Popular Decorations</h1>
          <p style={{ marginTop: 6, color: "#4b5563" }}>
            Add, edit, delete decorations shown in “Popular Wedding Decorations”.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/dashboard" style={btnLightLink}>Dashboard</Link>
          <Link to="/popular" style={btnLightLink}>View Popular Page</Link>
        </div>
      </div>

      {/* Form */}
      <div style={card}>
        <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Decoration" : "Add New Decoration"}</h3>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            style={input}
            name="title"
            placeholder="Title (ex: White & Gold Luxury Theme)"
            value={form.title}
            onChange={onChange}
          />

          <textarea
            style={textarea}
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={onChange}
            rows={4}
          />

          <input
            style={input}
            name="priceFrom"
            placeholder='Price From (ex: "From LKR 150,000")'
            value={form.priceFrom}
            onChange={onChange}
          />

          <input
            style={input}
            name="tag"
            placeholder='Tag (optional) ex: "Best Seller"'
            value={form.tag}
            onChange={onChange}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800 }}>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            Active (visible to customers)
          </label>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btnDark} type="submit">
              {editingId ? "Update" : "Create"}
            </button>
            <button style={btnLight} type="button" onClick={resetForm}>
              Clear
            </button>
          </div>

          {error && <div style={msgError}>{error}</div>}
        </form>
      </div>

      {/* List */}
      <div style={{ marginTop: 14 }}>
        <h3 style={{ margin: "10px 0" }}>All Decorations</h3>

        {loading && <p>Loading...</p>}

        {!loading && items.length === 0 && (
          <p style={{ color: "#6b7280" }}>No decorations yet. Add your first one above.</p>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {items.map((d) => (
            <div key={d._id} style={listCard}>
              <div style={listTop}>
                <div>
                  <div style={{ fontWeight: 900, color: "#111827" }}>{d.title}</div>
                  <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                    {d.tag ? `Tag: ${d.tag} • ` : ""}{d.isActive ? "Active" : "Hidden"} • {d.priceFrom}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={btnLight} onClick={() => startEdit(d)}>Edit</button>
                  <button style={btnDanger} onClick={() => removeItem(d._id)}>Delete</button>
                </div>
              </div>

              <div style={{ marginTop: 10, color: "#374151", lineHeight: 1.6 }}>
                {d.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "flex-end",
  marginBottom: 14,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const listCard = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const listTop = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "baseline",
};

const input = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};

const textarea = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
  resize: "vertical",
};

const btnDark = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 900,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const btnLight = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
};

const btnDanger = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #fecaca",
  fontWeight: 900,
  background: "#fee2e2",
  color: "#991b1b",
  cursor: "pointer",
};

const btnLightLink = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
};

const msgError = {
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};
