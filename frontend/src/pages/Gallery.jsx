// frontend/src/pages/Gallery.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all"); // all | wedding | birthday | other

  // ✅ Images from public/gallery folder (add category)
  const images = [
    { id: 1, title: "Wedding Decoration 1", src: "/gallery/gallery1.png", category: "wedding" },
    { id: 2, title: "Wedding Decoration 2", src: "/gallery/gallery2.png", category: "wedding" },
    { id: 3, title: "Wedding Decoration 3", src: "/gallery/gallery3.png", category: "wedding" },
    { id: 4, title: "Wedding Decoration 4", src: "/gallery/gallery4.png", category: "wedding" },
    { id: 5, title: "Wedding Decoration 5", src: "/gallery/gallery5.png", category: "wedding" },
    { id: 6, title: "Wedding Decoration 6", src: "/gallery/gallery6.png", category: "wedding" },
    { id: 7, title: "Wedding Decoration 7", src: "/gallery/gallery7.png", category: "wedding" },

    { id: 8, title: "Birthday Decoration 8", src: "/gallery/gallery8.png", category: "birthday" },
    { id: 9, title: "Birthday Decoration 9", src: "/gallery/gallery9.png", category: "birthday" },

    { id: 10, title: "Wedding Decoration 10", src: "/gallery/gallery10.png", category: "wedding" },
    { id: 11, title: "Wedding Decoration 11", src: "/gallery/gallery11.png", category: "wedding" },
    { id: 12, title: "Wedding Decoration 12", src: "/gallery/gallery12.png", category: "wedding" },
    { id: 14, title: "OutDoor Decoration 14", src: "/gallery/gallery14.png", category: "OutDoor" },
    //{ id: 15, title: "Wedding Decoration 15", src: "/gallery/gallery15.png", category: "birthday" },
    //{ id: 16, title: "OutDoor Decoration 16", src: "/gallery/gallery16.png", category: "OutDoor Event" },



    // ✅ Add your "other event" photos like this:
    // { id: 10, title: "Other Event Decoration 10", src: "/gallery/gallery10.png", category: "other" },
  ];

  const filteredImages = useMemo(() => {
    if (activeFilter === "all") return images;
    return images.filter((img) => img.category === activeFilter);
  }, [activeFilter, images]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={topBar}>
        <div>
          <h1 style={{ margin: 0 }}>Gallery</h1>
          <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.6 }}>
            Explore our decoration work by category.
          </p>
        </div>

        <Link to="/contact" style={btnDark}>
          Book a Date
        </Link>
      </div>

      {/* ✅ Filters */}
      <div style={filterBar}>
        <button
          onClick={() => setActiveFilter("all")}
          style={activeFilter === "all" ? filterBtnActive : filterBtn}
        >
          All
        </button>

        <button
          onClick={() => setActiveFilter("wedding")}
          style={activeFilter === "wedding" ? filterBtnActive : filterBtn}
        >
          Wedding Decoration
        </button>

        <button
          onClick={() => setActiveFilter("birthday")}
          style={activeFilter === "birthday" ? filterBtnActive : filterBtn}
        >
          Birthday Decoration
        </button>

        <button
          onClick={() => setActiveFilter("other")}
          style={activeFilter === "other" ? filterBtnActive : filterBtn}
        >
          Other Event Decoration
        </button>
      </div>

      {/* ✅ Empty message based on filtered results */}
      {filteredImages.length === 0 && (
        <div style={note}>No gallery photos for this category yet.</div>
      )}

      <div style={grid}>
        {filteredImages.map((img) => (
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

const filterBar = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 14,
};

const filterBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "white",
  color: "#111827",
  fontWeight: 800,
  cursor: "pointer",
};

const filterBtnActive = {
  ...filterBtn,
  background: "#111827",
  border: "1px solid #111827",
  color: "white",
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
