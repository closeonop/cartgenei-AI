import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cartgenie.png"
            alt="CartGenie AI"
            style={{
              height: "45px",
              width: "auto",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
              opacity: 0.7,
            }}
          />
        </div>
        <ul className="footer-links">
          <li>
            <Link href="/#features">Features</Link>
          </li>
          <li>
            <Link href="/how-it-works">How It Works</Link>
          </li>
          <li>
            <Link href="/free-trial">Pricing</Link>
          </li>
        </ul>
        <p className="footer-copy">
          © {new Date().getFullYear()} CartGenie AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
