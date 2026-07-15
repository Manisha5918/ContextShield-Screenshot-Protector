import React, { useState } from 'react';

export function RawTextConsole({ text, confidence }) {
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <div className="panel-card ocr-console-panel" id="ocr-console">
      <div className="panel-title-group">
        <h3>OCR Console</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {confidence > 0 && (
            <span className="ocr-confidence-badge">
              {confidence}% Conf.
            </span>
          )}
          {text && (
            <button 
              className="action-btn-secondary" 
              onClick={handleCopyText}
              style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      <div className="ocr-console-area">
        {text ? (
          <pre>{text}</pre>
        ) : (
          <div className="panel-empty-state" style={{ minHeight: '200px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '8px' }}>
              <polyline points="4 17 10 11 4 5"/>
              <line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
            <h4>Console Offline</h4>
            <p style={{ fontSize: '12px' }}>Waiting for OCR textual buffer stream...</p>
          </div>
        )}
      </div>
    </div>
  );
}
