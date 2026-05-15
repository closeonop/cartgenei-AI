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
        <div className="chatbot-header">
          <Link href="/" className="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </Link>
          <div className="chatbot-title" style={{ flex: 1, justifyContent: 'center' }}>
            <div className="chatbot-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M9 9h6"></path>
                <path d="M9 13h6"></path>
              </svg>
            </div>
            <div>
              <h1 style={{ margin: 0 }}>CartGenie AI</h1>
              <span className="online-status">● Online</span>
            </div>
          </div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages" ref={messagesContainerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
              <div className="message-bubble">
                {msg.content}
                
                {msg.attachmentUrl && msg.attachmentName && (
                  <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', maxWidth: '100%' }}>
                    {msg.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                      <img src={msg.attachmentUrl} alt="Attachment" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', color: 'var(--primary)', fontWeight: 500, fontSize: '0.85rem' }}>
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
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="message-bubble loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="chatbot-form-wrapper">
          <form className="chatbot-form" onSubmit={handleSubmit}>
            {/* Pending File Preview */}
            {pendingFile && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0 0.5rem', marginTop: '0.25rem' }}>
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
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
                <input
                  type="text"
                  className="chatbot-input"
                  placeholder={isUploadingAttachment ? "Uploading file..." : "Send a message to CartGenie AI..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isUploadingAttachment}
              />
              
              <button 
                type="submit" 
                className="chatbot-send-btn" 
                style={{ flexShrink: 0 }}
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
    </div>
  );
}
