import React from 'react';

export function LoadingOverlay({ progress }) {
  return (
    <div className="ocr-progress-overlay">
      <div className="ocr-progress-spinner"></div>
      <div className="ocr-progress-text">Extracting text locally ({progress}%)</div>
    </div>
  );
}
