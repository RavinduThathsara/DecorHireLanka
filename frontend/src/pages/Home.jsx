import { Link } from "react-router-dom";
import heroImg from "../assets/images/hero2.png";
import hero1Img from "../assets/images/hero1.png";

const highlights = [
  {
    eyebrow: "Homecoming",
    title: "Homecoming Decoration",
    description:
      "Warm entrances, welcome boards, candlelight styling, and photo-ready details for your first evening at home.",
    points: ["Floral entrance styling", "Welcome board and name details", "Soft lighting and romantic accents"],
  },
  {
    eyebrow: "Wedding Stage",
    title: "Poruwa and Stage Styling",
    description:
      "Traditional and modern poruwa setups designed to match your theme, hall size, and family style.",
    points: ["Poruwa concept planning", "Stage backdrop and floral balance", "Theme-aligned fabrics and decor"],
  },
  {
    eyebrow: "Reception",
    title: "Reception Atmosphere",
    description:
      "Ceiling work, table styling, backdrops, and coordinated color plans that make the venue feel complete.",
    points: ["Ceiling and hall styling", "Table and cake area decor", "Color-coordinated finishing touches"],
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
  { src: "/gallery/gallery16.png", title: "Premium wedding stage" },
  { src: "/gallery/gallery4.png", title: "Reception table styling" },
  { src: "/gallery/gallery11.png", title: "Floral entrance highlight" },
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
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          minHeight: "700px",
          marginTop: "-20px",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${hero1Img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 1
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)",
              zIndex: 2
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 3,
            maxWidth: "1200px",
            padding: "0 clamp(20px, 6vw, 80px)",
            color: "#fff",
            textAlign: "left"
          }}
        >
          <p
            style={{
              fontSize: "clamp(12px, 1.2vw, 16px)",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "20px",
              fontWeight: "500",
              color: "#f5f5f5"
            }}
          >
            DecorHire Lanka
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 5.5vw, 72px)",
              lineHeight: "1.2",
              marginBottom: "24px",
              fontWeight: "300",
              fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
              maxWidth: "900px"
            }}
          >
            Customer-attracting wedding and homecoming decorations{" "}
            <i
              style={{
                color: "#d4af7a",
                fontStyle: "italic",
                fontWeight: "400",
                fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif'
              }}
            >
              that feel premium.
            </i>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 1.8vw, 22px)",
              lineHeight: "1.6",
              marginBottom: "50px",
              maxWidth: "700px",
              color: "#f5f5f5",
              fontWeight: "300"
            }}
          >
            We curate ethereal atmospheres for Sri Lanka's most prestigious celebrations, blending traditional heritage with modern editorial aesthetics.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "60px"
            }}
          >
            <Link
              to="/gallery"
              className="home-btn home-btn-primary"
              style={{
                padding: "16px 40px",
                fontSize: "16px",
                fontWeight: "500",
                backgroundColor: "#d4af7a",
                color: "#1a1a1a",
                border: "none",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                display: "inline-block"
              }}
            >
              View Album
            </Link>
            <Link
              to="/contact"
              className="home-btn home-btn-secondary"
              style={{
                padding: "16px 40px",
                fontSize: "16px",
                fontWeight: "500",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                display: "inline-block",
                backdropFilter: "blur(10px)"
              }}
            >
              Contact Us
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "30px",
              maxWidth: "900px"
            }}
          >
            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: "clamp(28px, 3vw, 42px)",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#fff"
                }}
              >
                100+
              </strong>
              <span
                style={{
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  color: "#e0e0e0",
                  fontWeight: "300"
                }}
              >
                Events styled with care
              </span>
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: "clamp(20px, 2vw, 28px)",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#d4af7a"
                }}
              >
                Wedding + Homecoming
              </strong>
              <span
                style={{
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  color: "#e0e0e0",
                  fontWeight: "300"
                }}
              >
                Traditional and modern concepts
              </span>
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: "clamp(20px, 2vw, 28px)",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#d4af7a"
                }}
              >
                Album-ready
              </strong>
              <span
                style={{
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  color: "#e0e0e0",
                  fontWeight: "300"
                }}
              >
                Decor planned to look strong in photos
              </span>
            </div>
          </div>
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
            borderTopLeftRadius: "24px",
            borderBottomLeftRadius: "24px",
            marginLeft: "0",
            minHeight: "450px"
          }}
        >
          <img src={heroImg} alt="Wedding decoration concept preview" className="home-editorial-image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <article className="home-editorial-copy">
          <p className="home-section-kicker">Article</p>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}>
            How the right decoration plan makes your event feel premium from the first minute
          </h2>
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
          <div className="home-services-shell">
            <div className="home-services-head">
              <div className="home-services-copy">
                <p
                  className="home-section-kicker"
                  style={{ color: "var(--accent)", letterSpacing: "2px" }}
                >
                  Our Core Services
                </p>
                <h2
                  className="home-services-copy__title"
                  style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
                >
                  Wedding and homecoming packages planned for easy booking
                </h2>
              </div>

              <div className="home-services-intro">
                <p>
                  Choose the setup you need for your wedding, poruwa, or homecoming. Each service
                  is planned around your venue, theme, and budget so you can book with confidence.
                </p>
                <div className="home-services-badges">
                  <span>Theme-matched styling</span>
                  <span>Photo-ready finishing</span>
                  <span>Clear booking direction</span>
                </div>
              </div>
            </div>

            <div
              className="home-services-grid"
              style={{ gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
            >
              {highlights.map((item, index) => (
                <article
                  key={item.title}
                  className="home-services-card home-animated-card"
                  style={{ animationDelay: `${index * 140}ms` }}
                >
                  <div className="home-services-card__top">
                    <div className="home-services-card__icon">
                      {index === 0 && (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      )}
                      {index === 1 && (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      )}
                      {index === 2 && (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                          <polyline points="2 17 12 22 22 17"></polyline>
                          <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span className="home-services-card__eyebrow">{item.eyebrow}</span>
                  </div>

                  <h3 className="home-services-card__title">{item.title}</h3>
                  <p className="home-services-card__body">{item.description}</p>

                  <ul className="home-services-card__list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <div className="home-services-card__footer">
                    <Link to="/services" className="home-services-card__link">
                      View service details
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section home-surface">
          <div className="home-section-heading home-story-heading">
            <div className="home-story-heading__content">
              <p className="home-section-kicker">Why Choose Us</p>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}>
                Decoration details that make your event feel complete
              </h2>
              <p className="home-story-heading__lead">
                Clear design planning, balanced styling, and photo-ready finishing help every part
                of your wedding or homecoming look elegant from the first welcome to the final
                photo.
              </p>
            </div>
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

        <section className="home-cta home-cta--centered">
          <div className="home-cta__content">
            <p className="home-section-kicker">Next Step</p>
            <h2>Plan a wedding or homecoming setup your guests will remember</h2>
            <p>
              Share your date, venue, and style with us, and we will guide you toward a decoration
              plan that feels elegant, organized, and ready for photos.
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
