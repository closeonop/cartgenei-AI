import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — CartGenie AI",
  description:
    "See how CartGenie AI automates order management, handles refunds, recovers abandoned carts, and boosts e-commerce conversions with intelligent AI.",
};

export default function HowItWorksPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label">How It Works</p>
          <h1>
            AI That{" "}
            <span style={{ color: "var(--primary)" }}>Understands</span>{" "}
            Your Customers
          </h1>
          <p>
            CartGenie AI plugs into your store in minutes and starts managing
            orders, answering questions, and recovering lost revenue
            automatically.
          </p>
        </div>
      </section>

      {/* ===== STEP-BY-STEP ===== */}
      <section className="content-section">
        <div className="content-grid">
          <div className="content-text">
            <p className="section-label">Step 1</p>
            <h2>Connect Your Store</h2>
            <p>
              Integrate CartGenie with your e-commerce platform in under
              5 minutes. We support Shopify, WooCommerce, Magento, BigCommerce,
              and custom REST APIs. Just paste a single code snippet and
              you&apos;re live.
            </p>
            <p>
              CartGenie automatically syncs your product catalog, order history,
              and customer data — no manual uploads needed.
            </p>
          </div>
          <div className="content-visual">
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔌</div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                One-Click Integration
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Shopify · WooCommerce · Magento · REST API
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="content-grid reverse">
          <div className="content-text">
            <p className="section-label">Step 2</p>
            <h2>Train Your AI Assistant</h2>
            <p>
              Customize CartGenie with your brand voice, FAQs, return policies,
              and product knowledge. Our AI learns from your existing support
              conversations to deliver responses that feel authentically yours.
            </p>
            <p>
              Set escalation rules, define refund policies, and configure
              automated workflows — all from an intuitive dashboard.
            </p>
          </div>
          <div className="content-visual">
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🧠</div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Custom AI Training
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Your brand voice. Your policies. Your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="content-grid">
          <div className="content-text">
            <p className="section-label">Step 3</p>
            <h2>Watch It Work — Automatically</h2>
            <p>
              Once live, CartGenie operates 24/7. It handles incoming orders,
              flags suspicious transactions, processes refund requests, and
              follows up with customers who left items in their cart.
            </p>
            <ul className="checklist">
              <li>
                <span className="check">✓</span> Processes orders in real-time
              </li>
              <li>
                <span className="check">✓</span> Detects and rejects fraudulent
                orders
              </li>
              <li>
                <span className="check">✓</span> Automates refund workflows
              </li>
              <li>
                <span className="check">✓</span> Sends personalized cart
                recovery messages
              </li>
              <li>
                <span className="check">✓</span> Upsells and cross-sells
                intelligently
              </li>
            </ul>
          </div>
          <div className="content-visual">
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚡</div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Always-On Automation
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                24/7 · Zero downtime · Instant responses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="section">
        <div className="section-header">
          <p className="section-label">Core Capabilities</p>
          <h2 className="section-title">
            Built for Modern E-Commerce
          </h2>
          <p className="section-desc">
            Every feature is designed to reduce friction, increase revenue, and
            keep your customers delighted.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Order Management</h3>
            <p>
              From placement to delivery, CartGenie tracks every order and keeps
              customers informed with real-time status updates via chat.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Fraud Prevention</h3>
            <p>
              AI-powered risk scoring identifies suspicious orders before they
              cost you. Automatically reject or flag for review.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">↩️</div>
            <h3>Refund Automation</h3>
            <p>
              Customers request refunds through chat. CartGenie validates
              eligibility, processes the refund, and sends confirmation — hands
              free.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Cart Recovery</h3>
            <p>
              Recover up to 35% of abandoned carts with perfectly timed,
              personalized follow-up messages across chat and email.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Natural Language Chat</h3>
            <p>
              Customers interact with a chatbot that actually understands them.
              No rigid menus — just natural, helpful conversation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Revenue Analytics</h3>
            <p>
              Track exactly how CartGenie impacts your bottom line with
              conversion attribution, recovery rates, and ROI dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="cta-banner">
          <h2>
            See the{" "}
            <span style={{ color: "var(--primary)" }}>Difference</span> AI Makes
          </h2>
          <p>
            Start your 14-day free trial today. No credit card, no commitment.
          </p>
          <div className="hero-ctas">
            <Link href="/free-trial" className="btn btn-primary">
              Start Free Trial <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
