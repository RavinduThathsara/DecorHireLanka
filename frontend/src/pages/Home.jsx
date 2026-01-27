// frontend/src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Hero */}
      <section style={heroWrap}>
        <div style={{ maxWidth: 560 }}>
          <h1 style={heroTitle}>Sri Lankan Wedding Decoration</h1>
          <p style={heroText}>
            Elegant Poruwa setups, reception hall decorations, homecoming designs,
            and outdoor wedding styling — traditional and modern wedding themes.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <Link to="/popular" style={btnDark}>
              View Popular Decorations
            </Link>
            <Link to="/contact" style={btnLight}>
              Contact Us
            </Link>
          </div>

          <div style={statsRow}>
            <div style={statCard}>
              <div style={statNum}>100+</div>
              <div style={statLabel}>Weddings Decorated</div>
            </div>
            <div style={statCard}>
              <div style={statNum}>Poruwa</div>
              <div style={statLabel}>Traditional + Modern</div>
            </div>
            <div style={statCard}>
              <div style={statNum}>Islandwide</div>
              <div style={statLabel}>On request</div>
            </div>
          </div>
        </div>

        {/* Hero image placeholder */}
        <div style={heroImageBox}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>
            Your Dream Wedding Setup
          </div>
          <div style={{ color: "#6b7280", lineHeight: 1.6 }}>
            Add your best wedding photo here later.
            <br />
            (We’ll create a real gallery & upload system soon.)
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ marginTop: 34 }}>
        <h2 style={sectionTitle}>Our Services</h2>
        <p style={sectionText}>
          Choose a package or customize any decoration theme for your wedding.
        </p>

        <div style={grid3}>
          <div style={serviceCard}>
            <h3 style={cardTitle}>Poruwa Decoration</h3>
            <p style={cardText}>
              Traditional Kandyan style Poruwa setups with floral and modern variations.
            </p>
          </div>

          <div style={serviceCard}>
            <h3 style={cardTitle}>Reception Hall Decoration</h3>
            <p style={cardText}>
              Stage backdrop, table centerpieces, lighting, entrance arch and more.
            </p>
          </div>

          <div style={serviceCard}>
            <h3 style={cardTitle}>Homecoming Decoration</h3>
            <p style={cardText}>
              Homecoming floral themes, walkway, welcome boards and custom styling.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section style={{ marginTop: 34 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={sectionTitle}>Featured Decorations</h2>
            <p style={sectionText}>Some popular wedding decoration styles customers love.</p>
          </div>
          <Link to="/popular" style={btnOutline}>
            See all
          </Link>
        </div>

        <div style={grid3}>
          <div style={featuredCard}>
            <div style={badge}>Popular</div>
            <h3 style={cardTitle}>White & Gold Luxury Theme</h3>
            <p style={cardText}>Elegant stage + florals + premium lighting.</p>
          </div>
          <div style={featuredCard}>
            <div style={badge}>Trending</div>
            <h3 style={cardTitle}>Traditional Kandyan Poruwa</h3>
            <p style={cardText}>Classic Sri Lankan style with rich colors.</p>
          </div>
          <div style={featuredCard}>
            <div style={badge}>New</div>
            <h3 style={cardTitle}>Outdoor Garden Wedding</h3>
            <p style={cardText}>Greenery, arches, candles, and soft lighting.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={cta}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Ready to plan your wedding decoration?</h2>
          <p style={{ marginTop: 8, marginBottom: 0, color: "#cbd5e1" }}>
            Send your date, location, and theme ideas. We will contact you quickly.
          </p>
        </div>
        <Link to="/contact" style={btnDark}>
          Get a Quote
        </Link>
      </section>
    </div>
  );
}

/* Styles */
const heroWrap = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 18,
  padding: 18,
  borderRadius: 18,
  border: "1px solid #eee",
  background: "white",
};

const heroTitle = { margin: 0, fontSize: 34, fontWeight: 900, color: "#111827" };
const heroText = { marginTop: 10, color: "#4b5563", lineHeight: 1.7 };

const heroImageBox = {
  borderRadius: 18,
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  border: "1px dashed #c7d2fe",
  padding: 18,
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const statsRow = {
  marginTop: 18,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
};

const statCard = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 12,
  background: "#fafafa",
};

const statNum = { fontSize: 18, fontWeight: 900, color: "#111827" };
const statLabel = { marginTop: 4, fontSize: 12, color: "#6b7280", fontWeight: 700 };

const sectionTitle = { margin: 0, fontSize: 22, fontWeight: 900, color: "#111827" };
const sectionText = { marginTop: 8, color: "#4b5563", lineHeight: 1.6 };

const grid3 = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const serviceCard = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const featuredCard = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
  position: "relative",
  overflow: "hidden",
};

const badge = {
  position: "absolute",
  top: 12,
  right: 12,
  background: "#111827",
  color: "white",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const cardTitle = { margin: 0, fontSize: 16, fontWeight: 900, color: "#111827" };
const cardText = { marginTop: 8, color: "#4b5563", lineHeight: 1.6 };

const cta = {
  marginTop: 34,
  borderRadius: 18,
  padding: 18,
  background: "#0b1220",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

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
  padding: "12px 14px",
  borderRadius: 12,
  background: "#f3f4f6",
  color: "#111",
  fontWeight: 900,
};

const btnOutline = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  color: "#111827",
  fontWeight: 900,
};
