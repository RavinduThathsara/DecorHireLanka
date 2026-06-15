import React from "react";
import { Link } from "react-router-dom";
import facebookIcon from "../assets/images/facebook.png";
import instagramIcon from "../assets/images/instragram.png";
import tiktokIcon from "../assets/images/tiktok.png";
import youtubeIcon from "../assets/images/youtube.png";
import logo from "../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand-block">
            <Link to="/" className="site-footer__brand" aria-label="DecorHire Lanka home">
              <img src={logo} alt="DecorHire Lanka logo" className="site-footer__logo" />
              <div>
                <h3>DecorHire Lanka</h3>
                <p>Elegant Sri Lankan wedding decoration and event styling.</p>
              </div>
            </Link>

            <p className="site-footer__about">
              We create traditional and modern setups for poruwa ceremonies, reception halls,
              homecomings, and outdoor celebrations across the hill country.
            </p>

            <p className="site-footer__meta">
              <strong>Service Areas:</strong> Badulla, Passara, Monaragala, Bibila and nearby
              locations on request.
            </p>
          </div>

          <div>
            <h3 className="site-footer__title">Quick Links</h3>
            <div className="site-footer__links">
              <Link className="site-footer__link" to="/">
                Home
              </Link>
              <Link className="site-footer__link" to="/services">
                Services
              </Link>
              <Link className="site-footer__link" to="/popular">
                Popular Wedding Decoration
              </Link>
              <Link className="site-footer__link" to="/gallery">
                Gallery
              </Link>
              <Link className="site-footer__link" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="site-footer__title">Contact</h3>
            <div className="site-footer__contact">
              <div>
                <strong>Phone:</strong>{" "}
                <a href="tel:+94759070250" className="site-footer__link">
                  +94 759070250
                </a>
              </div>
              <div>
                <strong>WhatsApp:</strong>{" "}
                <a
                  href="https://wa.me/94713187790"
                  target="_blank"
                  rel="noreferrer"
                  className="site-footer__link"
                >
                  +94 713187790
                </a>
              </div>
              <div>
                <strong>Email:</strong>{" "}
                <a href="mailto:ravinduthathsara38@gmail.com" className="site-footer__link">
                  ravinduthathsara38@gmail.com
                </a>
              </div>
              <div>
                <strong>Location:</strong> Sri Lanka
              </div>
            </div>
          </div>

          <div>
            <h3 className="site-footer__title">Follow Us</h3>
            <div className="site-footer__links">
              <a href="#" className="site-footer__social">
                <img src={facebookIcon} alt="Facebook" />
                Facebook
              </a>
              <a href="#" className="site-footer__social">
                <img src={instagramIcon} alt="Instagram" />
                Instagram
              </a>
              <a href="#" className="site-footer__social">
                <img src={tiktokIcon} alt="TikTok" />
                TikTok
              </a>
              <a href="#" className="site-footer__social">
                <img src={youtubeIcon} alt="YouTube" />
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
