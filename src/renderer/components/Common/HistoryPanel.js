import React from 'react';

export function HistoryPanel({ history, onSelect, onDelete, onClear }) {
  const formatTime = (ts) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  return (
    <div className="panel-card history-panel" id="history-panel">
      <div className="panel-title-group">
        <h3>Capture History</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="history-count-tag" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {history.length} / 20
          </span>
          {history.length > 0 && (
            <button 
              className="history-clear-btn" 
              onClick={onClear} 
              title="Clear all local history"
              style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', fontSize: '12px', fontWeight: 600 }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="history-list-box">
        {history.length === 0 ? (
          <div className="panel-empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '8px' }}>
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h4>No scans recorded</h4>
            <p style={{ fontSize: '12px' }}>Screenshots captured while Clipboard Guard is online will display here.</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-row-item" onClick={() => onSelect(item)}>
              {/* Image Thumbnail */}
              <div className="history-thumb-preview">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt="Scan Thumbnail" className="history-thumb-img" />
                ) : (
                  <div className="history-thumb-placeholder" style={{ color: 'var(--text-muted)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Meta information */}
              <div className="history-meta">
                <span className="history-time">{formatTime(item.timestamp)}</span>
                
                <div className="history-badges">
                  {item.detectedRisksCount > 0 ? (
                    <span className="history-badge-alert">
                      {item.detectedRisksCount} Alert{item.detectedRisksCount > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="history-badge-clean">Clean</span>
                  )}
                  {item.ocrConfidence > 0 && (
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                      OCR: {item.ocrConfidence}%
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="history-item-actions" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="delete-hist-btn"
                  onClick={() => onDelete(item.id)}
                  title="Delete scan"
                  aria-label="Delete History Item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
