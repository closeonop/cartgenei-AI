"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Update this if your backend uses a different endpoint path!
const API_URL = "https://cartgenie-backend.onrender.com/api/chat";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hi there! I am CartGenie AI. How can I help you boost your ecommerce conversions today?",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // IMPORTANT: Adjust this payload to match exactly what your backend expects!
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        // IMPORTANT: Adjust 'data.reply' if your backend sends the response under a different key!
        content: data.reply || data.message || "I received your message, but didn't know how to format the reply. Please check the backend response JSON structure.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Oops! I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role === "bot" ? "bot-message" : "user-message"}`}>
              <div className="message-bubble">{msg.content}</div>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="message-bubble loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chatbot-input-area" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chatbot-input"
            disabled={isLoading}
          />
          <button type="submit" className="chatbot-send-btn" disabled={!input.trim() || isLoading}>
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
