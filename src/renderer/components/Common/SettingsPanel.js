import React, { useState } from 'react';
import { DETECTION_RULES } from '../../detectionService.js';

export function SettingsPanel({ settings, onSave }) {
  const [activeTab, setActiveTab] = useState('general');

  const handleToggle = (key) => {
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    onSave(updated);
  };

  const handleRuleToggle = (ruleName) => {
    const updatedRules = { ...settings.enabledRules };
    updatedRules[ruleName] = updatedRules[ruleName] === false;
    const updated = {
      ...settings,
      enabledRules: updatedRules
    };
    onSave(updated);
  };

  const handleNumberChange = (key, value) => {
    const updated = {
      ...settings,
      [key]: value
    };
    onSave(updated);
  };

  const handleSelectChange = (key, value) => {
    const updated = {
      ...settings,
      [key]: value
    };
    onSave(updated);
  };

  return (
    <div className="panel-card settings-panel" id="settings-panel">
      <div className="panel-title-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <h3>Settings</h3>
        </div>
        <div className="settings-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border-card)', gap: '8px', paddingBottom: '4px' }}>
          <button 
            className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
            style={{ fontSize: '13px', fontWeight: 600, background: 'transparent', padding: '6px 12px', color: activeTab === 'general' ? 'var(--primary-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'general' ? '2px solid var(--primary-color)' : 'none' }}
          >
            General
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
            style={{ fontSize: '13px', fontWeight: 600, background: 'transparent', padding: '6px 12px', color: activeTab === 'rules' ? 'var(--primary-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'rules' ? '2px solid var(--primary-color)' : 'none' }}
          >
            Rules ({DETECTION_RULES.length})
          </button>
        </div>
      </div>

      <div className="settings-scroll-box" style={{ flex: 1, marginTop: '8px' }}>
        {activeTab === 'general' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Clipboard Monitoring */}
            <div className="setting-item-row">
              <div className="setting-item-label">
                <span className="setting-item-title">Clipboard monitoring</span>
                <span className="setting-item-desc">Monitor clipboard screenshots</span>
              </div>
              <label className="toggle-switch small">
                <input 
                  type="checkbox" 
                  checked={settings.clipboardMonitoring} 
                  onChange={() => handleToggle('clipboardMonitoring')}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Polling Interval */}
            <div className="setting-item-row">
              <div className="setting-item-label">
                <span className="setting-item-title">Polling interval (ms)</span>
                <span className="setting-item-desc">How often clipboard is polled</span>
              </div>
              <input 
                type="number" 
                className="setting-dropdown"
                min="200" 
                max="5000" 
                step="100"
                value={settings.pollingInterval}
                onChange={(e) => handleNumberChange('pollingInterval', parseInt(e.target.value) || 500)}
                style={{ width: '70px', padding: '4px', textAlign: 'center' }}
              />
            </div>

            {/* Blur Radius */}
            <div className="setting-item-row">
              <div className="setting-item-label">
                <span className="setting-item-title">Blur intensity (px)</span>
                <span className="setting-item-desc">Blur radius for redactions</span>
              </div>
              <div className="setting-range-slider">
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={settings.blurRadius}
                  onChange={(e) => handleNumberChange('blurRadius', parseInt(e.target.value))}
                />
                <span className="setting-range-val">{settings.blurRadius}px</span>
              </div>
            </div>

            {/* Max History */}
            <div className="setting-item-row">
              <div className="setting-item-label">
                <span className="setting-item-title">Max log size</span>
                <span className="setting-item-desc">Retained scans count</span>
              </div>
              <input 
                type="number" 
                className="setting-dropdown"
                min="5" 
                max="20" 
                value={settings.historySize}
                onChange={(e) => handleNumberChange('historySize', Math.min(20, Math.max(5, parseInt(e.target.value) || 20)))}
                style={{ width: '70px', padding: '4px', textAlign: 'center' }}
              />
            </div>

            {/* Theme selector */}
            <div className="setting-item-row">
              <div className="setting-item-label">
                <span className="setting-item-title">Visual Theme</span>
                <span className="setting-item-desc">App color appearance</span>
              </div>
              <select 
                className="setting-dropdown"
                value={settings.theme}
                onChange={(e) => handleSelectChange('theme', e.target.value)}
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>

            {/* OCR Language */}
            <div className="setting-item-row">
              <div className="setting-item-label">
                <span className="setting-item-title">OCR language</span>
                <span className="setting-item-desc">Language parser dictionary</span>
              </div>
              <select 
                className="setting-dropdown"
                value={settings.ocrLanguage}
                onChange={(e) => handleSelectChange('ocrLanguage', e.target.value)}
              >
                <option value="eng">English (Offline)</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="setting-item-row">
              <div className="setting-item-label">
                <span className="setting-item-title">Desktop notifications</span>
                <span className="setting-item-desc">Notify on threat detection</span>
              </div>
              <label className="toggle-switch small">
                <input 
                  type="checkbox" 
                  checked={settings.notifications} 
                  onChange={() => handleToggle('notifications')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Toggle regex scanning rules. Disabled rules are skipped entirely.
            </span>
            {DETECTION_RULES.map((rule) => {
              const isEnabled = settings.enabledRules[rule.name] !== false;
              return (
                <div key={rule.name} className="setting-item-row" style={{ paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{rule.name}</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--primary-color)' }}>
                      {rule.category}
                    </span>
                  </div>
                  <label className="toggle-switch small">
                    <input 
                      type="checkbox" 
                      checked={isEnabled} 
                      onChange={() => handleRuleToggle(rule.name)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
