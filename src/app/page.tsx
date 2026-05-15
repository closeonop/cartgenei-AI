import Link from "next/link";
import HeroBg from "@/components/HeroBg";

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <HeroBg />
        </div>

        {/* Giant 2-row typography — left-aligned, overlapping robot */}
        <div className="hero-typography">
          <div className="typo-row anim-1">
            <span className="typo-outline-inline">YOUR</span>
            <span className="typo-accent-inline">AI</span>
          </div>
          <div className="typo-row anim-2">
            <span className="typo-bold-full">STORE ASSISTANT</span>
          </div>
        </div>

        {/* Bottom-left description */}
        <div className="hero-bottom-left">
          <p className="hero-descriptor">
            // CARTGENIE AI — AN AI COMMERCE TOOL
            <br />
            OPTIMIZING CONVERSIONS, AUTOMATING CART RECOVERY,
            <br />
            AND PERSONALIZING SHOPPING EXPERIENCES.
          </p>
        </div>

        {/* Bottom-right CTA + tagline */}
        <div className="hero-bottom-right">
          {/* <p className="hero-tagline">
            // INTELLIGENCE THAT
            <br />
            SCALES YOUR BUSINESS
          </p> */}
          <div className="hero-ctas">
            <Link href="/chatbot" className="btn btn-primary">
              Start Free Trial
              <span className="btn-arrow">→</span>
            </Link>
            <Link href="/chatbot" className="btn btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M9 9h6"></path>
                <path d="M9 13h6"></path>
              </svg>
              Chat with AI
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-number">94%</div>
            <div className="stat-label">Customer Satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3.2×</div>
            <div className="stat-label">Conversion Uplift</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Orders Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Always Online</div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" id="features">
        <div className="section-header">
          <p className="section-label">What CartGenie Does</p>
          <h2 className="section-title">
            Everything You Need to Automate Your Store
          </h2>
          <p className="section-desc">
            From handling orders to recovering lost sales, CartGenie AI works
            around the clock so you don&apos;t have to.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h3>Smart Order Handling</h3>
            <p>
              Automatically process, confirm, and track orders in real-time.
              Your customers stay informed at every step without lifting a
              finger.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚫</div>
            <h3>Intelligent Order Rejection</h3>
            <p>
              Flag fraudulent or invalid orders instantly with AI-driven risk
              analysis, protecting your revenue and reputation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💸</div>
            <h3>Automated Refunds</h3>
            <p>
              Initiate and process refunds seamlessly. CartGenie handles the
              entire workflow from request to resolution.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Cart Recovery</h3>
            <p>
              Reach out to customers who abandoned their carts with
              personalized, perfectly-timed messages that bring them back.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Conversational AI Chat</h3>
            <p>
              Natural language chatbot that understands customer intent,
              resolves queries, and upsells products seamlessly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>
              Get real-time insights into customer behavior, conversion rates,
              and revenue impact — all in one place.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}
