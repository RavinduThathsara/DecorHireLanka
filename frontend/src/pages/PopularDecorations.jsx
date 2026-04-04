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
    <div className="popular-page" style={{ maxWidth: "100%", margin: 0, padding: 0, width: "100%" }}>
      {/* FULL SCREEN HERO SECTION */}
      <section style={{
        background: "#fdf8f0",
        width: "100%",
        padding: "clamp(40px, 5vw, 80px) clamp(20px, 8vw, 80px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "clamp(40px, 6vw, 80px)",
        alignItems: "center",
        marginBottom: "40px",
        boxSizing: "border-box",
        borderBottom: "1px solid rgba(0,0,0,0.05)"
      }}>
        {/* LEFT COLUMN */}
        <div>
          <p style={{
            color: "#9b5b34",
            textTransform: "uppercase",
            letterSpacing: "2.5px",
            fontSize: "0.85rem",
            fontWeight: "800",
            marginBottom: "20px"
          }}>
            Customer Favorite Packages
          </p>
          <h1 style={{
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: "900",
            color: "#1a1a1a",
            lineHeight: "1.1",
            letterSpacing: "-0.5px",
            marginTop: "0",
            marginBottom: "24px"
          }}>
            Popular Decoration Packages
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "40px",
            maxWidth: "600px"
          }}>
            This page now shows attractive decoration packages with real visuals,
            package direction, and customer-friendly details so visitors stay interested
            instead of seeing an empty screen.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "40px" }}>
            <Link to="/contact" style={{
              background: "#824b2b",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: "30px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "1rem",
              transition: "opacity 0.2s"
            }}>
              Contact to Book
            </Link>
            <Link to="/gallery" style={{
              background: "#fff",
              color: "#1a1a1a",
              padding: "16px 32px",
              borderRadius: "30px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "1rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.2s"
            }}>
              View More Images
            </Link>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["Wedding", "Reception", "Homecoming", "Outdoor Events"].map((label) => (
              <span key={label} style={{
                background: "#fff",
                color: "#444",
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "0.9rem",
                fontWeight: "600",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{
          background: "#362c28",
          borderRadius: "24px",
          padding: "clamp(30px, 4vw, 50px)",
          color: "#fff",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <h2 style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            marginBottom: "20px",
            color: "#fff",
            lineHeight: "1.3"
          }}>
            What customers want to see
          </h2>
          <p style={{
            color: "#d4cdc8",
            lineHeight: "1.7",
            fontSize: "1.05rem",
            marginBottom: "32px"
          }}>
            Strong images, clear package information, and easy next steps. This layout is built to
            make the page feel active and trustworthy.
          </p>
          <ul style={{
            listStyleType: "disc",
            paddingLeft: "20px",
            margin: "0",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <li style={{ paddingLeft: "8px" }}>Detailed decoration previews</li>
            <li style={{ paddingLeft: "8px" }}>Simple package pricing direction</li>
            <li style={{ paddingLeft: "8px" }}>Direct link for inquiry and booking</li>
          </ul>
        </div>
      </section>

      {/* REST OF PAGE CONTENT CENTERED AS NORMAL */}
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 20px" }}>
        <section className="popular-reasons" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "80px"
        }}>
          {customerReasons.map((reason) => (
            <article key={reason.title} style={{
              background: "#f8f9fa",
              padding: "32px",
              borderRadius: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "16px" }}>{reason.title}</h3>
              <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>{reason.text}</p>
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
