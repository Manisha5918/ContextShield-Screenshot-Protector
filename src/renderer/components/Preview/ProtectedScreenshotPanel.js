import React from 'react';

export function ProtectedScreenshotPanel({
  screenshot,
  protectedScreenshot,
  isProtectedGenerating,
  viewMode,
  onViewModeChange,
  onCopySafeImage
}) {
  
  const handleDownloadPNG = () => {
    if (!protectedScreenshot) return;
    const link = document.createElement('a');
    link.download = `protected-screenshot-${Date.now()}.png`;
    link.href = protectedScreenshot;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!screenshot) {
    return (
      <div className="panel-card protected-panel">
        <div className="panel-title-group">
          <h3>Protected Copy</h3>
        </div>
        <div className="panel-empty-state">
          <div className="icon">🔒</div>
          <h4>No Output Generated</h4>
          <p>Once a screenshot is captured and reviewed, the safe redacted output copy will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-card protected-panel">
      <div className="panel-title-group">
        <h3>Protected Copy</h3>
      </div>

      {/* Segmented view mode controller */}
      <div className="protected-view-mode-container">
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
          title="Redact with solid boxes"
        >
          Black Box
        </button>
      </div>

      {/* Image container with live updates */}
      <div className="protected-img-card">
        {protectedScreenshot ? (
          <img 
            src={protectedScreenshot} 
            alt="Protected Redacted Screenshot" 
            className="protected-img"
          />
        ) : (
          <div className="panel-empty-state" style={{ minHeight: '150px' }}>
            <span>Compiling live protection...</span>
          </div>
        )}

        {isProtectedGenerating && (
          <div className="protected-overlay">
            <div className="mini-spinner"></div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="protected-action-column">
        <button 
          className="copy-safe-btn" 
          onClick={onCopySafeImage}
          disabled={!protectedScreenshot || isProtectedGenerating}
          title="Copy safe image to clipboard"
        >
          {isProtectedGenerating ? 'Compiling Safe Copy...' : 'Copy Safe Image'}
        </button>
        <button 
          className="action-btn-secondary" 
          onClick={handleDownloadPNG}
          disabled={!protectedScreenshot || isProtectedGenerating}
          title="Download safe image as PNG file"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
