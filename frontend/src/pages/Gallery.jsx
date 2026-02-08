// frontend/src/pages/Gallery.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Gallery() {
  // ✅ Images from public/gallery folder
  const images = [
    { id: 1, title: "Wedding Decoration 1", src: "/gallery/gallery1.png" },
    { id: 2, title: "Wedding Decoration 2", src: "/gallery/gallery2.png" },
    { id: 3, title: "Wedding Decoration 3", src: "/gallery/gallery3.png" },
    { id: 4, title: "Wedding Decoration 4", src: "/gallery/gallery4.png" },
    { id: 5, title: "Wedding Decoration 5", src: "/gallery/gallery5.png" },
    { id: 6, title: "Wedding Decoration 6", src: "/gallery/gallery6.png" },
    { id: 7, title: "Wedding Decoration 7", src: "/gallery/gallery7.png" },
    { id: 8, title: "Birthday Decoration 8", src: "/gallery/gallery8.png" },


  ];

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

      {images.length === 0 && (
        <div style={note}>No gallery photos yet.</div>
      )}

      <div style={grid}>
        {images.map((img) => (
          <div key={img.id} style={tile}>
            <img src={img.src} alt={img.title} style={thumb} />
            <div style={{ marginTop: 10, fontWeight: 900, color: "#111827" }}>
              {img.title}
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
