'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleFile = (selectedFile: File) => {
    setMessage('');
    setError('');
    setUploadedUrl(null);
    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setMessage(`Success! Uploaded: ${data.file.name}`);
      setUploadedUrl(data.file.url);
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style>{`
        .glass-upload-container {
          max-width: 500px;
          margin: 2rem auto;
          padding: 2.5rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }
        .glass-upload-container:hover {
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
        }
        .drop-zone {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          margin-bottom: 1.5rem;
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .drop-zone:hover, .drop-zone.dragging {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          transform: scale(1.02);
        }
        .drop-zone-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.7);
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .drop-zone:hover .drop-zone-icon, .drop-zone.dragging .drop-zone-icon {
          transform: translateY(-5px);
          color: #3b82f6;
        }
        .file-input-hidden {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .preview-container {
          margin-bottom: 1.5rem;
          text-align: left;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .preview-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .preview-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .preview-details {
          flex: 1;
          overflow: hidden;
        }
        .preview-name {
          color: #fff;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.25rem;
        }
        .preview-size {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }
        .animated-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          color: #fff;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        .animated-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }
        .animated-btn:active:not(:disabled) {
          transform: translateY(1px);
        }
        .animated-btn:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        .animated-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.5s ease;
        }
        .animated-btn:hover:not(:disabled)::after {
          left: 100%;
        }
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 0.5rem;
          vertical-align: middle;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .status-msg {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.95rem;
          animation: slideUp 0.3s ease forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .status-success {
          background: rgba(74, 222, 128, 0.1);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.2);
        }
        .status-error {
          background: rgba(248, 113, 113, 0.1);
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.2);
        }
      `}</style>

      <div className="glass-upload-container">
        <h3 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>
          Upload Document
        </h3>
        
        <div 
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="file-input-hidden"
          />
          <svg className="drop-zone-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p style={{ color: '#fff', fontWeight: 500, marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            Choose a file or drag & drop it here
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
            JPEG, PNG, PDF, and DOC formats, up to 50MB
          </p>
        </div>

        {file && (
          <div className="preview-container">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="preview-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
            <div className="preview-details">
              <div className="preview-name">{file.name}</div>
              <div className="preview-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button 
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
              aria-label="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="animated-btn"
        >
          {uploading ? (
            <>
              <span className="spinner"></span>
              Uploading...
            </>
          ) : (
            'Upload File'
          )}
        </button>

        {message && (
          <div className="status-msg status-success">
            <p style={{ margin: 0 }}>{message}</p>
            {uploadedUrl && (
              <a 
                href={uploadedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '0.5rem', color: '#3b82f6', textDecoration: 'underline', fontSize: '0.9rem' }}
              >
                View Uploaded File
              </a>
            )}
          </div>
        )}

        {error && (
          <div className="status-msg status-error">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
