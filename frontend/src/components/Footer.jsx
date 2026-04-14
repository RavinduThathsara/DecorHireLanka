// frontend/src/components/Footer.jsx
import { Link } from "react-router-dom";
import React from "react";
import facebookIcon from "../assets/images/facebook.png";
import instagramIcon from "../assets/images/instragram.png";
import tiktokIcon from "../assets/images/tiktok.png";
import youtubeIcon from "../assets/images/youtube.png";

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
                <img src={facebookIcon} alt="Facebook" style={{ width: 20, height: 20 }} />
                Facebook
              </a>
              <a href="#" style={{ ...footerLink, display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={instagramIcon} alt="Instagram" style={{ width: 20, height: 20 }} />
                Instagram
              </a>
              <a href="#" style={{ ...footerLink, display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={tiktokIcon} alt="TikTok" style={{ width: 20, height: 20 }} />
                TikTok
              </a>
              <a href="#" style={{ ...footerLink, display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={youtubeIcon} alt="YouTube" style={{ width: 20, height: 20 }} />
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
