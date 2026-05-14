"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Update this if your backend uses a different endpoint path!
const API_URL = "https://cartgenie-backend.onrender.com/api/support";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  attachmentUrl?: string;
  attachmentName?: string;
};

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).substring(7));
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hi there! I am CartGenie AI. How can I help you boost your ecommerce conversions today?",
      timestamp: new Date(),
    },
  ]);

  // File Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setPendingFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPendingPreview(url);
    } else {
      setPendingPreview(null);
    }
  };

  const clearPendingFile = () => {
    setPendingFile(null);
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.file.url;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !pendingFile) || isLoading || isUploadingAttachment) return;

    let attachmentUrl = undefined;
    let attachmentName = undefined;

    if (pendingFile) {
      setIsUploadingAttachment(true);
      const url = await uploadFile(pendingFile);
      if (url) {
        attachmentUrl = url;
        attachmentName = pendingFile.name;
      }
      setIsUploadingAttachment(false);
      clearPendingFile();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      attachmentUrl,
      attachmentName
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Provide context about the image to the bot if possible
    let queryPayload = userMessage.content;
    if (!queryPayload && attachmentName) {
      queryPayload = `I have attached a file: ${attachmentName}`;
    } else if (attachmentName) {
      queryPayload += `\n[Attached: ${attachmentName}]`;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: queryPayload,
          sessionId: sessionId 
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.response?.customerMessage || data.response?.message || data.message || "I received your message.",
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
    <>
      <style>{`
        .chat-app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #050505;
          color: #f8fafc;
          position: relative;
          overflow: hidden;
        }
        
        /* Drag Overlay */
        .drag-overlay {
          position: absolute;
          inset: 0;
          background: rgba(5, 5, 5, 0.85);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #3fa9f5;
          border-radius: 20px;
          margin: 1rem;
          pointer-events: none;
          transition: all 0.3s ease;
          opacity: 0;
          visibility: hidden;
        }
        .drag-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .drag-overlay-icon {
          width: 80px;
          height: 80px;
          color: #3fa9f5;
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }
        
        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 10;
        }
        .chat-back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #a0aec0;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .chat-back-btn:hover {
          color: #fff;
        }
        .chat-title-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .chat-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(63, 169, 245, 0.15);
          color: #3fa9f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-title h1 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }
        .chat-status {
          font-size: 0.75rem;
          color: #22c55e;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        /* Messages Container */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .message-row {
          display: flex;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        .message-row.user {
          justify-content: flex-end;
        }
        .message-row.bot {
          justify-content: flex-start;
        }
        
        .message-bubble {
          max-width: 80%;
          padding: 1rem 1.25rem;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.5;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .message-row.user .message-bubble {
          background: linear-gradient(135deg, #2563eb, #3fa9f5);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        
        .message-row.bot .message-bubble {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          border-bottom-left-radius: 4px;
        }
        
        .message-attachment {
          margin-top: 0.5rem;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255,255,255,0.1);
          display: inline-block;
          max-width: 100%;
        }
        
        .message-attachment img {
          max-width: 100%;
          max-height: 300px;
          object-fit: cover;
          display: block;
        }
        
        .message-doc {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          color: #3fa9f5;
          font-weight: 500;
          text-decoration: underline;
          font-size: 0.85rem;
        }
        
        /* Input Area Container */
        .chat-input-wrapper {
          padding: 0 2rem 2rem;
          background: linear-gradient(to top, #050505 50%, transparent);
          z-index: 10;
        }
        
        .chat-input-container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        
        .chat-input-container:focus-within {
          border-color: rgba(63, 169, 245, 0.5);
          box-shadow: 0 0 30px rgba(63, 169, 245, 0.15), 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        /* Preview Area */
        .input-preview-area {
          display: flex;
          gap: 0.5rem;
          padding: 0 0.5rem;
          margin-top: 0.25rem;
        }
        
        .preview-chip {
          position: relative;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          width: fit-content;
        }
        
        .preview-chip img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .preview-chip .doc-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          color: #a0aec0;
        }
        
        .preview-remove-btn {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        
        /* Input Field & Buttons */
        .chat-input-row {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          padding: 0 0.25rem;
        }
        
        .attach-btn {
          background: none;
          border: none;
          color: #a0aec0;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .attach-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-family: inherit;
          font-size: 1rem;
          padding: 0.75rem 0.5rem;
          outline: none;
          resize: none;
          min-height: 44px;
          max-height: 200px;
          line-height: 1.5;
        }
        
        .chat-input::placeholder {
          color: #4a5568;
        }
        
        .send-btn {
          background: #3fa9f5;
          color: #000;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 2px;
          margin-right: 2px;
        }
        
        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(63, 169, 245, 0.4);
          background: #60C3FF;
        }
        
        .send-btn:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
        }
        
        /* Loading Dots */
        .loading-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 1rem 1.5rem !important;
        }
        .loading-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a0aec0;
          animation: dot-bounce 1.4s infinite ease-in-out both;
        }
        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .chat-messages {
            padding: 1rem;
          }
          .message-bubble {
            max-width: 90%;
          }
          .chat-input-wrapper {
            padding: 0 1rem 1rem;
          }
        }
      `}</style>

      <div 
        className="chat-app"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag & Drop Overlay */}
        <div className={`drag-overlay ${isDragging ? "active" : ""}`}>
          <svg className="drag-overlay-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Drop files to upload</h2>
          <p style={{ color: "#a0aec0", marginTop: "0.5rem" }}>Images, PDFs, or Documents</p>
        </div>

        {/* Header */}
        <header className="chat-header">
          <Link href="/" className="chat-back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </Link>
          <div className="chat-title-area">
            <div className="chat-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M9 9h6"></path>
                <path d="M9 13h6"></path>
              </svg>
            </div>
            <div className="chat-title">
              <h1>CartGenie AI</h1>
              <span className="chat-status">● Online</span>
            </div>
          </div>
          <div style={{ width: "60px" }}></div> {/* Placeholder for centering */}
        </header>

        {/* Messages */}
        <main className="chat-messages" ref={messagesContainerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              <div className="message-bubble">
                {msg.content}
                
                {msg.attachmentUrl && msg.attachmentName && (
                  <div className="message-attachment">
                    {msg.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                      <img src={msg.attachmentUrl} alt="Attachment" />
                    ) : (
                      <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="message-doc">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {msg.attachmentName}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-row bot">
              <div className="message-bubble loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </main>

        {/* Input Area */}
        <div className="chat-input-wrapper">
          <form className="chat-input-container" onSubmit={handleSubmit}>
            {/* Pending File Preview */}
            {pendingFile && (
              <div className="input-preview-area">
                <div className="preview-chip">
                  {pendingPreview ? (
                    <img src={pendingPreview} alt="Preview" />
                  ) : (
                    <div className="doc-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <button type="button" className="preview-remove-btn" onClick={clearPendingFile}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="chat-input-row">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                onChange={handleFileChange}
              />
              <button 
                type="button" 
                className="attach-btn" 
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
              <input
                type="text"
                className="chat-input"
                placeholder={isUploadingAttachment ? "Uploading file..." : "Send a message to CartGenie AI..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isUploadingAttachment}
              />
              
              <button 
                type="submit" 
                className="send-btn" 
                disabled={(!input.trim() && !pendingFile) || isLoading || isUploadingAttachment}
              >
                {isUploadingAttachment ? (
                   <svg className="animate-spin" style={{width: '20px', height: '20px', animation: 'spin 1s linear infinite'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginLeft: "2px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
