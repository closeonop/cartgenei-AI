import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Free Trial — CartGenie AI",
  description:
    "Try CartGenie AI free for 14 days. No credit card required. AI-powered order management, refund automation, and cart recovery.",
};

export default function FreeTrialPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label">Start Your Journey</p>
          <h1>
            Try CartGenie AI{" "}
            <span style={{ color: "var(--primary)" }}>Free</span> for 14 Days
          </h1>
          <p>
            No credit card required. Set up in under 5 minutes. Experience the
            full power of AI-driven e-commerce automation.
          </p>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <p className="section-label">Pricing Plans</p>
          <h2 className="section-title">
            Simple, Transparent Pricing
          </h2>
          <p className="section-desc">
            Start free, scale as you grow. Every plan includes our core AI
            engine.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Starter */}
          <div className="pricing-card">
            <p className="pricing-tier">Starter</p>
            <p className="pricing-price">
              $0<span>/mo</span>
            </p>
            <p className="pricing-desc">
              Perfect for small stores testing the waters with AI automation.
            </p>
            <ul className="pricing-features">
              <li>Up to 500 conversations/mo</li>
              <li>Order tracking chatbot</li>
              <li>Basic cart recovery</li>
              <li>Email notifications</li>
              <li>Community support</li>
            </ul>
            <Link href="#" className="btn btn-outline">
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="pricing-card popular">
            <p className="pricing-tier">Pro</p>
            <p className="pricing-price">
              $49<span>/mo</span>
            </p>
            <p className="pricing-desc">
              For growing brands that want serious conversion lifts.
            </p>
            <ul className="pricing-features">
              <li>Unlimited conversations</li>
              <li>Full order &amp; refund automation</li>
              <li>Advanced cart recovery flows</li>
              <li>Fraud detection &amp; order rejection</li>
              <li>Analytics dashboard</li>
              <li>Priority support</li>
            </ul>
            <Link href="#" className="btn btn-primary">
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div className="pricing-card">
            <p className="pricing-tier">Enterprise</p>
            <p className="pricing-price">Custom</p>
            <p className="pricing-desc">
              Tailored solutions for high-volume e-commerce operations.
            </p>
            <ul className="pricing-features">
              <li>Everything in Pro</li>
              <li>Custom AI training on your data</li>
              <li>Multi-store support</li>
              <li>Dedicated account manager</li>
              <li>SLA &amp; uptime guarantees</li>
              <li>API access &amp; webhooks</li>
            </ul>
            <Link href="#" className="btn btn-outline">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section className="content-section">
        <div className="content-grid">
          <div className="content-text">
            <p className="section-label">What&apos;s Included</p>
            <h2>Everything You Need From Day One</h2>
            <p>
              Every CartGenie AI trial includes full access to our platform —
              no feature gating, no surprises. Set up your AI assistant in
              minutes and watch it start working immediately.
            </p>
            <ul className="checklist">
              <li>
                <span className="check">✓</span> Full AI chatbot with natural
                language understanding
              </li>
              <li>
                <span className="check">✓</span> Automated order processing
                &amp; tracking
              </li>
              <li>
                <span className="check">✓</span> Smart refund initiation
                workflows
              </li>
              <li>
                <span className="check">✓</span> Cart abandonment recovery
                sequences
              </li>
              <li>
                <span className="check">✓</span> Real-time analytics &amp;
                conversion tracking
              </li>
              <li>
                <span className="check">✓</span> Shopify, WooCommerce &amp;
                Magento integrations
              </li>
            </ul>
          </div>

          <div className="content-visual">
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: "1rem",
                }}
              >
                🚀
              </div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                5-Minute Setup
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Paste one snippet. CartGenie handles the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="content-section">
        <div className="section-header">
          <p className="section-label">FAQ</p>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div style={{ maxWidth: "750px", margin: "0 auto" }}>
          <ul className="steps-list">
            <li>
              <div className="step-content">
                <h3>Do I need a credit card to start?</h3>
                <p>
                  No. Our 14-day trial is completely free with no credit card
                  required. You can upgrade anytime during or after the trial.
                </p>
              </div>
            </li>
            <li>
              <div className="step-content">
                <h3>Which platforms does CartGenie support?</h3>
                <p>
                  We integrate with Shopify, WooCommerce, Magento, BigCommerce,
                  and any platform with a REST API.
                </p>
              </div>
            </li>
            <li>
              <div className="step-content">
                <h3>Can I customize the AI responses?</h3>
                <p>
                  Absolutely. You can train CartGenie on your brand voice, FAQs,
                  and product catalog for fully personalized interactions.
                </p>
              </div>
            </li>
            <li>
              <div className="step-content">
                <h3>What happens after the trial ends?</h3>
                <p>
                  You can choose a plan that fits your needs or continue with our
                  free Starter plan with limited features.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="cta-banner">
          <h2>Start Automating Today</h2>
          <p>
            Join 2,000+ e-commerce brands already using CartGenie AI. Your
            14-day free trial awaits.
          </p>
          <div className="hero-ctas">
            <Link href="#" className="btn btn-primary">
              Start Free Trial <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
