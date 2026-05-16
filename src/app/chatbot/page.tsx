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

const QUICK_ACTIONS = [
  {
    label: "Cancel my order",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "I want a replacement",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    label: "Track my order",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: "Refund status",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// Bot avatar SVG icon
const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

// Human avatar SVG icon
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).substring(7));
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hi there! 👋 I am CartGenie AI. How can I help you today? Pick a topic below or type your question.",
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

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
             setInput((prev) => prev + (prev && !prev.endsWith(" ") ? " " : "") + finalTranscript);
          }
        };

        recognitionRef.current.onend = () => {
          if (isListeningRef.current) {
             try { recognitionRef.current.start(); } catch(e) {}
          } else {
             setIsListening(false);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
           console.error("Speech recognition error:", event.error);
           if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
              isListeningRef.current = false;
              setIsListening(false);
           }
        };
      }
    }
  }, []);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Try using Chrome or Edge.");
      return;
    }
    if (isListeningRef.current) {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current.stop();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        isListeningRef.current = true;
        setIsListening(true);
        recognitionRef.current.start();
      } catch (err) {
        console.error("Microphone error:", err);
        alert("Microphone access denied. Please allow microphone permissions in your browser settings to use voice input, or check if your device is properly connected.");
      }
    }
  };

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

  const sendMessage = async (messageText: string) => {
    if ((!messageText.trim() && !pendingFile) || isLoading || isUploadingAttachment) return;

    // Hide quick actions once the user sends something
    setShowQuickActions(false);

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
      content: messageText.trim(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (label: string) => {
    sendMessage(label);
  };

  return (
    <div className="chatbot-page" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Drag & Drop Overlay */}
      <div className={`drag-overlay ${isDragging ? "active" : ""}`} style={{
        position: 'absolute', inset: 0, background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        border: '2px dashed var(--primary)', borderRadius: '24px', margin: '2rem', pointerEvents: 'none',
        transition: 'all 0.3s ease', opacity: isDragging ? 1 : 0, visibility: isDragging ? 'visible' : 'hidden'
      }}>
        <svg style={{ width: '80px', height: '80px', color: 'var(--primary)', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Drop files to upload</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Images, PDFs, or Documents</p>
      </div>

      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header-premium">
          <div className="chatbot-header-main">
            <div className="chatbot-logo-circle">
              <img src="/chatbot.webp" alt="CartGenie AI" />
            </div>
            <div className="chatbot-header-text">
              <h1>CartGenie AI</h1>
              <p>Online</p>
            </div>
          </div>
          <Link href="/" className="chatbot-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
        </div>

        {/* Messages */}
        <div className="chatbot-messages" ref={messagesContainerRef}>
          {/* Bubble background */}
          <div className="chat-bg-blobs"></div>

          {/* Spacer pushes content to bottom */}
          <div className="chat-spacer"></div>

          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.role === "user" ? "user" : "bot"}`}>
              <div className="message-avatar-wrapper">
                <div className="message-avatar-img">
                  {msg.role === "bot" ? <BotIcon /> : <UserIcon />}
                </div>
              </div>
              
              <div className="message-content">
                <div className="message-sender">{msg.role === "bot" ? "CartGenie" : "You"}</div>
                <div className="message-bubble">
                  {msg.content}
                  
                  {msg.attachmentUrl && msg.attachmentName && (
                    <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', maxWidth: '100%' }}>
                      {msg.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                        <img src={msg.attachmentUrl} alt="Attachment" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {msg.attachmentName}
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Quick Action Chips — show only when conversation is fresh */}
          {showQuickActions && messages.length <= 1 && !isLoading && (
            <div className="quick-actions">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  className="quick-action-chip"
                  onClick={() => handleQuickAction(action.label)}
                  type="button"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="message-row bot">
              <div className="message-avatar-wrapper">
                <div className="message-avatar-img">
                  <BotIcon />
                </div>
              </div>
              <div className="message-content">
                <div className="message-sender">CartGenie</div>
                <div className="message-bubble" style={{ padding: '0.65rem 1.15rem' }}>
                  <div className="loading-dots-premium">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="chatbot-form-wrapper">
          <form className="chatbot-form" onSubmit={handleSubmit}>
            {/* Pending File Preview */}
            {pendingFile && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ position: 'relative', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.25rem', display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                  {pendingPreview ? (
                    <img src={pendingPreview} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <button type="button" onClick={clearPendingFile} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            )}

            <div className="chatbot-input-row">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                onChange={handleFileChange}
              />
              
              <input
                type="text"
                className="chatbot-input"
                placeholder={isUploadingAttachment ? "Uploading file..." : "What is on your mind?"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isUploadingAttachment}
              />

              <button 
                type="button" 
                className="input-icon-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Attach image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button 
                type="submit" 
                className="chatbot-send-btn" 
                disabled={(!input.trim() && !pendingFile) || isLoading || isUploadingAttachment}
              >
                {isUploadingAttachment ? (
                   <svg className="animate-spin" style={{width: '18px', height: '18px', animation: 'spin 1s linear infinite'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
