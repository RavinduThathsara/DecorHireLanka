// frontend/src/pages/Gallery.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/gallery");
        setImages(res.data.images || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={topBar}>
        <div>
          <h1 style={{ margin: 0 }}>Gallery</h1>
          <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.6 }}>
            Explore some of our wedding decoration work.
          </p>
        </div>

        <Link to="/contact" style={btnDark}>
          Book a Date
        </Link>
      </div>

      {loading && <p>Loading gallery...</p>}
      {error && <div style={msgError}>{error}</div>}

      {!loading && !error && images.length === 0 && (
        <div style={note}>
          No gallery photos yet. (Admin: upload from <strong>/admin/gallery</strong>)
        </div>
      )}

      <div style={grid}>
        {images.map((img) => (
          <div key={img._id} style={tile}>
            <img
              src={`http://localhost:5000${img.imageUrl}`}
              alt={img.title || "Gallery"}
              style={thumb}
            />
            <div style={{ marginTop: 10, fontWeight: 900, color: "#111827" }}>
              {img.title || "Sri Lankan Wedding Decoration"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "flex-end",
  marginBottom: 14,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const tile = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 14,
  background: "white",
};

const thumb = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid #eee",
};

const btnDark = {
  textDecoration: "none",
  padding: "12px 14px",
  borderRadius: 12,
  background: "#111827",
  color: "white",
  fontWeight: 900,
};

const note = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "#f9fafb",
  border: "1px solid #eee",
  color: "#374151",
  lineHeight: 1.6,
};

const msgError = {
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};
