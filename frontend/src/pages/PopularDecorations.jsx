// frontend/src/pages/PopularDecorations.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";

export default function PopularDecorations() {
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/decorations"); // public active list
        setDecorations(res.data.decorations || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load decorations.");
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
          <h1 style={{ margin: 0 }}>Popular Wedding Decorations</h1>
          <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.6 }}>
            Choose a package, or contact us to customize your own wedding theme.
          </p>
        </div>

        <Link
            to={`/book?id=${encodeURIComponent(d._id)}&title=${encodeURIComponent(d.title)}`}
            style={btnLight}
>
             Book Now
</Link>

      </div>

      {loading && <p>Loading decorations...</p>}
      {error && <div style={msgError}>{error}</div>}

      {!loading && !error && decorations.length === 0 && (
        <div style={note}>
          No decorations added yet. (Admin: add decorations from{" "}
          <strong>/admin/decorations</strong>)
        </div>
      )}

      <div style={grid}>
        {decorations.map((d) => (
          <div key={d._id} style={card}>
            {d.tag ? <div style={tag}>{d.tag}</div> : null}

            {/* Image placeholder (we'll add image upload later) */}
            <div style={imgBox}>
              <div style={{ fontWeight: 900 }}>Photo Placeholder</div>
              <div style={{ marginTop: 6, color: "#6b7280", fontSize: 13 }}>
                Upload decoration image later
              </div>
            </div>

            <h3 style={title}>{d.title}</h3>
            <p style={desc}>{d.description}</p>

            <div style={bottomRow}>
              <span style={price}>{d.priceFrom}</span>
              <Link to="/contact" style={btnLight}>
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div style={note}>
        <strong>Note:</strong> Prices depend on location, hall size, flower type, and customization.
        Contact us to get the best package for your wedding date.
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
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
  position: "relative",
};

const tag = {
  position: "absolute",
  top: 12,
  right: 12,
  background: "#111827",
  color: "white",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
};

const imgBox = {
  borderRadius: 14,
  border: "1px dashed #d1d5db",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  padding: 14,
  minHeight: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const title = { marginTop: 12, marginBottom: 0, fontSize: 16, fontWeight: 900, color: "#111827" };

const desc = { marginTop: 8, color: "#4b5563", lineHeight: 1.6 };

const bottomRow = {
  marginTop: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const price = { fontWeight: 900, color: "#111827" };

const btnDark = {
  textDecoration: "none",
  padding: "12px 14px",
  borderRadius: 12,
  background: "#111827",
  color: "white",
  fontWeight: 900,
};

const btnLight = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 12,
  background: "#f3f4f6",
  color: "#111",
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
