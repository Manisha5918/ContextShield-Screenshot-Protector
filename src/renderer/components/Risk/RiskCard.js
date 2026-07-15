import { Card } from '../Common/Card.js';
import { Badge } from '../Common/Badge.js';
import { ReviewAction, Severity } from '../../models/types.js';

export function RiskCard({ secret, action, onActionChange }) {
  // Get SVG icon based on severity
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case Severity.Critical:
        return (
          <svg className="risk-card-icon critical" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 14 4-4"/>
            <path d="M3.34 19a10 10 0 1 1 17.32 0Z"/>
            <path d="m9 10 4 4"/>
          </svg>
        );
      case Severity.High:
        return (
          <svg className="risk-card-icon high" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      case Severity.Medium:
        return (
          <svg className="risk-card-icon medium" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
      case Severity.Low:
        return (
          <svg className="risk-card-icon low" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
        );
    }
  };

  return (
    <Card className={`risk-card severity-${secret.severity.toLowerCase()}`}>
      <div className="risk-card-top">
        <div className="risk-title-wrapper">
          {getSeverityIcon(secret.severity)}
          <div className="risk-title-details">
            <span className="risk-type-label">{secret.type}</span>
            <Badge className={`severity-badge ${secret.severity.toLowerCase()}`}>
              {secret.severity} Risk
            </Badge>
          </div>
        </div>

        {/* Review Actions Toggle Pill */}
        <div className="risk-action-controller">
          <button 
            className={`action-btn btn-mask ${action === ReviewAction.Mask ? 'active' : ''}`}
            onClick={() => onActionChange(secret.id, ReviewAction.Mask)}
            title="Redact this value"
          >
            Redact
          </button>
          <button 
            className={`action-btn btn-keep ${action === ReviewAction.Keep ? 'active' : ''}`}
            onClick={() => onActionChange(secret.id, ReviewAction.Keep)}
            title="Keep this value visible"
          >
            Keep
          </button>
          <button 
            className={`action-btn btn-ignore ${action === ReviewAction.Ignore ? 'active' : ''}`}
            onClick={() => onActionChange(secret.id, ReviewAction.Ignore)}
            title="Ignore this finding"
          >
            Ignore
          </button>
        </div>
      </div>

      <div className="risk-card-body">
        <div className="risk-match-highlight">
          <strong>Detected:</strong> <code>{secret.matchedText}</code>
        </div>
        <div className="risk-recommendation">
          <strong>Action:</strong> {secret.recommendation}
        </div>
        {secret.context && (
          <div className="risk-context">
            <strong>Context:</strong> <em>"{secret.context.trim()}"</em>
          </div>
        )}
      </div>

      <div className="risk-metadata">
        <span>Reliability: {secret.confidence}%</span>
        <span>|</span>
        <span>Blocks: {secret.relatedWords.length}</span>
        {secret.positionalMappingIncomplete && (
          <>
            <span>|</span>
            <span className="incomplete-badge">Approx. Bounding Box</span>
          </>
        )}
      </div>
    </Card>
  );
}
