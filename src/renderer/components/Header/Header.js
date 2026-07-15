import React from 'react';
import { Badge } from '../Common/Badge.js';

export function Header({
  status,
  isGuardOn,
  onToggleChange,
  theme,
  onThemeToggle,
  onScrollToSection
}) {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo-icon">
          {/* Shield Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="title-area">
          <h1>ContextShield</h1>
          <p>Screenshot Protector</p>
        </div>
      </div>

      <div className="header-right">
        {/* Clipboard Guard Toggle */}
        <div className="clipboard-switch-wrapper">
          <span className="clipboard-switch-label">Clipboard Guard</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isGuardOn} 
              onChange={onToggleChange}
              id="clipboard-guard-checkbox"
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Status Badge */}
        <Badge className={`status-badge ${status}`}>
          <span className="dot"></span>
          <span>
            {status === 'inactive' && 'Shield Offline'}
            {status === 'active' && 'Shield Online'}
            {status === 'detected' && 'Threat Isolated'}
          </span>
        </Badge>

        {/* History Shortcut Button */}
        <button 
          className="header-btn" 
          onClick={() => onScrollToSection('history-panel')} 
          title="Scroll to Capture History"
          aria-label="View History"
        >
          {/* History Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </button>

        {/* Settings Shortcut Button */}
        <button 
          className="header-btn" 
          onClick={() => onScrollToSection('settings-panel')} 
          title="Scroll to Configuration"
          aria-label="View Settings"
        >
          {/* Settings Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        {/* Theme Toggle Button */}
        <button 
          className="header-btn" 
          onClick={onThemeToggle} 
          title="Toggle Color Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            /* Sun Icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          ) : (
            /* Moon Icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
