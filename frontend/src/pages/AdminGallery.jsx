// frontend/src/pages/AdminGallery.jsx
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

const getGalleryImageSrc = (imageUrl) => {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const baseUrl = (api.defaults.baseURL || "").replace(/\/$/, "");
  const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  return `${baseUrl}${normalizedPath}`;
};

const getCategoryLabel = (category) => {
  if (category === "wedding") return "Wedding Decoration";
  if (category === "birthday") return "Birthday Decoration";
  return "Other Event Decoration";
};

export default function AdminGallery() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const authHeader = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [uploadCategory, setUploadCategory] = useState("wedding");
  const [uploadIsActive, setUploadIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

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

  const galleryCounts = useMemo(
    () => ({
      total: items.length,
      active: items.filter((img) => img.isActive).length,
      hidden: items.filter((img) => !img.isActive).length,
    }),
    [items]
  );

  return (
    <div style={pageShell}>
      <div style={topRow}>
        <div style={{ maxWidth: 650 }}>
          <div style={eyebrow}>Admin Gallery</div>
          <h1 style={pageTitle}>Manage Gallery</h1>
          <p style={pageSubtitle}>
            Upload photos and organize what customers see on the Gallery page.
          </p>

          <div style={statsRow}>
            <div style={statCard}>
              <div style={statNumber}>{galleryCounts.total}</div>
              <div style={statLabel}>Total Images</div>
            </div>
            <div style={statCard}>
              <div style={statNumber}>{galleryCounts.active}</div>
              <div style={statLabel}>Visible Now</div>
            </div>
            <div style={statCard}>
              <div style={statNumber}>{galleryCounts.hidden}</div>
              <div style={statLabel}>Hidden</div>
            </div>
          </div>
        </div>

        <div style={headerActionRow}>
          <Link to="/admin/dashboard" style={btnLightLink}>Dashboard</Link>
          <Link to="/gallery" style={btnLightLink}>View Gallery Page</Link>
        </div>
      </div>

      <div style={card}>
        <div style={sectionHead}>
          <div>
            <h3 style={sectionTitle}>Upload New Photo</h3>
            <p style={sectionCopy}>
              Add a new gallery image and choose whether it appears on the customer-facing page immediately.
            </p>
          </div>
          <div style={sectionBadge}>
            {imageFile ? "Ready to upload" : "Waiting for image"}
          </div>
        </div>

        <form onSubmit={upload} style={{ display: "grid", gap: 16 }}>
          <div style={fieldGroup}>
            <label style={fieldLabel}>Decoration category</label>
            <select
              style={input}
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              <option value="wedding">Wedding Decoration</option>
              <option value="birthday">Birthday Decoration</option>
              <option value="other">Other Event Decoration</option>
            </select>
          </div>

          <div style={fieldGroup}>
            <label style={fieldLabel}>Choose image file</label>
            <input
              style={input}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <div style={fileHint}>
              {imageFile ? imageFile.name : "Accepted formats: PNG, JPG, WEBP"}
            </div>
          </div>

          <label style={toggleRow}>
            <input
              type="checkbox"
              checked={uploadIsActive}
              onChange={(e) => setUploadIsActive(e.target.checked)}
            />
            <span style={{ display: "grid", gap: 2 }}>
              <span>Active visibility</span>
              <span style={toggleHint}>
                Show this image to customers after upload.
              </span>
            </span>
          </label>

          <button style={btnDark} type="submit">Upload</button>

          {error && <div style={msgError}>{error}</div>}
        </form>
      </div>

      <div style={gallerySection}>
        <div style={galleryHeader}>
          <div>
            <h3 style={sectionTitle}>Gallery Images</h3>
            <p style={sectionCopy}>
              Review, filter, hide, or recategorize the photos already in your gallery.
            </p>
          </div>
          <div style={galleryCountPill}>
            Showing {filteredItems.length} of {items.length} images
          </div>
        </div>

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
            <option value="ALL">All Visibility</option>
            <option value="ACTIVE">Visible</option>
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

        {loading && <p style={{ color: "#6b7280", marginTop: 16 }}>Loading...</p>}
        {!loading && items.length === 0 && (
          <p style={{ color: "#6b7280", marginTop: 16 }}>
            No images yet. Upload your first photo above.
          </p>
        )}

        {!loading && items.length > 0 && filteredItems.length === 0 && (
          <p style={{ color: "#6b7280", marginTop: 16 }}>
            No images match your filters.
          </p>
        )}

        <div style={grid}>
          {filteredItems.map((img) => (
            <div key={img._id} style={tile}>
              <div style={thumbWrap}>
                <img
                  src={getGalleryImageSrc(img.imageUrl)}
                  alt={img.title || getCategoryLabel(img.category || "other")}
                  style={thumb}
                />
                <div style={img.isActive ? statusPillActive : statusPillHidden}>
                  {img.isActive ? "Visible" : "Hidden"}
                </div>
              </div>

              <div style={tileTitle}>
                {img.title || getCategoryLabel(img.category || "other")}
              </div>

              <div style={metaRow}>
                <span style={categoryChip}>
                  {(img.category || "other") === "wedding"
                    ? "Wedding"
                    : (img.category || "other") === "birthday"
                      ? "Birthday"
                      : "Other"}
                </span>
                <span style={metaDot}>/</span>
                <span>{img.isActive ? "Customer-facing" : "Not visible"}</span>
              </div>

              <div style={tileActions}>
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
                <button type="button" style={btnLight} onClick={() => toggleActive(img)}>
                  {img.isActive ? "Hide" : "Show"}
                </button>
                <button type="button" style={btnDanger} onClick={() => remove(img._id)}>
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

const pageShell = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "26px 22px 36px",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  flexWrap: "wrap",
  alignItems: "flex-start",
  marginBottom: 22,
};

const eyebrow = {
  marginBottom: 8,
  color: "#9b5d30",
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontWeight: 900,
  fontSize: 12,
};

const pageTitle = {
  margin: 0,
  color: "#14233b",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: "clamp(2.5rem, 4vw, 3.6rem)",
  lineHeight: 1,
};

const pageSubtitle = {
  marginTop: 10,
  color: "#5d6576",
  fontSize: 17,
  lineHeight: 1.7,
};

const statsRow = {
  display: "flex",
  gap: 14,
  flexWrap: "wrap",
  marginTop: 22,
};

const statCard = {
  minWidth: 120,
  padding: "14px 16px",
  borderRadius: 18,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(165, 116, 74, 0.16)",
  boxShadow: "0 12px 28px rgba(67, 37, 17, 0.05)",
};

const statNumber = {
  color: "#16233c",
  fontWeight: 900,
  fontSize: 24,
  lineHeight: 1,
};

const statLabel = {
  marginTop: 8,
  color: "#816956",
  fontSize: 13,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const headerActionRow = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "flex-start",
  paddingTop: 12,
};

const card = {
  border: "1px solid rgba(165, 116, 74, 0.14)",
  borderRadius: 28,
  padding: 22,
  background: "rgba(255, 255, 255, 0.96)",
  boxShadow: "0 18px 40px rgba(67, 37, 17, 0.08)",
};

const sectionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 18,
};

const sectionTitle = {
  margin: 0,
  color: "#14233b",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: 26,
  lineHeight: 1.05,
};

const sectionCopy = {
  margin: "8px 0 0",
  color: "#6b7280",
  fontSize: 15,
  lineHeight: 1.7,
  maxWidth: 620,
};

const sectionBadge = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "#f6ebe0",
  color: "#9b5d30",
  fontWeight: 900,
  fontSize: 13,
  letterSpacing: "0.04em",
};

const fieldGroup = {
  display: "grid",
  gap: 8,
};

const fieldLabel = {
  color: "#3d291c",
  fontSize: 14,
  fontWeight: 800,
};

const fileHint = {
  color: "#8b7a69",
  fontSize: 13,
  fontWeight: 700,
  marginTop: -2,
};

const toggleRow = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  fontWeight: 800,
  color: "#16233c",
};

const toggleHint = {
  color: "#7c8798",
  fontSize: 13,
  fontWeight: 600,
};

const gallerySection = {
  marginTop: 22,
};

const galleryHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 16,
  flexWrap: "wrap",
};

const galleryCountPill = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(165, 116, 74, 0.16)",
  color: "#5f6b7d",
  fontWeight: 800,
  fontSize: 13,
};

const filterBar = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: 16,
  marginBottom: 18,
};

const filterSelect = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #e7d9cb",
  outline: "none",
  fontSize: 14,
  fontWeight: 800,
  background: "#fffdf9",
  color: "#3d291c",
  minHeight: 48,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 18,
};

const tile = {
  border: "1px solid rgba(165, 116, 74, 0.14)",
  borderRadius: 24,
  padding: 16,
  background: "rgba(255, 255, 255, 0.98)",
  boxShadow: "0 18px 38px rgba(67, 37, 17, 0.08)",
};

const thumbWrap = {
  position: "relative",
};

const thumb = {
  width: "100%",
  height: 200,
  objectFit: "cover",
  borderRadius: 20,
  border: "1px solid rgba(165, 116, 74, 0.16)",
};

const statusPillActive = {
  position: "absolute",
  top: 12,
  right: 12,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(233, 250, 239, 0.96)",
  color: "#1f7a46",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.04em",
};

const statusPillHidden = {
  position: "absolute",
  top: 12,
  right: 12,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255, 241, 242, 0.96)",
  color: "#b42318",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.04em",
};

const tileTitle = {
  marginTop: 14,
  fontWeight: 900,
  color: "#111827",
  fontSize: 22,
  lineHeight: 1.15,
};

const metaRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 10,
  color: "#6b7280",
  fontSize: 13,
  fontWeight: 700,
};

const categoryChip = {
  padding: "7px 11px",
  borderRadius: 999,
  background: "#f7eee4",
  color: "#9b5d30",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const metaDot = {
  color: "#b39678",
  fontWeight: 900,
};

const tileActions = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 14,
};

const input = {
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #e7d9cb",
  outline: "none",
  fontSize: 16,
  background: "#fffdf9",
  color: "#2f2118",
  minHeight: 54,
};

const btnDark = {
  padding: "14px 16px",
  borderRadius: 16,
  border: "none",
  fontWeight: 900,
  background: "linear-gradient(135deg, #1b2538 0%, #131b2b 100%)",
  color: "white",
  cursor: "pointer",
  minHeight: 52,
  boxShadow: "0 16px 28px rgba(17, 24, 39, 0.18)",
};

const btnLight = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #e7d9cb",
  fontWeight: 900,
  background: "#fffaf4",
  color: "#3d291c",
  cursor: "pointer",
  minHeight: 48,
};

const btnDanger = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #fecaca",
  fontWeight: 900,
  background: "#fee2e2",
  color: "#991b1b",
  cursor: "pointer",
  minHeight: 48,
};

const btnLightLink = {
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: 16,
  border: "1px solid #e7d9cb",
  fontWeight: 900,
  background: "rgba(255, 255, 255, 0.92)",
  color: "#16233c",
  boxShadow: "0 10px 24px rgba(67, 37, 17, 0.08)",
};

const msgError = {
  padding: 12,
  borderRadius: 14,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};
