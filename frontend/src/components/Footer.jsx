// frontend/src/components/Footer.jsx
import { Link } from "react-router-dom";
import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: "#211611", color: "#e5e7eb", marginTop: 30 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32,
          }}
        >
          {/* About */}
          <div style={{ paddingRight: "20px" }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "white", fontWeight: 700 }}>
              Sri Lankan Wedding Decoration
            </h3>
            <p style={{ marginTop: 16, color: "#cbd5e1", lineHeight: 1.6, fontSize: 14 }}>
              We create beautiful wedding decorations in Sri Lanka — traditional and modern
              setups for Poruwa, reception halls, homecomings, and outdoor events.
            </p>
            <p style={{ marginTop: 12, color: "#cbd5e1", fontSize: 14 }}>
              <strong style={{ color: "white" }}>Service Areas:</strong> badulla, passara,
              monaragala & bibila (on request).
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: "white", fontWeight: 700 }}>Quick Links</h3>
            <div style={{ marginTop: 16, display: "grid", gap: 12, fontSize: 15 }}>
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
            <h3 style={{ margin: 0, fontSize: 16, color: "white", fontWeight: 700 }}>Contact</h3>
            <div style={{ marginTop: 16, display: "grid", gap: 12, color: "#cbd5e1", fontSize: 15 }}>
              <div>
                <strong style={{ color: "white" }}>Phone:</strong> <a href="tel:+94759070250" style={{ color: "#cbd5e1", textDecoration: "none" }}>+94 759070250</a>
              </div>
              <div>
                <strong style={{ color: "white" }}>WhatsApp:</strong> <a href="https://wa.me/94713187790" target="_blank" rel="noreferrer" style={{ color: "#cbd5e1", textDecoration: "none" }}>+94 713187790</a>
              </div>
              <div>
                <strong style={{ color: "white" }}>Email:</strong> <a href="mailto:ravinduthathsara38@gmail.com" style={{ color: "#cbd5e1", textDecoration: "none" }}>ravinduthathsara38@gmail.com</a>
              </div>
              <div>
                <strong style={{ color: "white" }}>Location:</strong> Sri Lanka
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: "white", fontWeight: 700 }}>Follow Us</h3>
            <div style={{ marginTop: 16, display: "grid", gap: 12, fontSize: 15 }}>
              <a href="#" style={{ ...footerLink, display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
                Facebook
              </a>
              <a href="#" style={{ ...footerLink, display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                Instagram
              </a>
              <a href="#" style={{ ...footerLink, display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
                TikTok
              </a>
              <a href="#" style={{ ...footerLink, display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.896 0-7.605-.476c-.94-.266-1.684-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.104 4 12 4 12 4s5.896 0 7.605.476c.94.266 1.684 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
                </svg>
                YouTube
              </a>
            </div>
          </div>
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
