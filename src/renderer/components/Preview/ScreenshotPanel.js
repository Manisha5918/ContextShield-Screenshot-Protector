import React, { useState } from 'react';
import { Card } from '../Common/Card.js';
import { ImageCanvas } from './ImageCanvas.js';
import { LoadingOverlay } from './LoadingOverlay.js';

export function ScreenshotPanel({
  screenshot,
  secrets,
  actions,
  showHighlights,
  onToggleHighlights,
  isGuardOn,
  isProcessingOcr,
  ocrProgress
}) {
  // Zoom & Pan states managed here so the toolbar can control them
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale((prev) => Math.min(5, prev + 0.25));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(1, prev - 0.25);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Card className="panel-card screenshot-panel">
      <div className="panel-title-group">
        <h3>Screenshot Preview</h3>
        {screenshot && (
          <label className="toggle-highlights-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <input 
              type="checkbox" 
              checked={showHighlights} 
              onChange={onToggleHighlights} 
            />
            <span>Highlights</span>
          </label>
        )}
      </div>

      {!screenshot ? (
        <div className="panel-empty-state">
          <div className="icon">📷</div>
          <h4>Waiting for Screenshot</h4>
          <p>
            {isGuardOn ? (
              <>
                Press <span className="kbd-shortcut">Win + Shift + S</span> to begin scanning. ContextShield will analyze and display your screenshot automatically.
              </>
            ) : (
              <>
                Clipboard Guard is currently offline. Enable it in the header to start scanning screenshots automatically.
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="screenshot-panel-viewport">
          <div className="canvas-instruction-badge">
            Scale: {Math.round(scale * 100)}%
          </div>

          <ImageCanvas 
            src={screenshot} 
            secrets={secrets} 
            actions={actions} 
            showHighlights={showHighlights}
            externalScale={scale}
            setExternalScale={setScale}
            externalPosition={position}
            setExternalPosition={setPosition}
          />

          {isProcessingOcr && <LoadingOverlay progress={ocrProgress} />}

          <div className="pan-zoom-toolbar">
            <button className="toolbar-action-btn" onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            <button className="toolbar-action-btn" onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            <button className="toolbar-action-btn" onClick={handleResetZoom} title="Fit Content" aria-label="Fit View">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </button>
            <button className="toolbar-action-btn" onClick={handleResetZoom} title="Reset View" aria-label="Reset View">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
