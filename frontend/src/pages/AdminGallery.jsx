// frontend/src/pages/AdminGallery.jsx
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function AdminGallery() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const authHeader = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Upload form state
  const [uploadCategory, setUploadCategory] = useState("wedding");
  const [uploadIsActive, setUploadIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  // Filter state (client-side)
  const [filterCategory, setFilterCategory] = useState("ALL"); // ALL | wedding | birthday | other
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL | ACTIVE | HIDDEN

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/gallery/admin/all", { headers: authHeader });
      setItems(res.data.images || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please select an image.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("image", imageFile);
      fd.append("category", uploadCategory);
      fd.append("isActive", String(uploadIsActive));

      await api.post("/api/gallery/admin/upload", fd, {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      });

      setUploadCategory("wedding");
      setUploadIsActive(true);
      setImageFile(null);
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed.");
    }
  };

  const toggleActive = async (img) => {
    setError("");
    try {
      await api.put(
        `/api/gallery/admin/${img._id}`,
        { isActive: !img.isActive },
        { headers: authHeader }
      );
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await api.delete(`/api/gallery/admin/${id}`, { headers: authHeader });
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const updateCategory = async (img, nextCategory) => {
    setError("");
    try {
      await api.put(
        `/api/gallery/admin/${img._id}`,
        { category: nextCategory },
        { headers: authHeader }
      );
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
    }
  };

  const filteredItems = useMemo(() => {
    let list = items;
    if (filterCategory !== "ALL") {
      list = list.filter((img) => (img.category || "other") === filterCategory);
    }

    if (filterStatus === "ACTIVE") {
      list = list.filter((img) => img.isActive === true);
    } else if (filterStatus === "HIDDEN") {
      list = list.filter((img) => img.isActive === false);
    }

    return list;
  }, [items, filterCategory, filterStatus]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <div style={topRow}>
        <div>
          <h1 style={{ margin: 0 }}>Manage Gallery</h1>
          <p style={{ marginTop: 6, color: "#4b5563" }}>
            Upload photos and show them on the Gallery page.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/dashboard" style={btnLightLink}>Dashboard</Link>
          <Link to="/gallery" style={btnLightLink}>View Gallery Page</Link>
        </div>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Upload New Photo</h3>

        <form onSubmit={upload} style={{ display: "grid", gap: 12 }}>
          <select
            style={input}
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
          >
            <option value="wedding">Wedding Decoration</option>
            <option value="birthday">Birthday Decoration</option>
            <option value="other">Other Event Decoration</option>
          </select>

          <input
            style={input}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800 }}>
            <input
              type="checkbox"
              checked={uploadIsActive}
              onChange={(e) => setUploadIsActive(e.target.checked)}
            />
            Active (visible to customers)
          </label>

          <button style={btnDark} type="submit">Upload</button>

          {error && <div style={msgError}>{error}</div>}
        </form>
      </div>

      <div style={{ marginTop: 14 }}>
        <h3 style={{ margin: "10px 0" }}>Gallery Images</h3>

        <div style={filterBar}>
          <select
            style={filterSelect}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="wedding">Wedding Decoration</option>
            <option value="birthday">Birthday Decoration</option>
            <option value="other">Other Event Decoration</option>
          </select>

          <select
            style={filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="HIDDEN">Hidden</option>
          </select>

          <button
            type="button"
            style={btnLight}
            onClick={() => {
              setFilterCategory("ALL");
              setFilterStatus("ALL");
            }}
          >
            Clear
          </button>
        </div>

        <div style={{ color: "#6b7280", fontWeight: 800, marginTop: 10, fontSize: 13 }}>
          Showing {filteredItems.length} of {items.length} images
        </div>

        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && (
          <p style={{ color: "#6b7280" }}>No images yet. Upload your first photo above.</p>
        )}

        {!loading && items.length > 0 && filteredItems.length === 0 && (
          <p style={{ color: "#6b7280" }}>No images match your filters.</p>
        )}

        <div style={grid}>
          {filteredItems.map((img) => (
            <div key={img._id} style={tile}>
              <img
                src={`http://localhost:5000${img.imageUrl}`}
                alt={
                  img.title ||
                  ((img.category || "other") === "wedding"
                    ? "Wedding Decoration"
                    : (img.category || "other") === "birthday"
                      ? "Birthday Decoration"
                      : "Other Event Decoration")
                }
                style={thumb}
              />
              <div style={{ marginTop: 10, fontWeight: 900, color: "#111827" }}>
                {img.title ||
                  ((img.category || "other") === "wedding"
                    ? "Wedding Decoration"
                    : (img.category || "other") === "birthday"
                      ? "Birthday Decoration"
                      : "Other Event Decoration")}
              </div>
              <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                Category: {(img.category || "other") === "wedding"
                  ? "Wedding"
                  : (img.category || "other") === "birthday"
                    ? "Birthday"
                    : "Other"}{" "}
                • {img.isActive ? "Active" : "Hidden"}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                <select
                  style={filterSelect}
                  value={img.category || "other"}
                  onChange={(e) => updateCategory(img, e.target.value)}
                  aria-label="Select image category"
                >
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="other">Other</option>
                </select>
                <button style={btnLight} onClick={() => toggleActive(img)}>
                  {img.isActive ? "Hide" : "Show"}
                </button>
                <button style={btnDanger} onClick={() => remove(img._id)}>
                  Delete
                </button>
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

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const filterBar = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: 10,
};

const filterInput = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: 14,
  flex: "1 1 240px",
};

const filterSelect = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: 14,
  fontWeight: 800,
};

const tile = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 14,
  background: "white",
};

const thumb = {
  width: "100%",
  height: 160,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid #eee",
};

const input = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
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
