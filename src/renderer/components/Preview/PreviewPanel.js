import { Card } from '../Common/Card.js';
import { ImageCanvas } from './ImageCanvas.js';
import { LoadingOverlay } from './LoadingOverlay.js';
import { ReviewAction } from '../../models/types.js';

export function PreviewPanel({
  screenshot,
  protectedScreenshot,
  secrets,
  actions,
  showHighlights,
  onToggleHighlights,
  isGuardOn,
  isProcessingOcr,
  ocrProgress,
  onCopySafeImage,
  isProtectedGenerating,
  viewMode,
  onViewModeChange
}) {
  
  if (!screenshot) {
    return (
      <section className="preview-section solo-placeholder">
        <div className="preview-title">
          <span>Screenshot Preview</span>
        </div>
        <Card className="preview-card">
          <div className="placeholder-content">
            <div className="placeholder-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            {isGuardOn ? (
              <>
                <h3>Ready for Screenshot Capture</h3>
                <p>
                  Take a screenshot using <span className="kbd-shortcut">Win + Shift + S</span>. 
                  ContextShield will detect and import it instantly.
                </p>
              </>
            ) : (
              <>
                <h3>Clipboard Guard Offline</h3>
                <p>
                  Enable Clipboard Guard above to start scanning your developer captures automatically.
                </p>
              </>
            )}
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="comparison-preview-section">
      {/* Side-by-Side Panels */}
      <div className="comparison-grid">
        
        {/* Panel 1: Original View */}
        <div className="comparison-panel-card">
          <div className="panel-header">
            <h4>Original Screenshot</h4>
            <label className="toggle-highlights-checkbox">
              <input 
                type="checkbox" 
                checked={showHighlights} 
                onChange={onToggleHighlights} 
              />
              <span>Show Highlights</span>
            </label>
          </div>
          <div className="panel-body relative-box">
            <ImageCanvas 
              src={screenshot} 
              secrets={secrets} 
              actions={actions} 
              showHighlights={showHighlights} 
            />
            {isProcessingOcr && <LoadingOverlay progress={ocrProgress} />}
          </div>
        </div>

        {/* Panel 2: Protected View */}
        <div className="comparison-panel-card">
          <div className="panel-header">
            <h4>Protected Screenshot</h4>
            <div className="panel-header-actions">
              {/* View Mode Select Pills */}
              <div className="view-mode-container">
                <button 
                  className={`view-mode-pill ${viewMode === 'blur' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('blur')}
                  title="Blur redacted regions"
                >
                  Blur
                </button>
                <button 
                  className={`view-mode-pill ${viewMode === 'pixelate' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('pixelate')}
                  title="Pixelate redacted regions"
                >
                  Pixelate
                </button>
                <button 
                  className={`view-mode-pill ${viewMode === 'black_box' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('black_box')}
                  title="Cover regions with dark box"
                >
                  Solid Box
                </button>
              </div>

              <button 
                className="panel-action-btn btn-copy"
                onClick={onCopySafeImage}
                disabled={isProtectedGenerating || isProcessingOcr}
                title="Automatically generate protected copy and write to system clipboard"
              >
                {isProtectedGenerating ? 'Drawing...' : 'Copy Safe Image'}
              </button>
            </div>
          </div>
          
          <div className="panel-body flex-centered relative-box">
            {protectedScreenshot ? (
              <img 
                src={protectedScreenshot} 
                alt="Protected Screenshot Preview" 
                className="screenshot-image protected-border"
                style={{ display: 'block', width: '100%', height: 'auto', userSelect: 'none' }}
              />
            ) : (
              <div className="protected-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.4 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Generating live protection preview...</span>
              </div>
            )}
            {isProtectedGenerating && (
              <div className="protected-generating-overlay">
                <div className="mini-spinner"></div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
