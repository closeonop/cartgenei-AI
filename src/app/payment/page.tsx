import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout — CartGenie AI",
  description: "Complete your CartGenie AI purchase securely.",
};

export default function PaymentPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 1rem 2rem',
      background: 'radial-gradient(ellipse at 50% -20%, rgba(63, 169, 245, 0.08) 0%, transparent 70%)'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(17, 17, 17, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(63, 169, 245, 0.1)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem'
      }} className="payment-container">
        
        {/* Left Side - Details */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>Secure Checkout</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Complete your purchase to unlock AI automation.</p>
          
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Selected Plan</span>
              <span style={{ fontWeight: 600 }}>CartGenie Plan</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 700, fontSize: '1.2rem' }}>
              <span>Total Due</span>
              <span style={{ color: 'var(--primary)' }}>Secure</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Payments are secure and encrypted.</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
              <input type="email" placeholder="you@company.com" style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Card Information</label>
              <div style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.3)' }}>
                <input type="text" placeholder="Card number" style={{ width: '100%', padding: '0.8rem 1rem', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.95rem' }} />
                <div style={{ display: 'flex' }}>
                  <input type="text" placeholder="MM / YY" style={{ width: '50%', padding: '0.8rem 1rem', background: 'transparent', border: 'none', borderRight: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.95rem' }} />
                  <input type="text" placeholder="CVC" style={{ width: '50%', padding: '0.8rem 1rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Cardholder Name</label>
              <input type="text" placeholder="Full name on card" style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem' }} />
            </div>

            <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', width: '100%', padding: '1rem', background: 'var(--primary)', color: 'var(--bg)', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none' }}>
              Subscribe Now
            </Link>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              By confirming your subscription, you allow CartGenie to charge you for future payments in accordance with their terms.
            </p>
          </form>
        </div>
      </div>
      
      {/* Basic responsive style inside a style block */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .payment-container {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 2rem !important;
          }
        }
      `}} />
    </div>
  );
}
