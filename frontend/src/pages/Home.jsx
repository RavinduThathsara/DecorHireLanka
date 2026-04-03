import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/images/hero2.png";
import hero1Img from "../assets/images/hero1.png";

const highlights = [
  {
    title: "Homecoming Decoration",
    description:
      "Warm floral entrances, welcome boards, romantic lighting, and photo-ready details for your first evening at home.",
  },
  {
    title: "Poruwa and Stage Styling",
    description:
      "Traditional and modern setups designed to match your theme, hall size, and family style.",
  },
  {
    title: "Reception Atmosphere",
    description:
      "Ceiling work, table styling, backdrops, and coordinated color plans that make the venue feel complete.",
  },
];

const storyArticles = [
  {
    number: "01",
    title: "We shape the first impression",
    text: "A strong entrance, balanced florals, and clean lighting make guests feel the event before the ceremony begins.",
  },
  {
    number: "02",
    title: "Every corner becomes a photo spot",
    text: "We build layouts that look elegant from the stage, the aisle, the couple table, and the homecoming entrance.",
  },
  {
    number: "03",
    title: "Your theme stays consistent",
    text: "Colors, flowers, fabrics, and props are planned together so the full event feels polished instead of random.",
  },
];

const albumPhotos = [
  { src: "/gallery/gallery1.png", title: "Poruwa setup" },
  { src: "/gallery/gallery4.png", title: "Reception stage" },
  { src: "/gallery/gallery7.png", title: "Elegant floral frame" },
  { src: "/gallery/gallery10.png", title: "Luxury white theme" },
  { src: "/gallery/gallery12.png", title: "Hall detail" },
  { src: "/gallery/gallery14.png", title: "Outdoor decor" },
];

const planningPoints = [
  "Fast discussion for date, location, and budget",
  "Theme suggestions for wedding, homecoming, and reception",
  "Clear package direction before booking",
  "Design details shaped around your venue",
];

export default function Home() {
  return (
    <>
      <section
        className="home-hero home-surface"
        style={{
          width: "100%",
          maxWidth: "100vw",
          margin: "0",
          borderRadius: "0",
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
          padding: "clamp(30px, 4vw, 60px) clamp(20px, 6vw, 80px)",
          boxSizing: "border-box"
        }}
      >
        <div className="home-hero-copy">
          <p className="home-eyebrow">DecorHire Lanka</p>
          <h1 style={{ marginBottom: "20px", fontWeight: "normal" }}>
            Customer-attracting wedding and homecoming decorations <i style={{ color: "var(--accent-deep)", fontStyle: "italic", fontWeight: "normal" }}>that feel premium.</i>
          </h1>
          <p className="home-lead" style={{ marginBottom: "40px" }}>
            We curate ethereal atmospheres for Sri Lanka's most prestigious celebrations, blending traditional heritage with modern editorial aesthetics.
          </p>

          <div className="home-actions" style={{ marginBottom: "50px" }}>
            <Link to="/gallery" className="home-btn home-btn-primary">
              View Album
            </Link>
            <Link to="/contact" className="home-btn home-btn-secondary">
              Contact Us
            </Link>
          </div>

          <div className="home-stats">
            <div className="home-stat-card">
              <strong>100+</strong>
              <span>Events styled with care</span>
            </div>
            <div className="home-stat-card">
              <strong style={{ color: "var(--accent-deep)" }}>
                Wedding + Homecoming
              </strong>
              <span>Traditional and modern concepts</span>
            </div>
            <div className="home-stat-card">
              <strong style={{ color: "var(--accent-deep)" }}>
                Album-ready
              </strong>
              <span>Decor planned to look strong in photos</span>
            </div>
          </div>
        </div>

        <div
          className="home-hero-media"
          style={{
            position: "relative",
            height: "100%",
            minHeight: "700px",
            width: "100%",
            borderRadius: "24px",
            overflow: "hidden",
            backgroundImage: `url(${hero1Img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.15)",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0"
          }}
        >
        </div>
      </section>

      <section
        className="home-editorial home-surface"
        style={{
          width: "100%",
          maxWidth: "100vw",
          margin: "0",
          borderRadius: "0",
          borderLeft: "none",
          borderRight: "none",
          padding: "clamp(40px, 5vw, 80px) clamp(20px, 6vw, 80px)",
          boxSizing: "border-box",
          gap: "clamp(30px, 5vw, 60px)"
        }}
      >
        <div
          className="home-editorial-media"
          style={{
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
            marginLeft: "calc(-1 * clamp(20px, 6vw, 80px))", // pull image exactly to the left screen edge
            minHeight: "450px"
          }}
        >
          <img src={heroImg} alt="Wedding decoration concept preview" className="home-editorial-image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <article className="home-editorial-copy">
          <p className="home-section-kicker">Article</p>
          <h2>How the right decoration plan makes your event feel premium from the first minute</h2>
          <p>
            Guests decide the quality of an event in seconds. We plan lighting, floral zones,
            stage balance, and photo backgrounds as one complete design so your wedding or
            homecoming looks organized, elegant, and memorable.
          </p>
          <p>
            This section helps visitors quickly understand your style before they open the full
            gallery. It improves trust, keeps users on the page longer, and makes your contact
            button more likely to get clicks.
          </p>
          <div className="home-actions">
            <Link to="/gallery" className="home-btn home-btn-primary">
              See Design Ideas
            </Link>
            <Link to="/contact" className="home-btn home-btn-secondary">
              Plan My Event
            </Link>
          </div>
        </article>
      </section>

      <div className="home-page" style={{ paddingTop: "0" }}>
        <section className="home-section" style={{ padding: "40px 0" }}>
          <div className="home-section-heading" style={{ alignItems: "center", marginBottom: "40px" }}>
            <div style={{ flex: "1 1 400px" }}>
              <p className="home-section-kicker" style={{ color: "var(--accent)", letterSpacing: "2px" }}>Our Core Services</p>
              <h2 style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", letterSpacing: "-1px", margin: "10px 0 0 0" }}>Designed to attract customers and impress guests</h2>
            </div>
            <p style={{ flex: "1 1 400px", fontSize: "1.1rem", borderLeft: "4px solid var(--accent)", paddingLeft: "24px", margin: "0", color: "var(--muted)" }}>
              Your home page now speaks more clearly about what you offer: wedding decoration,
              homecoming styling, and beautiful setups that people want to book.
            </p>
          </div>

          <div className="home-highlight-grid" style={{ gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {highlights.map((item, index) => (
              <article
                key={item.title}
                className="home-highlight-card home-animated-card"
                style={{ 
                  animationDelay: `${index * 140}ms`,
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: "24px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(155, 91, 52, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.04)";
                }}
              >
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "rgba(155, 91, 52, 0.1)",
                  color: "var(--accent-deep)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px"
                }}>
                  {index === 0 && <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
                  {index === 1 && <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>}
                  {index === 2 && <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>}
                </div>
                <h3 style={{ fontSize: "1.45rem", marginBottom: "16px", color: "var(--ink)", fontWeight: "700" }}>{item.title}</h3>
                <p style={{ fontSize: "1.05rem", lineHeight: "1.6", color: "var(--muted)", margin: "0" }}>{item.description}</p>
                
                <div style={{ marginTop: "auto", paddingTop: "32px" }}>
                  <Link to="/services" style={{ color: "var(--accent-deep)", textDecoration: "none", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Learn more <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section home-surface">
          <div className="home-section-heading">
            <div>
              <p className="home-section-kicker">Story Articles</p>
              <h2>Animated article-style sections for a better home page</h2>
            </div>
            <p>
              These blocks explain your value in a more modern way and animate into view to keep the
              page feeling active.
            </p>
          </div>

          <div className="home-story-grid">
            {storyArticles.map((article, index) => (
              <article
                key={article.number}
                className="home-story-card home-animated-card"
                style={{ animationDelay: `${index * 180}ms` }}
              >
                <span className="home-story-number">{article.number}</span>
                <h3>{article.title}</h3>
                <p>{article.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-heading">
            <div>
              <p className="home-section-kicker">Album Preview</p>
              <h2>Your album photos are included on the home page</h2>
            </div>
            <Link to="/gallery" className="home-text-link">
              Open full gallery
            </Link>
          </div>

          <div className="home-album-grid">
            {albumPhotos.map((photo, index) => (
              <article
                key={photo.src}
                className={`home-album-card ${index === 0 ? "home-album-card-large" : ""}`}
              >
                <img src={photo.src} alt={photo.title} />
                <div className="home-album-caption">
                  <strong>{photo.title}</strong>
                  <span>DecorHire Lanka album</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section home-plan-grid">
          <div className="home-plan-panel home-surface">
            <p className="home-section-kicker">Why Customers Stay Interested</p>
            <h2>Simple, clear reasons to inquire</h2>
            <div className="home-plan-list">
              {planningPoints.map((point) => (
                <div key={point} className="home-plan-item">
                  <span>+</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="home-quote-panel">
            <p className="home-quote-mark">"</p>
            <p className="home-quote-text">
              Beautiful decoration is not only about flowers. It is about creating a feeling that
              makes guests stop, look, and remember the event.
            </p>
            <Link to="/popular" className="home-btn home-btn-primary">
              Explore Popular Decor
            </Link>
          </div>
        </section>

        <section className="home-cta">
          <div>
            <p className="home-section-kicker">Next Step</p>
            <h2>Need a stronger first impression for your business?</h2>
            <p>
              This home page now promotes your work better. Customers can quickly understand your
              services, view album photos, and move to contact or booking.
            </p>
          </div>
          <div className="home-actions">
            <Link to="/contact" className="home-btn home-btn-primary">
              Get a Quote
            </Link>
            <Link to="/book" className="home-btn home-btn-secondary">
              Book Decoration
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
