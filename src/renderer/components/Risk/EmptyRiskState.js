import React from 'react';
import { Card } from '../Common/Card.js';

export function EmptyRiskState() {
  return (
    <Card className="no-risks-card">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="no-risk-svg">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>No deterministic matches found.</span>
      <span className="no-risks-subtext">Based only on current deterministic detection rules.</span>
    </Card>
  );
}
