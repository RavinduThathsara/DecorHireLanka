import React from "react";
import { Link } from "react-router-dom";
import hero3Img from "../assets/images/hero3.png";

const services = [
    {
        id: 1,
        title: "Wedding Stage Decoration",
        description: "Traditional and modern poruwa setups with elegant backdrops, floral arrangements, and lighting that create a stunning focal point for your special day.",
        features: [
            "Custom poruwa designs",
            "Stage backdrop styling",
            "Floral arrangements",
            "Professional lighting setup",
            "Theme coordination"
        ],
        icon: "💐"
    },
    {
        id: 2,
        title: "Homecoming Decoration",
        description: "Warm and romantic entrance decorations with welcome boards, floral arches, and beautiful lighting to make your first evening at home unforgettable.",
        features: [
            "Floral entrance arches",
            "Welcome boards",
            "Romantic lighting",
            "Photo-ready setups",
            "Personalized themes"
        ],
        icon: "🏠"
    },
    {
        id: 3,
        title: "Engagement Decoration",
        description: "Elegant and intimate setups that create the perfect atmosphere for your engagement celebration with beautiful backdrops and coordinated styling.",
        features: [
            "Intimate stage setups",
            "Backdrop designs",
            "Table decorations",
            "Floral centerpieces",
            "Color coordination"
        ],
        icon: "💍"
    },
    {
        id: 4,
        title: "Birthday & Events",
        description: "Fun and creative decorations for birthdays, anniversaries, and special celebrations tailored to your theme and venue requirements.",
        features: [
            "Theme-based decorations",
            "Balloon arrangements",
            "Backdrop setups",
            "Table styling",
            "Custom props"
        ],
        icon: "🎉"
    },
    {
        id: 5,
        title: "Reception Decoration",
        description: "Complete venue transformation with ceiling work, table styling, and coordinated color plans that make your reception feel elegant and complete.",
        features: [
            "Ceiling decorations",
            "Table arrangements",
            "Entrance styling",
            "Photo booth setups",
            "Full venue coordination"
        ],
        icon: "🎊"
    },
    {
        id: 6,
        title: "Corporate Events",
        description: "Professional and sophisticated decorations for corporate functions, product launches, and business celebrations that reflect your brand.",
        features: [
            "Brand-aligned themes",
            "Stage setups",
            "Professional backdrops",
            "Registration area styling",
            "Event signage"
        ],
        icon: "🏢"
    }
];

const process = [
    {
        step: "01",
        title: "Consultation",
        description: "Discuss your event details, theme preferences, venue, and budget with our team."
    },
    {
        step: "02",
        title: "Design Planning",
        description: "We create a customized decoration plan that matches your vision and venue requirements."
    },
    {
        step: "03",
        title: "Confirmation",
        description: "Review the design, finalize details, and confirm your booking with us."
    },
    {
        step: "04",
        title: "Setup & Execution",
        description: "Our team handles complete setup on your event day, ensuring everything looks perfect."
    }
];

export default function Services() {
    return (
        <div style={pageWrap}>
            {/* Hero Section */}
            <section style={hero}>
                <div style={heroContent}>
                    <p style={eyebrow}>Our Services</p>
                    <h1 style={heroTitle}>Professional Decoration Services for Every Celebration</h1>
                    <p style={heroText}>
                        From weddings to birthdays, we create stunning decorations that make your special moments unforgettable.
                        Each service is tailored to your vision, venue, and budget.
                    </p>
                    <div style={heroActions}>
                        <Link to="/contact" style={btnPrimary}>
                            Get a Quote
                        </Link>
                        <Link to="/gallery" style={btnSecondary}>
                            View Our Work
                        </Link>
                    </div>
                </div>
                <div style={heroImageContainer}>
                    <img src={hero3Img} alt="Decoration Services" style={heroImageStyle} />
                </div>
            </section>

            {/* Services Grid */}
            <section style={section}>
                <div style={sectionHeader}>
                    <p style={kicker}>What We Offer</p>
                    <h2 style={sectionTitle}>Complete Decoration Solutions</h2>
                    <p style={sectionText}>
                        Professional decoration services designed to transform your venue and create memorable experiences for you and your guests.
                    </p>
                </div>

                <div style={servicesGrid}>
                    {services.map((service) => (
                        <article key={service.id} style={serviceCard}>
                            <div style={serviceIcon}>{service.icon}</div>
                            <h3 style={serviceTitle}>{service.title}</h3>
                            <p style={serviceDesc}>{service.description}</p>

                            <div style={featuresList}>
                                {service.features.map((feature, idx) => (
                                    <div key={idx} style={featureItem}>
                                        <span style={checkmark}>✓</span>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section style={{ ...section, ...surfaceBg }}>
                <div style={sectionHeader}>
                    <p style={kicker}>How It Works</p>
                    <h2 style={sectionTitle}>Simple Booking Process</h2>
                    <p style={sectionText}>
                        We make it easy to plan and book your decoration service in just four simple steps.
                    </p>
                </div>

                <div style={processGrid}>
                    {process.map((item) => (
                        <article key={item.step} style={processCard}>
                            <div style={stepNumber}>{item.step}</div>
                            <h3 style={processTitle}>{item.title}</h3>
                            <p style={processDesc}>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={ctaSection}>
                <div style={ctaContent}>
                    <h2 style={ctaTitle}>Ready to Make Your Event Special?</h2>
                    <p style={ctaText}>
                        Contact us today to discuss your decoration needs. Our team is ready to help you create a beautiful and memorable event.
                    </p>
                    <div style={ctaActions}>
                        <Link to="/contact" style={btnPrimary}>
                            Contact Us Now
                        </Link>
                        <Link to="/book" style={btnSecondary}>
                            Book Decoration
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* Styles */
const pageWrap = {
    minHeight: "100vh",
    background: "white",
};

const hero = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "60px 20px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "40px",
};

const heroContent = {
    flex: "1 1 400px",
    maxWidth: 600,
};

const eyebrow = {
    fontSize: 14,
    fontWeight: 900,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 12,
};

const heroTitle = {
    fontSize: 42,
    fontWeight: 900,
    color: "#111827",
    lineHeight: 1.2,
    marginBottom: 16,
};

const heroText = {
    fontSize: 18,
    color: "#4b5563",
    lineHeight: 1.6,
    marginBottom: 32,
};

const heroActions = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
};

const heroImageContainer = {
    flex: "1 1 400px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    display: "flex",
};

const heroImageStyle = {
    width: "100%",
    height: "100%",
    maxHeight: "450px",
    objectFit: "cover",
};

const section = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "60px 20px",
};

const surfaceBg = {
    background: "#f9fafb",
    maxWidth: "100%",
};

const sectionHeader = {
    textAlign: "center",
    maxWidth: 700,
    margin: "0 auto 48px",
};

const kicker = {
    fontSize: 14,
    fontWeight: 900,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 8,
};

const sectionTitle = {
    fontSize: 32,
    fontWeight: 900,
    color: "#111827",
    marginBottom: 12,
};

const sectionText = {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 1.6,
};

const servicesGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
};

const serviceCard = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 32,
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
};

const serviceIcon = {
    fontSize: 48,
    marginBottom: 16,
};

const serviceTitle = {
    fontSize: 20,
    fontWeight: 900,
    color: "#111827",
    marginBottom: 12,
};

const serviceDesc = {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 1.6,
    marginBottom: 20,
};

const featuresList = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
};

const featureItem = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    color: "#374151",
};

const checkmark = {
    color: "#10b981",
    fontWeight: 900,
    fontSize: 16,
};

const processGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 24,
};

const processCard = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 32,
    textAlign: "center",
};

const stepNumber = {
    fontSize: 36,
    fontWeight: 900,
    color: "#e5e7eb",
    marginBottom: 16,
};

const processTitle = {
    fontSize: 18,
    fontWeight: 900,
    color: "#111827",
    marginBottom: 12,
};

const processDesc = {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 1.6,
};

const ctaSection = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "60px 20px",
};

const ctaContent = {
    background: "#111827",
    borderRadius: 24,
    padding: "60px 40px",
    textAlign: "center",
};

const ctaTitle = {
    fontSize: 32,
    fontWeight: 900,
    color: "white",
    marginBottom: 16,
};

const ctaText = {
    fontSize: 18,
    color: "#d1d5db",
    lineHeight: 1.6,
    marginBottom: 32,
    maxWidth: 600,
    margin: "0 auto 32px",
};

const ctaActions = {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
};

const btnPrimary = {
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: 12,
    fontWeight: 900,
    background: "white",
    color: "#111827",
    display: "inline-block",
    transition: "transform 0.2s",
};

const btnSecondary = {
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: 12,
    fontWeight: 900,
    background: "transparent",
    color: "white",
    border: "2px solid white",
    display: "inline-block",
    transition: "transform 0.2s",
};
