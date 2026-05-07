"use client";

import Link from "next/link";

export default function ChatbotButton() {
  return (
    <Link 
      href="/chatbot" 
      className="chatbot-floating-btn"
      aria-label="Open Chatbot"
    >
      <div className="chatbot-icon-wrapper">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="chatbot-icon"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <path d="M9 9h6"></path>
          <path d="M9 13h6"></path>
        </svg>
      </div>
      <span className="chatbot-btn-text">
        Chat with AI
      </span>
    </Link>
  );
}
