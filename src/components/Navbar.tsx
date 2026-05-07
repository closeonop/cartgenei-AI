"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cartgenie.png"
            alt="CartGenie AI"
            style={{
              height: "70px",
              width: "auto",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
            }}
          />
        </Link>

        <button
          className={`menu-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar-links${menuOpen ? " open" : ""}`}>
          <li>
            <Link href="/#features" onClick={() => setMenuOpen(false)}>
              Features
            </Link>
          </li>
          <li>
            <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>
              How It Works
            </Link>
          </li>
          <li>
            <Link href="/free-trial" onClick={() => setMenuOpen(false)}>
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="navbar-cta"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
