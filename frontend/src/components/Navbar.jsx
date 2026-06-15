import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/images/logo.png";

function navLinkClass({ isActive }) {
  return `site-nav__link${isActive ? " site-nav__link--active" : ""}`;
}

export default function Navbar() {
  const { customer, logoutCustomer } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-brand" aria-label="DecorHire Lanka home">
          <img src={logo} alt="DecorHire Lanka logo" className="site-brand__logo" />
          <span className="site-brand__copy">
            <strong>DecorHire Lanka</strong>
            <span>Wedding Decoration Studio</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/popular" className={navLinkClass}>
            Popular
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass}>
            Gallery
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="site-actions">
          {!customer ? (
            <>
              <Link to="/login" className="site-btn site-btn--ghost">
                Login
              </Link>
              <Link to="/register" className="site-btn site-btn--solid">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="site-user">Hi, {customer?.username || "Customer"}</span>
              <button
                type="button"
                className="site-btn site-btn--ghost"
                onClick={logoutCustomer}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
