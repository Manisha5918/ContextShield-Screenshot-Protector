import React, { useState } from 'react';
import { RiskCard } from './RiskCard.js';
import { ReviewAction, Severity } from '../../models/types.js';

export function PrivacyReviewPanel({
  screenshot,
  detectedSecrets,
  actions,
  onActionChange,
  onAutoProtect,
  onReset
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  if (!screenshot) {
    return (
      <div className="panel-card review-panel">
        <div className="panel-title-group">
          <h3>Privacy Review</h3>
        </div>
        <div className="panel-empty-state">
          <div className="icon">🛡️</div>
          <h4>Ready for Scan</h4>
          <p>No screenshot captured. Capture a screenshot to perform privacy reviews on credentials.</p>
        </div>
      </div>
    );
  }

  // Filter secrets
  const filteredSecrets = detectedSecrets.filter((secret) => {
    const matchesSearch = 
      secret.matchedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      secret.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = 
      selectedSeverity === 'ALL' || 
      secret.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="panel-card review-panel">
      <div className="panel-title-group">
        <h3>Privacy Review</h3>
        <span className={`risk-summary-badge ${detectedSecrets.length > 0 ? 'risks-found' : 'clean'}`} style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
          {detectedSecrets.length === 0 ? 'Clean' : `${detectedSecrets.length} Alert${detectedSecrets.length > 1 ? 's' : ''}`}
        </span>
      </div>

      <div className="review-controls">
        {/* Search bar & Category filter */}
        <div className="search-filter-row">
          <div className="search-input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search detected text..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
          </div>
        </div>

        {/* Severity category filters */}
        <div className="category-filters">
          <button 
            className={`filter-btn ${selectedSeverity === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedSeverity('ALL')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${selectedSeverity === Severity.Critical ? 'active' : ''}`}
            onClick={() => setSelectedSeverity(Severity.Critical)}
          >
            Critical
          </button>
          <button 
            className={`filter-btn ${selectedSeverity === Severity.High ? 'active' : ''}`}
            onClick={() => setSelectedSeverity(Severity.High)}
          >
            High
          </button>
          <button 
            className={`filter-btn ${selectedSeverity === Severity.Medium ? 'active' : ''}`}
            onClick={() => setSelectedSeverity(Severity.Medium)}
          >
            Medium
          </button>
          <button 
            className={`filter-btn ${selectedSeverity === Severity.Low ? 'active' : ''}`}
            onClick={() => setSelectedSeverity(Severity.Low)}
          >
            Low
          </button>
        </div>

        {/* Auto protect & reset button */}
        {detectedSecrets.length > 0 && (
          <div className="action-row">
            <button 
              className="action-btn-primary" 
              onClick={onAutoProtect}
              title="Automatically redact Critical and High findings, Keep others"
            >
              Auto Protect
            </button>
            <button 
              className="action-btn-secondary" 
              onClick={onReset}
              title="Reset to recommended actions"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <div className="review-list">
        {filteredSecrets.length > 0 ? (
          filteredSecrets.map((secret) => (
            <RiskCard 
              key={secret.id} 
              secret={secret} 
              action={actions[secret.id] || ReviewAction.Keep}
              onActionChange={onActionChange}
            />
          ))
        ) : (
          <div className="panel-empty-state" style={{ minHeight: '120px' }}>
            <span style={{ fontSize: '13px' }}>No matching warnings found.</span>
          </div>
        )}
      </div>
    </div>
  );
}
