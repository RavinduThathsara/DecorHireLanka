import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/images/hero.png";
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
    <div className="home-page">
      <section className="home-hero home-surface">
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
            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.15)"
          }}
        >
        </div>
      </section>

      <section className="home-editorial home-surface">
        <div className="home-editorial-media">
          <img src={heroImg} alt="Wedding decoration concept preview" className="home-editorial-image" />
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

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <p className="home-section-kicker">Services</p>
            <h2>Designed to attract customers and impress guests</h2>
          </div>
          <p>
            Your home page now speaks more clearly about what you offer: wedding decoration,
            homecoming styling, and beautiful setups that people want to book.
          </p>
        </div>

        <div className="home-highlight-grid">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className="home-highlight-card home-animated-card"
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <span className="home-card-line" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
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
  );
}
