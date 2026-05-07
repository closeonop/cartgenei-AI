"use client";

import { useState } from "react";
import Link from "next/link";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // For now it just clears the input. Backend connection comes later!
    setMessage("");
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <Link href="/" className="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </Link>
          <div className="chatbot-title">
            <div className="chatbot-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M9 9h6"></path>
                <path d="M9 13h6"></path>
              </svg>
            </div>
            <div>
              <h1>CartGenie AI</h1>
              <p className="online-status">● Online</p>
            </div>
          </div>
        </div>
        
        <div className="chatbot-messages">
          <div className="message bot-message">
            <div className="message-bubble">
              Hi there! I am CartGenie AI. How can I help you boost your ecommerce conversions today?
            </div>
            <span className="message-time">Just now</span>
          </div>
        </div>
        
        <form className="chatbot-input-area" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send-btn" disabled={!message.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
