import { RiskCard } from './RiskCard.js';
import { EmptyRiskState } from './EmptyRiskState.js';
import { ReviewAction } from '../../models/types.js';

export function RiskReport({ 
  detectedSecrets, 
  actions, 
  onActionChange, 
  onAutoProtect, 
  onReset 
}) {
  return (
    <section className="risk-report-section">
      <div className="risk-report-header">
        <div className="risk-report-title-group">
          <h3>Privacy Risk Report</h3>
          <span className={`risk-summary-badge ${detectedSecrets.length > 0 ? 'risks-found' : 'clean'}`}>
            {detectedSecrets.length > 0 
              ? `${detectedSecrets.length} Alert${detectedSecrets.length > 1 ? 's' : ''}` 
              : 'No matches'
            }
          </span>
        </div>
        
        {detectedSecrets.length > 0 && (
          <div className="risk-report-controls">
            <button 
              className="risk-ctrl-btn btn-auto" 
              onClick={onAutoProtect} 
              title="Auto Protect: Mask High severity, Keep others"
            >
              Auto Protect
            </button>
            <button 
              className="risk-ctrl-btn btn-reset" 
              onClick={onReset} 
              title="Reset to recommended defaults"
            >
              Reset
            </button>
          </div>
        )}
      </div>
      
      <div className="risk-list">
        {detectedSecrets.length > 0 ? (
          <>
            {detectedSecrets.map((secret) => (
              <RiskCard 
                key={secret.id} 
                secret={secret} 
                action={actions[secret.id] || ReviewAction.Keep}
                onActionChange={onActionChange}
              />
            ))}
            <div className="risk-engine-disclaimer">
              * Confidence represents rule reliability, not a guarantee that the detected value is a secret.
            </div>
          </>
        ) : (
          <EmptyRiskState />
        )}
      </div>
    </section>
  );
}
