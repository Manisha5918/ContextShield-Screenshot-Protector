import React, { useState } from 'react';

export function Onboarding({ onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to ContextShield",
      description: "Your local privacy companion for developer screenshots. Automatically detect and redact sensitive secrets before they leave your clipboard.",
      icon: (
        <svg className="onboard-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    },
    {
      title: "1. Enable Clipboard Guard",
      description: "Toggle Clipboard Guard at the top of the dashboard. This starts a localized polling loop that monitors your clipboard for new captures.",
      icon: (
        <svg className="onboard-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    },
    {
      title: "2. Take a Screenshot",
      description: "Use your operating system shortcut (e.g. Win + Shift + S on Windows) to take a screenshot. ContextShield will import it instantly.",
      icon: (
        <svg className="onboard-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      )
    },
    {
      title: "3. Review Detected Secrets",
      description: "Our local pattern matching and OCR scanner identifies database credentials, API keys, credentials, PII, and IPs, highlighting their exact positions.",
      icon: (
        <svg className="onboard-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )
    },
    {
      title: "4. Generate & Copy Safe Copy",
      description: "Select your preferred View Mode (Blur, Pixelate, or Black Box) and click 'Copy Safe Image'. The redacted image is copied directly back to your clipboard.",
      icon: (
        <svg className="onboard-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="onboard-modal-overlay">
      <div className="onboard-modal-content">
        <button className="onboard-close-btn" onClick={onClose} aria-label="Close onboarding">✕</button>
        
        <div className="onboard-step-container">
          <div className="onboard-icon-wrapper">
            {steps[step].icon}
          </div>
          
          <h2 className="onboard-step-title">{steps[step].title}</h2>
          <p className="onboard-step-desc">{steps[step].description}</p>
        </div>

        {/* Progress indicators */}
        <div className="onboard-progress-bar">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`onboard-progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>

        <div className="onboard-footer-actions">
          <button className="onboard-btn-secondary" onClick={onClose}>
            Skip Guide
          </button>
          
          <div className="onboard-nav-group">
            {step > 0 && (
              <button className="onboard-btn-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            <button className="onboard-btn-primary" onClick={handleNext}>
              {step === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
