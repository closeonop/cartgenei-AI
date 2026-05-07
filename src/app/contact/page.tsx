"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setTimeout(() => setFormState("success"), 1500);
  };

  return (
    <>
      <section className="page-hero contact-hero">
        <div className="page-hero-content">
          <h1 className="anim-1">Get in Touch</h1>
          <p className="anim-2" style={{ animationDelay: "0.2s" }}>
            Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p>Fill up the form and our Team will get back to you within 24 hours.</p>
            
            <ul className="contact-details">
              <li>
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <strong>Phone</strong>
                  <span>+1 (555) 123-4567</span>
                </div>
              </li>
              <li>
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </div>
                <div>
                  <strong>Email</strong>
                  <span>hello@cartgenie.ai</span>
                </div>
              </li>
              <li>
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <strong>Location</strong>
                  <span>123 AI Boulevard, San Francisco, CA 94107</span>
                </div>
              </li>
            </ul>

            <div className="contact-socials">
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="social-icon" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {formState === "success" ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>We&apos;ve received your message and will be in touch shortly.</p>
                <button className="btn btn-outline mt-4" onClick={() => setFormState("idle")}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" required placeholder="John Doe" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" required placeholder="john@company.com" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" required defaultValue="">
                    <option value="" disabled>Select a subject</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" required rows={5} placeholder="How can we help you?"></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary submit-btn"
                  disabled={formState === "submitting"}
                >
                  {formState === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
