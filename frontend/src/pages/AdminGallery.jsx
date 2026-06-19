// frontend/src/pages/AdminGallery.jsx
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, resolveAssetUrl } from "../services/api.js";
import Swal from "sweetalert2";

const getGalleryImageSrc = (imageUrl) => {
  if (!imageUrl) return "";
  return resolveAssetUrl(imageUrl);
};

const getCategoryLabel = (category) => {
  if (category === "wedding") return "Wedding Decoration";
  if (category === "birthday") return "Birthday Decoration";
  if (category === "table") return "Table Decoration";
  if (category === "hall") return "Hall Decoration";
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
      Swal.fire({
        title: "Updated!",
        text: `Image ${!img.isActive ? "shown" : "hidden"} successfully.`,
        icon: "success",
        confirmButtonColor: "#9b5b34",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
      Swal.fire({
        title: "Error!",
        text: err?.response?.data?.message || "Update failed.",
        icon: "error",
        confirmButtonColor: "#9b5b34",
      });
    }
  };

  const remove = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9b5b34",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setError("");
    try {
      await api.delete(`/api/gallery/admin/${id}`, { headers: authHeader });
      fetchAll();
      Swal.fire({
        title: "Deleted!",
        text: "Gallery image has been deleted.",
        icon: "success",
        confirmButtonColor: "#9b5b34",
        timer: 2000,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
      Swal.fire({
        title: "Error!",
        text: err?.response?.data?.message || "Delete failed.",
        icon: "error",
        confirmButtonColor: "#9b5b34",
      });
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
      <div style={innerContainer}>
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

          <form onSubmit={upload} style={uploadForm}>
            <div style={uploadFieldsGrid}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Decoration category</label>
                <select
                  style={compactInput}
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                >
                  <option value="wedding">Wedding Decoration</option>
                  <option value="birthday">Birthday Decoration</option>
                  <option value="table">Table Decoration</option>
                  <option value="hall">Hall Decoration</option>
                  <option value="other">Other Event Decoration</option>
                </select>
              </div>

              <div style={fieldGroup}>
                <label style={fieldLabel}>Choose image file</label>
                <input
                  style={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <div style={fileHint}>
                  {imageFile ? imageFile.name : "Accepted formats: PNG, JPG, WEBP"}
                </div>
              </div>
            </div>

            <div style={uploadFooter}>
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
            </div>

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
              <option value="table">Table Decoration</option>
              <option value="hall">Hall Decoration</option>
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
                        : (img.category || "other") === "table"
                          ? "Table"
                          : (img.category || "other") === "hall"
                            ? "Hall"
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
                    <option value="table">Table</option>
                    <option value="hall">Hall</option>
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
    </div>
  );
}

const pageShell = {
  width: "100%",
  background: "linear-gradient(135deg, #fdf8f0 0%, #f9f2e8 100%)",
  minHeight: "100vh",
  paddingBottom: "60px",
};

const innerContainer = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "40px 20px",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  flexWrap: "wrap",
  alignItems: "flex-start",
  marginBottom: 32,
  paddingBottom: 28,
  borderBottom: "2px solid rgba(155, 91, 52, 0.1)",
};

const eyebrow = {
  marginBottom: 12,
  color: "#9b5b34",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  fontWeight: 700,
  fontSize: 13,
};

const pageTitle = {
  margin: 0,
  color: "#1a1a1a",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
  lineHeight: 1.1,
  fontWeight: "700",
};

const pageSubtitle = {
  marginTop: 12,
  color: "#6f645a",
  fontSize: "1.05rem",
  lineHeight: 1.7,
  fontWeight: "400",
};

const statsRow = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
  marginTop: 28,
};

const statCard = {
  minWidth: 140,
  padding: "20px 24px",
  borderRadius: 20,
  background: "#fff",
  border: "2px solid rgba(155, 91, 52, 0.1)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
};

const statNumber = {
  color: "#9b5b34",
  fontWeight: 800,
  fontSize: "2.5rem",
  lineHeight: 1,
  fontFamily: '"Playfair Display", serif',
};

const statLabel = {
  marginTop: 12,
  color: "#6f645a",
  fontSize: 14,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const headerActionRow = {
  display: "flex",
  gap: 14,
  flexWrap: "wrap",
  alignItems: "flex-start",
};

const card = {
  border: "none",
  borderRadius: 28,
  padding: 36,
  background: "#fff",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
  marginBottom: 32,
};

const sectionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 20,
  flexWrap: "wrap",
  marginBottom: 28,
  paddingBottom: 24,
  borderBottom: "2px solid #f5f5f5",
};

const sectionTitle = {
  margin: 0,
  color: "#1a1a1a",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: "1.75rem",
  lineHeight: 1.2,
  fontWeight: "700",
};

const sectionCopy = {
  margin: "10px 0 0",
  color: "#6f645a",
  fontSize: "1rem",
  lineHeight: 1.7,
  maxWidth: 620,
};

const sectionBadge = {
  padding: "12px 20px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #fdf8f0 0%, #f9f2e8 100%)",
  border: "2px solid rgba(155, 91, 52, 0.15)",
  color: "#9b5b34",
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: "0.3px",
};

const fieldGroup = {
  display: "grid",
  gap: 10,
};

const uploadForm = {
  display: "grid",
  gap: 20,
};

const uploadFieldsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 20,
};

const uploadFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
  paddingTop: 20,
  borderTop: "2px solid #f5f5f5",
};

const fieldLabel = {
  color: "#9b5b34",
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const fileHint = {
  color: "#9ca3af",
  fontSize: 13,
  fontWeight: 600,
  marginTop: 4,
};

const toggleRow = {
  display: "flex",
  alignItems: "flex-start",
  gap: 14,
  fontWeight: 700,
  color: "#1a1a1a",
  cursor: "pointer",
};

const toggleHint = {
  color: "#6f645a",
  fontSize: 14,
  fontWeight: 500,
};

const gallerySection = {
  marginTop: 32,
};

const galleryHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 20,
  flexWrap: "wrap",
  marginBottom: 24,
};

const galleryCountPill = {
  padding: "12px 20px",
  borderRadius: "24px",
  background: "#fff",
  border: "2px solid rgba(155, 91, 52, 0.1)",
  color: "#6f645a",
  fontWeight: 700,
  fontSize: 14,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
};

const filterBar = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "center",
  marginBottom: 24,
  padding: "20px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
};

const filterSelect = {
  padding: "14px 18px",
  borderRadius: 14,
  border: "2px solid #e5e7eb",
  outline: "none",
  fontSize: 14,
  fontWeight: 600,
  background: "#fff",
  color: "#1a1a1a",
  minHeight: 52,
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: 24,
};

const tile = {
  border: "none",
  borderRadius: 24,
  padding: 20,
  background: "#fff",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
};

const thumbWrap = {
  position: "relative",
  borderRadius: "18px",
  overflow: "hidden",
};

const thumb = {
  width: "100%",
  height: 240,
  objectFit: "cover",
  border: "none",
  display: "block",
};

const statusPillActive = {
  position: "absolute",
  top: 14,
  right: 14,
  padding: "10px 16px",
  borderRadius: "20px",
  background: "rgba(16, 185, 129, 0.95)",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
};

const statusPillHidden = {
  position: "absolute",
  top: 14,
  right: 14,
  padding: "10px 16px",
  borderRadius: "20px",
  background: "rgba(239, 68, 68, 0.95)",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
};

const tileTitle = {
  marginTop: 16,
  fontWeight: 700,
  color: "#1a1a1a",
  fontSize: "1.1rem",
  lineHeight: 1.3,
  fontFamily: '"Playfair Display", serif',
};

const metaRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 12,
  color: "#6f645a",
  fontSize: 13,
  fontWeight: 600,
};

const categoryChip = {
  padding: "8px 14px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #fdf8f0 0%, #f9f2e8 100%)",
  border: "1px solid rgba(155, 91, 52, 0.2)",
  color: "#9b5b34",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.3px",
  textTransform: "uppercase",
};

const metaDot = {
  color: "#d4af7a",
  fontWeight: 700,
};

const tileActions = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 18,
  paddingTop: 18,
  borderTop: "2px solid #f5f5f5",
};

const input = {
  padding: "16px 20px",
  borderRadius: 14,
  border: "2px solid #e5e7eb",
  outline: "none",
  fontSize: 15,
  background: "#fff",
  color: "#1a1a1a",
  minHeight: 56,
  fontWeight: 500,
  transition: "all 0.3s ease",
};

const compactInput = {
  ...input,
  minHeight: 52,
  padding: "14px 18px",
  fontSize: 15,
};

const fileInput = {
  ...compactInput,
  paddingTop: 12,
  paddingBottom: 12,
  fontSize: 14,
};

const btnDark = {
  padding: "16px 28px",
  borderRadius: 14,
  border: "none",
  fontWeight: 700,
  fontSize: "15px",
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  color: "white",
  cursor: "pointer",
  minHeight: 52,
  minWidth: 160,
  boxShadow: "0 6px 20px rgba(155, 91, 52, 0.3)",
  transition: "all 0.3s ease",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const btnLight = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  fontWeight: 700,
  fontSize: "14px",
  background: "#fff",
  color: "#4a443f",
  cursor: "pointer",
  minHeight: 48,
  transition: "all 0.3s ease",
};

const btnDanger = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "2px solid #fecaca",
  fontWeight: 700,
  fontSize: "14px",
  background: "#fee2e2",
  color: "#991b1b",
  cursor: "pointer",
  minHeight: 48,
  transition: "all 0.3s ease",
};

const btnLightLink = {
  textDecoration: "none",
  padding: "14px 24px",
  borderRadius: 14,
  border: "2px solid #e5e7eb",
  fontWeight: 700,
  fontSize: "14px",
  background: "#fff",
  color: "#4a443f",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  display: "inline-block",
};

const msgError = {
  padding: 18,
  borderRadius: 14,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 600,
  border: "2px solid #fecaca",
  fontSize: "15px",
};
