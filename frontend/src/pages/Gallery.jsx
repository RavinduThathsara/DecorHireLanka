// frontend/src/pages/Gallery.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, resolveAssetUrl } from "../services/api.js";

// Add animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInRight {
    from { 
      transform: translateX(100%);
      opacity: 0;
    }
    to { 
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  if (!document.head.querySelector('style[data-gallery-animations]')) {
    styleSheet.setAttribute('data-gallery-animations', 'true');
    document.head.appendChild(styleSheet);
  }
}

const showcaseImages = [
  { id: 1, title: "Wedding Decoration 1", src: "/gallery/gallery1.png", category: "wedding" },
  { id: 2, title: "Wedding Decoration 2", src: "/gallery/gallery2.png", category: "wedding" },
  { id: 3, title: "Wedding Decoration 3", src: "/gallery/gallery3.png", category: "wedding" },
  { id: 4, title: "Table Decoration 1", src: "/gallery/gallery4.png", category: "table" },
  { id: 5, title: "Wedding Decoration 5", src: "/gallery/gallery5.png", category: "wedding" },
  { id: 6, title: "Wedding Decoration 6", src: "/gallery/gallery6.png", category: "wedding" },
  { id: 7, title: "Wedding Decoration 7", src: "/gallery/gallery7.png", category: "wedding" },
  { id: 8, title: "Birthday Decoration 8", src: "/gallery/gallery8.png", category: "birthday" },
  { id: 9, title: "Birthday Decoration 9", src: "/gallery/gallery9.png", category: "birthday" },
  { id: 10, title: "Wedding Decoration 10", src: "/gallery/gallery10.png", category: "wedding" },
  { id: 11, title: "Wedding Decoration 11", src: "/gallery/gallery11.png", category: "wedding" },
  { id: 12, title: "Table Decoration 2", src: "/gallery/gallery12.png", category: "table" },
  { id: 14, title: "Other Event Decoration 14", src: "/gallery/gallery14.png", category: "other" },
  { id: 15, title: "Hall Decoration 1", src: "/gallery/gallery15.png", category: "hall" },
  { id: 16, title: "Hall Decoration 2", src: "/gallery/gallery16.png", category: "hall" },
];

const mergeGalleryImages = (apiImages = []) => {
  const bySource = new Set(
    apiImages.map((img) => img.imageUrl || img.src).filter(Boolean)
  );

  const missingShowcaseImages = showcaseImages.filter((img) => !bySource.has(img.src));
  return [...apiImages, ...missingShowcaseImages];
};

const getGalleryImageSrc = (img) => {
  if (img.imageUrl) {
    return resolveAssetUrl(img.imageUrl);
  }

  return img.src;
};

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState(showcaseImages);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchActiveGallery = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/gallery");
        setImages(mergeGalleryImages(res.data.images || []));
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load gallery.");
        setImages(showcaseImages);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage]);

  const filteredImages = useMemo(() => {
    let filtered = images;

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter((img) => (img.category || "other").toLowerCase() === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((img) =>
        (img.title || "").toLowerCase().includes(query) ||
        (img.category || "").toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeFilter, images, searchQuery]);

  const categoryLabel = (category) => {
    const c = (category || "other").toLowerCase();
    if (c === "wedding") return "Wedding Decoration";
    if (c === "birthday") return "Birthday Decoration";
    if (c === "table") return "Table Decoration";
    if (c === "hall") return "Hall Decoration";
    return "Other Event Decoration";
  };

  return (
    <div style={{ width: "100%", background: "#fdf8f0", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* IMAGE DETAIL MODAL/SIDEBAR */}
      {selectedImage && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedImage(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 9998,
              animation: "fadeIn 0.3s ease"
            }}
          />

          {/* Sidebar Panel */}
          <div style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "90%",
            maxWidth: "600px",
            height: "100vh",
            background: "#fff",
            boxShadow: "-8px 0 40px rgba(0, 0, 0, 0.3)",
            zIndex: 9999,
            overflowY: "auto",
            animation: "slideInRight 0.4s ease"
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(0, 0, 0, 0.7)",
                color: "#fff",
                fontSize: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#9b5b34";
                e.target.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(0, 0, 0, 0.7)";
                e.target.style.transform = "rotate(0deg)";
              }}
            >
              ×
            </button>

            {/* Image Section */}
            <div style={{
              position: "relative",
              width: "100%",
              height: "400px",
              background: "#f5f5f5",
              overflow: "hidden"
            }}>
              <img
                src={getGalleryImageSrc(selectedImage)}
                alt={selectedImage.title || categoryLabel(selectedImage.category)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />

              {/* Category Badge */}
              <div style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                background: "rgba(155, 91, 52, 0.95)",
                color: "#fff",
                padding: "8px 20px",
                borderRadius: "25px",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                backdropFilter: "blur(10px)"
              }}>
                {(selectedImage.category || "other").replace(/^\w/, c => c.toUpperCase())}
              </div>
            </div>

            {/* Details Section */}
            <div style={{ padding: "40px 30px" }}>
              <h2 style={{
                margin: "0 0 16px 0",
                fontSize: "2rem",
                fontWeight: "700",
                color: "#1a1a1a",
                fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
                lineHeight: "1.2"
              }}>
                {selectedImage.title || categoryLabel(selectedImage.category)}
              </h2>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "32px",
                paddingBottom: "24px",
                borderBottom: "2px solid #f0f0f0"
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#9b5b34"
                }}></div>
                <span style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#9b5b34",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {categoryLabel(selectedImage.category)}
                </span>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: "12px",
                  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  About This Decoration
                </h3>
                <p style={{
                  color: "#6f645a",
                  lineHeight: "1.8",
                  fontSize: "15px"
                }}>
                  {selectedImage.description || `Beautiful ${categoryLabel(selectedImage.category).toLowerCase()} design featuring elegant elements, carefully curated colors, and premium styling. Perfect for creating memorable moments at your special event.`}
                </p>
              </div>

              {/* Features */}
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: "16px",
                  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Key Features
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["Premium quality materials", "Professional setup included", "Customizable color schemes", "Photo-ready presentation"].map((feature) => (
                    <div key={feature} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9b5b34" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span style={{
                        color: "#4a443f",
                        fontSize: "15px",
                        fontWeight: "500"
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal For */}
              <div style={{
                background: "linear-gradient(135deg, #fdf8f0 0%, #f9f2e8 100%)",
                padding: "24px",
                borderRadius: "16px",
                border: "2px solid rgba(155, 91, 52, 0.1)",
                marginBottom: "32px"
              }}>
                <h3 style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#9b5b34",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Ideal For
                </h3>
                <p style={{
                  color: "#4a443f",
                  lineHeight: "1.6",
                  fontSize: "15px",
                  margin: "0",
                  fontWeight: "500"
                }}>
                  {selectedImage.category === "wedding" && "Grand weddings, receptions, and formal celebrations"}
                  {selectedImage.category === "birthday" && "Birthday parties, milestone celebrations, and special occasions"}
                  {selectedImage.category === "table" && "Elegant dining setups, receptions, and banquet events"}
                  {selectedImage.category === "hall" && "Large venue decorations, hall transformations, and spacious events"}
                  {selectedImage.category === "other" && "Corporate events, launches, and various special occasions"}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
              }}>
                <Link
                  to="/contact"
                  style={{
                    flex: "1 1 auto",
                    textDecoration: "none",
                    padding: "16px 28px",
                    borderRadius: "12px",
                    background: "#9b5b34",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "15px",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(155, 91, 52, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                >
                  Book This Decoration
                </Link>
                <Link
                  to="/contact"
                  style={{
                    flex: "1 1 auto",
                    textDecoration: "none",
                    padding: "16px 28px",
                    borderRadius: "12px",
                    background: "#fff",
                    color: "#9b5b34",
                    fontWeight: "700",
                    fontSize: "15px",
                    textAlign: "center",
                    border: "2px solid #9b5b34",
                    transition: "all 0.3s ease"
                  }}
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px" }}>
        {/* HERO HEADER WITH SEARCH */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "30px",
          flexWrap: "wrap",
          padding: "40px 0 30px",
          borderBottom: "1px solid rgba(0,0,0,0.06)"
        }}>
          <div style={{ flex: "1 1 400px" }}>
            <h1 style={{
              margin: 0,
              fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "10px"
            }}>
              Gallery
            </h1>
            <p style={{
              margin: 0,
              color: "#6f645a",
              lineHeight: 1.6,
              fontSize: "1rem",
              maxWidth: "500px"
            }}>
              Explore our decoration work by category and discover stunning designs for your special events.
            </p>
          </div>

          <div style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flex: "0 1 auto"
          }}>
            {/* SEARCH BAR */}
            <div style={{
              position: "relative",
              minWidth: "280px"
            }}>
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 45px 14px 20px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  background: "#fff",
                  fontSize: "15px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#9b5b34";
                  e.target.style.boxShadow = "0 4px 12px rgba(155, 91, 52, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  pointerEvents: "none"
                }}
                fill="none"
                stroke="#9b5b34"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>

            <Link to="/contact" style={{
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: "12px",
              background: "#9b5b34",
              color: "#fff",
              fontWeight: "700",
              fontSize: "15px",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(155, 91, 52, 0.25)",
              transition: "all 0.3s ease"
            }}>
              Book a Date
            </Link>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          padding: "30px 0",
          justifyContent: "center"
        }}>
          <button
            onClick={() => setActiveFilter("all")}
            style={{
              padding: "12px 24px",
              borderRadius: "30px",
              border: activeFilter === "all" ? "2px solid #9b5b34" : "2px solid #e5e7eb",
              background: activeFilter === "all" ? "#9b5b34" : "#fff",
              color: activeFilter === "all" ? "#fff" : "#4b5563",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeFilter === "all" ? "0 4px 12px rgba(155, 91, 52, 0.2)" : "none"
            }}
          >
            All Decorations
          </button>

          <button
            onClick={() => setActiveFilter("wedding")}
            style={{
              padding: "12px 24px",
              borderRadius: "30px",
              border: activeFilter === "wedding" ? "2px solid #9b5b34" : "2px solid #e5e7eb",
              background: activeFilter === "wedding" ? "#9b5b34" : "#fff",
              color: activeFilter === "wedding" ? "#fff" : "#4b5563",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeFilter === "wedding" ? "0 4px 12px rgba(155, 91, 52, 0.2)" : "none"
            }}
          >
            Wedding
          </button>

          <button
            onClick={() => setActiveFilter("birthday")}
            style={{
              padding: "12px 24px",
              borderRadius: "30px",
              border: activeFilter === "birthday" ? "2px solid #9b5b34" : "2px solid #e5e7eb",
              background: activeFilter === "birthday" ? "#9b5b34" : "#fff",
              color: activeFilter === "birthday" ? "#fff" : "#4b5563",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeFilter === "birthday" ? "0 4px 12px rgba(155, 91, 52, 0.2)" : "none"
            }}
          >
            Birthday
          </button>

          <button
            onClick={() => setActiveFilter("table")}
            style={{
              padding: "12px 24px",
              borderRadius: "30px",
              border: activeFilter === "table" ? "2px solid #9b5b34" : "2px solid #e5e7eb",
              background: activeFilter === "table" ? "#9b5b34" : "#fff",
              color: activeFilter === "table" ? "#fff" : "#4b5563",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeFilter === "table" ? "0 4px 12px rgba(155, 91, 52, 0.2)" : "none"
            }}
          >
            Table Decoration
          </button>

          <button
            onClick={() => setActiveFilter("hall")}
            style={{
              padding: "12px 24px",
              borderRadius: "30px",
              border: activeFilter === "hall" ? "2px solid #9b5b34" : "2px solid #e5e7eb",
              background: activeFilter === "hall" ? "#9b5b34" : "#fff",
              color: activeFilter === "hall" ? "#fff" : "#4b5563",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeFilter === "hall" ? "0 4px 12px rgba(155, 91, 52, 0.2)" : "none"
            }}
          >
            Hall Decoration
          </button>

          <button
            onClick={() => setActiveFilter("other")}
            style={{
              padding: "12px 24px",
              borderRadius: "30px",
              border: activeFilter === "other" ? "2px solid #9b5b34" : "2px solid #e5e7eb",
              background: activeFilter === "other" ? "#9b5b34" : "#fff",
              color: activeFilter === "other" ? "#fff" : "#4b5563",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeFilter === "other" ? "0 4px 12px rgba(155, 91, 52, 0.2)" : "none"
            }}
          >
            Other Events
          </button>
        </div>

        {/* RESULTS INFO */}
        {!loading && (
          <div style={{
            textAlign: "center",
            padding: "20px 0",
            color: "#6f645a",
            fontSize: "15px",
            fontWeight: "600"
          }}>
            Showing {filteredImages.length} {filteredImages.length === 1 ? "decoration" : "decorations"}
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        {loading && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            fontSize: "16px",
            color: "#9b5b34",
            fontWeight: "600"
          }}>
            Loading gallery...
          </div>
        )}

        {!loading && error && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#fff3cd",
            borderRadius: "16px",
            color: "#856404",
            fontWeight: "600",
            border: "2px solid #ffc107"
          }}>
            {error}
          </div>
        )}

        {!loading && !error && filteredImages.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#fff",
            borderRadius: "16px",
            color: "#6f645a",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            No decorations found. Try a different search or category.
          </div>
        )}

        {/* MODERN MASONRY GALLERY GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
          padding: "20px 0"
        }}>
          {filteredImages.map((img, index) => (
            <div
              key={img._id || img.id}
              style={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "all 0.4s ease",
                cursor: "pointer",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(155, 91, 52, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{
                position: "relative",
                width: "100%",
                paddingTop: "75%",
                overflow: "hidden",
                background: "#f5f5f5"
              }}>
                <img
                  src={getGalleryImageSrc(img)}
                  alt={img.title || categoryLabel(img.category)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />

                {/* Category Badge */}
                <div style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(155, 91, 52, 0.95)",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                }}>
                  {(img.category || "other").replace(/^\w/, c => c.toUpperCase())}
                </div>
              </div>

              <div style={{
                padding: "20px"
              }}>
                <h3 style={{
                  margin: "0 0 8px 0",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
                  lineHeight: "1.3"
                }}>
                  {img.title || categoryLabel(img.category)}
                </h3>

                <div
                  onClick={() => setSelectedImage(img)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#9b5b34",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  <span>View Details</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          ))}
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

const filterBar = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 14,
};

const filterBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "white",
  color: "#111827",
  fontWeight: 800,
  cursor: "pointer",
};

const filterBtnActive = {
  ...filterBtn,
  background: "#111827",
  border: "1px solid #111827",
  color: "white",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const tile = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 14,
  background: "white",
};

const thumb = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid #eee",
};

const btnDark = {
  textDecoration: "none",
  padding: "12px 14px",
  borderRadius: 12,
  background: "#111827",
  color: "white",
  fontWeight: 900,
};

const note = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "#f9fafb",
  border: "1px solid #eee",
  color: "#374151",
  lineHeight: 1.6,
};
