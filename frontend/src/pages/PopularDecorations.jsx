import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";

const fallbackDecorations = [
  {
    _id: "sample-1",
    title: "White and Gold Luxury Reception",
    description:
      "A premium stage design with layered florals, warm lighting, and elegant table styling for a polished wedding reception.",
    priceFrom: "From LKR 185,000",
    tag: "Best Seller",
    imageUrl: "/gallery/gallery10.png",
    idealFor: "Grand hotel receptions and evening events",
    includes: ["Main stage backdrop", "Floral aisle details", "Couple table styling"],
  },
  {
    _id: "sample-2",
    title: "Traditional Poruwa Theme",
    description:
      "A balanced Sri Lankan poruwa setup that keeps the traditional feel while still looking refined and photo-ready.",
    priceFrom: "From LKR 160,000",
    tag: "Classic",
    imageUrl: "/gallery/gallery1.png",
    idealFor: "Families who want a cultural wedding look",
    includes: ["Poruwa styling", "Entrance florals", "Matching stage accents"],
  },
  {
    _id: "sample-3",
    title: "Homecoming Floral Entrance",
    description:
      "A romantic homecoming arrangement with soft colors, welcome details, and a warm arrival atmosphere for the couple.",
    priceFrom: "From LKR 95,000",
    tag: "Homecoming",
    imageUrl: "/gallery/gallery7.png",
    idealFor: "Home entrances, villas, and intimate venues",
    includes: ["Welcome board area", "Entrance framing", "Soft light decor touches"],
  },
  {
    _id: "sample-4",
    title: "Garden Wedding Experience",
    description:
      "An outdoor concept with greenery, floral arch work, and gentle lighting that keeps the venue natural and elegant.",
    priceFrom: "From LKR 210,000",
    tag: "Outdoor",
    imageUrl: "/gallery/gallery14.png",
    idealFor: "Open lawns, garden ceremonies, and sunset events",
    includes: ["Ceremony focal point", "Guest area accents", "Photo-zone styling"],
  },
];

const customerReasons = [
  {
    title: "Strong first impression",
    text: "Each setup is planned to make the entrance and main stage immediately attractive to guests.",
  },
  {
    title: "Photo-friendly details",
    text: "Design choices are made to look elegant in wide venue shots and close couple photos.",
  },
  {
    title: "Flexible package direction",
    text: "Customers can start with a popular concept and then adjust colors, flowers, and scale.",
  },
];

export default function PopularDecorations() {
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/decorations");
        setDecorations(res.data.decorations || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load decorations.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const displayDecorations = decorations.length
    ? decorations.map((item, index) => {
        const fallback = fallbackDecorations[index % fallbackDecorations.length];
        return {
          ...fallback,
          ...item,
          imageUrl: item.imageUrl || fallback.imageUrl,
        };
      })
    : fallbackDecorations;

  return (
    <div className="popular-page">
      <section className="popular-hero">
        <div>
          <p className="popular-kicker">Customer Favorite Packages</p>
          <h1>Popular wedding decorations with images, details, and stronger customer appeal</h1>
          <p className="popular-hero-text">
            This page now shows attractive decoration packages with real visuals, package direction,
            and customer-friendly details so visitors stay interested instead of seeing an empty
            screen.
          </p>

          <div className="popular-hero-actions">
            <Link to="/contact" className="popular-btn popular-btn-primary">
              Contact to Book
            </Link>
            <Link to="/gallery" className="popular-btn popular-btn-secondary">
              View More Images
            </Link>
          </div>

          <div className="popular-badges">
            <span>Wedding</span>
            <span>Reception</span>
            <span>Homecoming</span>
            <span>Outdoor Events</span>
          </div>
        </div>

        <div className="popular-side-card">
          <h2>What customers want to see</h2>
          <p>
            Strong images, clear package information, and easy next steps. This layout is built to
            make the page feel active and trustworthy.
          </p>
          <ul className="popular-side-list">
            <li>Detailed decoration previews</li>
            <li>Simple package pricing direction</li>
            <li>Direct link for inquiry and booking</li>
          </ul>
        </div>
      </section>

      <section className="popular-reasons">
        {customerReasons.map((reason) => (
          <article key={reason.title} className="popular-reason-card">
            <h3>{reason.title}</h3>
            <p>{reason.text}</p>
          </article>
        ))}
      </section>

      <div style={topBar}>
        <div>
          <h2 style={{ margin: 0, fontSize: 34 }}>Popular Decoration Packages</h2>
          <p style={{ marginTop: 8, color: "#6f645a", lineHeight: 1.7 }}>
            Choose a package, or contact us to customize your own wedding theme.
          </p>
        </div>

        <Link to="/contact" style={btnLight}>
          Contact to Book
        </Link>
      </div>

      {loading && <div style={msgInfo}>Loading packages...</div>}
      {error && <div style={msgError}>{error}</div>}

      {!loading && decorations.length === 0 && (
        <div style={msgInfo}>
          No admin decorations added yet. Showing attractive sample packages for customers now.
        </div>
      )}

      <div style={grid}>
        {displayDecorations.map((d) => (
          <div key={d._id} style={card}>
            {d.tag ? <div style={tag}>{d.tag}</div> : null}

            <img src={d.imageUrl} alt={d.title} style={cardImage} />

            <h3 style={title}>{d.title}</h3>
            <p style={desc}>{d.description}</p>

            <div style={detailBox}>
              <div style={detailLabel}>Ideal For</div>
              <div style={detailText}>
                {d.idealFor || "Custom wedding venues and decorated event spaces"}
              </div>
            </div>

            <div style={includesWrap}>
              {(d.includes || []).map((item) => (
                <span key={item} style={includeChip}>
                  {item}
                </span>
              ))}
            </div>

            <div style={bottomRow}>
              <span style={price}>{d.priceFrom}</span>
              <Link
                to={`/book?id=${encodeURIComponent(d._id)}&title=${encodeURIComponent(
                  d.title
                )}`}
                style={btnLight}
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div style={note}>
        <strong>Note:</strong> Prices depend on location, hall size, flower type, lighting, and
        customization. Add your own live packages from <strong>/admin/decorations</strong> and use
        image paths like <strong>/gallery/gallery1.png</strong> to show your real work here.
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
  gap: 18,
};

const card = {
  border: "1px solid rgba(102, 79, 58, 0.14)",
  borderRadius: 24,
  padding: 16,
  background: "rgba(255,255,255,0.8)",
  boxShadow: "0 20px 40px rgba(89, 49, 28, 0.08)",
  position: "relative",
};

const tag = {
  position: "absolute",
  top: 28,
  right: 28,
  background: "#1f1a17",
  color: "white",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
};

const cardImage = {
  width: "100%",
  height: 240,
  objectFit: "cover",
  display: "block",
  borderRadius: 18,
};

const title = {
  marginTop: 16,
  marginBottom: 0,
  fontSize: 20,
  fontWeight: 900,
  color: "#1f1a17",
};

const desc = {
  marginTop: 10,
  color: "#6f645a",
  lineHeight: 1.7,
};

const detailBox = {
  marginTop: 14,
  padding: 14,
  borderRadius: 16,
  background: "#f9f2e8",
  border: "1px solid rgba(155, 91, 52, 0.12)",
};

const detailLabel = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#7c4420",
};

const detailText = {
  marginTop: 6,
  color: "#4f433a",
  lineHeight: 1.6,
};

const includesWrap = {
  marginTop: 14,
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const includeChip = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "#fff7ef",
  border: "1px solid rgba(155, 91, 52, 0.14)",
  color: "#7c4420",
  fontSize: 13,
  fontWeight: 700,
};

const bottomRow = {
  marginTop: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const price = { fontWeight: 900, color: "#111827" };

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
  padding: 16,
  borderRadius: 20,
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(102, 79, 58, 0.14)",
  color: "#374151",
  lineHeight: 1.6,
};

const msgError = {
  padding: 12,
  borderRadius: 14,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
  marginBottom: 14,
};

const msgInfo = {
  padding: 12,
  borderRadius: 14,
  background: "#f9f2e8",
  color: "#7c4420",
  fontWeight: 700,
  marginBottom: 14,
};
