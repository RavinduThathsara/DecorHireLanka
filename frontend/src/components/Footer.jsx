// frontend/src/components/Footer.jsx
import { Link } from "react-router-dom";
import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: "#0b1220", color: "#e5e7eb", marginTop: 30 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 22,
          }}
        >
          {/* About */}
          <div>
            <h3 style={{ margin: 0, fontSize: 18, color: "white" }}>
              Sri Lankan Wedding Decoration
            </h3>
            <p style={{ marginTop: 12, color: "#cbd5e1", lineHeight: 1.6 }}>
              We create beautiful wedding decorations in Sri Lanka — traditional and modern
              setups for Poruwa, reception halls, homecomings, and outdoor events.
            </p>
            <p style={{ marginTop: 12, color: "#cbd5e1" }}>
              <strong style={{ color: "white" }}>Service Areas:</strong> Colombo, Gampaha,
              Kalutara & islandwide (on request).
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: "white" }}>Quick Links</h3>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <Link style={footerLink} to="/">
                Home
              </Link>
              <Link style={footerLink} to="/popular">
                Popular Wedding Decoration
              </Link>
              <Link style={footerLink} to="/gallery">
                Gallery
              </Link>
              <Link style={footerLink} to="/contact">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: "white" }}>Contact</h3>
            <div style={{ marginTop: 12, display: "grid", gap: 10, color: "#cbd5e1" }}>
              <div>
                <strong style={{ color: "white" }}>Phone:</strong> +94 XX XXX XXXX
              </div>
              <div>
                <strong style={{ color: "white" }}>WhatsApp:</strong> +94 XX XXX XXXX
              </div>
              <div>
                <strong style={{ color: "white" }}>Email:</strong> yourbusiness@gmail.com
              </div>
              <div>
                <strong style={{ color: "white" }}>Location:</strong> Sri Lanka
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            marginTop: 26,
            paddingTop: 18,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          <span>© {new Date().getFullYear()} Sri Lankan Wedding Decoration. All rights reserved.</span>
          <span>Designed for your wedding business</span>
        </div>
      </div>
    </footer>
  );
}

const footerLink = {
  textDecoration: "none",
  color: "#cbd5e1",
  fontWeight: 600,
};
