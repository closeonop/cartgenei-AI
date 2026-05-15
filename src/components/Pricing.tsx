"use client";

import { useState } from "react";
import Link from "next/link";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', gap: '1rem' }}>
        <span style={{ 
          color: isYearly ? 'var(--text-muted)' : 'var(--text-primary)', 
          fontWeight: isYearly ? 400 : 600,
          transition: 'all 0.3s ease'
        }}>
          Monthly
        </span>
        <button 
          onClick={() => setIsYearly(!isYearly)}
          style={{
            width: '64px',
            height: '32px',
            borderRadius: '16px',
            background: 'var(--primary)',
            border: 'none',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          aria-label="Toggle pricing"
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: '4px',
            left: isYearly ? '36px' : '4px',
            transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }} />
        </button>
        <span style={{ 
          color: isYearly ? 'var(--text-primary)' : 'var(--text-muted)',
          fontWeight: isYearly ? 600 : 400,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Yearly 
          <span style={{ 
            color: '#10b981', 
            fontSize: '0.75rem', 
            fontWeight: 700,
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '2px 8px',
            borderRadius: '100px'
          }}>
            Save 20%
          </span>
        </span>
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
          <Link href="/chatbot" className="btn btn-outline">
            Get Started Free
          </Link>
        </div>

        {/* Pro */}
        <div className="pricing-card popular">
          <p className="pricing-tier">Pro</p>
          <p className="pricing-price">
            ${isYearly ? "24" : "29"}<span>/mo</span>
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
          <Link href="/payment" className="btn btn-primary">
            Purchase Plan <span className="btn-arrow">→</span>
          </Link>
        </div>

        {/* Ultra */}
        <div className="pricing-card">
          <p className="pricing-tier">Ultra</p>
          <p className="pricing-price">
            ${isYearly ? "64" : "79"}<span>/mo</span>
          </p>
          <p className="pricing-desc">
            Advanced features for high-volume stores needing custom training.
          </p>
          <ul className="pricing-features">
            <li>Everything in Pro</li>
            <li>Custom AI training on your data</li>
            <li>Multi-store support (up to 3)</li>
            <li>Advanced analytics &amp; reporting</li>
            <li>API access</li>
            <li>Dedicated account manager</li>
          </ul>
          <Link href="/payment" className="btn btn-primary">
            Purchase Plan <span className="btn-arrow">→</span>
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
            <li>Everything in Ultra</li>
            <li>Unlimited store support</li>
            <li>Custom SLA & uptime guarantees</li>
            <li>On-premise deployment options</li>
            <li>White-labeling</li>
            <li>24/7 Phone Support</li>
          </ul>
          <Link href="/chatbot" className="btn btn-outline">
            Contact Sales
          </Link>
        </div>
      </div>
    </>
  );
}
