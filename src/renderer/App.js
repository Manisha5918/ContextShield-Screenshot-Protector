import React, { useState, useEffect } from 'react';
import { runLocalOCR } from './ocrService.js';
import { detectSecrets } from './detectionService.js';
import { ReviewAction, Severity } from './models/types.js';

// Import UI submodules
import { Header } from './components/Header/Header.js';
import { ScreenshotPanel } from './components/Preview/ScreenshotPanel.js';
import { PrivacyReviewPanel } from './components/Risk/PrivacyReviewPanel.js';
import { ProtectedScreenshotPanel } from './components/Preview/ProtectedScreenshotPanel.js';
import { RawTextConsole } from './components/OCR/RawTextConsole.js';
import { Onboarding } from './components/Common/Onboarding.js';
import { SettingsPanel } from './components/Common/SettingsPanel.js';
import { HistoryPanel } from './components/Common/HistoryPanel.js';

const DEFAULT_SETTINGS = {
  clipboardMonitoring: false,
  enabledRules: {},
  ocrLanguage: 'eng',
  theme: 'light',
  blurRadius: 15,
  viewMode: 'blur',
  historySize: 20,
  pollingInterval: 500,
  notifications: true
};

export default function App() {
  const [isGuardOn, setIsGuardOn] = useState(false);
  const [status, setStatus] = useState('inactive');
  const [screenshot, setScreenshot] = useState(null);
  
  // OCR processing states
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrText, setOcrText] = useState(null);
  const [ocrConfidence, setOcrConfidence] = useState(0);

  // Secret scanner & review states
  const [detectedSecrets, setDetectedSecrets] = useState([]);
  const [reviewActions, setReviewActions] = useState({});
  const [protectedScreenshot, setProtectedScreenshot] = useState(null);
  const [showHighlights, setShowHighlights] = useState(true);
  const [isProtectedGenerating, setIsProtectedGenerating] = useState(false);

  // Modal Panels Visibility
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('contextshield_onboarded') !== 'true';
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('contextshield_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (localStorage.getItem('contextshield_theme_migrated') !== 'true') {
          parsed.theme = 'light';
          localStorage.setItem('contextshield_settings', JSON.stringify(parsed));
          localStorage.setItem('contextshield_theme_migrated', 'true');
        }
        return parsed;
      } catch (_) {}
    }
    localStorage.setItem('contextshield_theme_migrated', 'true');
    return DEFAULT_SETTINGS;
  });

  const [viewMode, setViewMode] = useState(settings.viewMode);

  // Local History Array
  const [history, setHistory] = useState([]);
  
  // Protected copies session counter
  const [protectedCopiesCount, setProtectedCopiesCount] = useState(() => {
    const saved = localStorage.getItem('contextshield_copies_count');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });

  // Non-blocking toast notification state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Sync theme class with body element
  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${settings.theme}`);
  }, [settings.theme]);

  // Load history metadata from main process on startup
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const items = await window.electronAPI.getHistoryItems();
        setHistory(items);
      } catch (err) {
        console.error('[Renderer] Failed to load history:', err);
      }
    };
    loadHistory();
  }, []);

  // Sync settings viewMode with local state
  useEffect(() => {
    setViewMode(settings.viewMode);
  }, [settings.viewMode]);

  // Handle Clipboard Guard toggle from the Header checkbox
  const handleToggleChange = async (e) => {
    const checked = e.target.checked;
    setIsGuardOn(checked);
    
    // Save to settings
    const updatedSettings = { ...settings, clipboardMonitoring: checked };
    setSettings(updatedSettings);
    localStorage.setItem('contextshield_settings', JSON.stringify(updatedSettings));
    
    // Call Electron main process via contextBridge
    const result = await window.electronAPI.updateMonitorSettings(checked, settings.pollingInterval);
    
    if (result) {
      setStatus('active');
      showToast('Clipboard Guard online.', 'success');
    } else {
      setStatus('inactive');
      setScreenshot(null);
      setOcrText(null);
      setDetectedSecrets([]);
      setReviewActions({});
      setProtectedScreenshot(null);
      setIsProcessingOcr(false);
      showToast('Clipboard Guard offline.', 'info');
    }
  };

  // Setup IPC listener for incoming screenshots
  useEffect(() => {
    let unsubscribe;

    if (isGuardOn) {
      unsubscribe = window.electronAPI.onNewImage(async (dataUrl) => {
        setScreenshot(dataUrl);
        setStatus('detected');
        console.log('[Renderer] New screenshot received.');

        try {
          setIsProcessingOcr(true);
          setOcrProgress(0);
          setOcrText(null);
          setDetectedSecrets([]);
          setReviewActions({});
          setProtectedScreenshot(null);
          
          const result = await runLocalOCR(dataUrl, settings.ocrLanguage, (p) => {
            setOcrProgress(Math.floor(p * 100));
          });
          
          setOcrText(result.text);
          setOcrConfidence(result.confidence);

          console.log('[DEBUG] ocrText:', result.text);
          console.log('[DEBUG] enabledRules:', settings.enabledRules);
          const secrets = detectSecrets(result, settings.enabledRules);
          console.log('[DEBUG] detected secrets:', secrets);
          setDetectedSecrets(secrets);
          
          // Setup default actions: Critical/High -> Mask, others -> Keep
          const defaults = {};
          for (const secret of secrets) {
            defaults[secret.id] = (secret.severity === Severity.Critical || secret.severity === Severity.High) 
              ? ReviewAction.Mask 
              : ReviewAction.Keep;
          }
          setReviewActions(defaults);

          // Trigger Desktop Notification if notifications enabled and risks found
          if (settings.notifications && secrets.length > 0) {
            new Notification('Privacy Alert: Secrets Found', {
              body: `ContextShield detected ${secrets.length} potential secrets in your screenshot. Review before pasting.`
            });
          }

          // Build JPEG thumbnail and save screenshot to local history
          const makeThumbnail = (imgSrc) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => {
                try {
                  const canvas = document.createElement('canvas');
                  canvas.width = 160;
                  canvas.height = 100;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.75));
                  } else {
                    resolve('');
                  }
                } catch (_) {
                  resolve('');
                }
              };
              img.onerror = () => resolve('');
              img.src = imgSrc;
            });
          };

          const thumbnail = await makeThumbnail(dataUrl);
          const historyItem = {
            id: `hist_${Date.now()}`,
            timestamp: Date.now(),
            detectedRisksCount: secrets.length,
            ocrConfidence: result.confidence,
            reviewStatus: 'completed',
            thumbnail
          };

          await window.electronAPI.saveHistoryItem(historyItem, dataUrl);
          const updatedHistory = await window.electronAPI.getHistoryItems();
          setHistory(updatedHistory);

        } catch (err) {
          console.error('[Renderer] OCR/Scanning failed:', err);
          setOcrText(`Error: Local processing failed.\nMessage: ${err?.message || err}\nStack: ${err?.stack || ''}`);
          setOcrConfidence(0);
          setDetectedSecrets([]);
          setReviewActions({});
          setProtectedScreenshot(null);
        } finally {
          setIsProcessingOcr(false);
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isGuardOn, settings]);

  // Global Keyboard Shortcuts Event Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + G toggles Clipboard Guard
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        const nextState = !isGuardOn;
        setIsGuardOn(nextState);
        const updatedSettings = { ...settings, clipboardMonitoring: nextState };
        setSettings(updatedSettings);
        localStorage.setItem('contextshield_settings', JSON.stringify(updatedSettings));
        window.electronAPI.updateMonitorSettings(nextState, settings.pollingInterval).then(res => {
          setStatus(res ? 'active' : 'inactive');
          showToast(res ? 'Guard online.' : 'Guard offline.', 'info');
        });
      }
      // Ctrl + C copies safe image if available
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && screenshot && protectedScreenshot) {
        const activeEl = document.activeElement;
        const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
        if (!isInput) {
          e.preventDefault();
          handleCopySafeImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuardOn, screenshot, protectedScreenshot, settings]);

  // Handle single action state changes
  const handleActionChange = (secretId, action) => {
    setReviewActions((prev) => ({
      ...prev,
      [secretId]: action
    }));
  };

  // Auto Protect: Mask Critical and High severity findings, Keep others
  const handleAutoProtect = () => {
    setReviewActions((prev) => {
      const updated = { ...prev };
      for (const secret of detectedSecrets) {
        if (secret.severity === Severity.Critical || secret.severity === Severity.High) {
          updated[secret.id] = ReviewAction.Mask;
        } else {
          updated[secret.id] = ReviewAction.Keep;
        }
      }
      return updated;
    });
    showToast('Auto Protect rules applied.', 'info');
  };

  // Reset to initial recommended defaults
  const handleReset = () => {
    const defaults = {};
    for (const secret of detectedSecrets) {
      defaults[secret.id] = (secret.severity === Severity.Critical || secret.severity === Severity.High) 
        ? ReviewAction.Mask 
        : ReviewAction.Keep;
    }
    setReviewActions(defaults);
    showToast('Review actions reset to defaults.', 'info');
  };

  // Merge overlapping and adjacent bounding boxes to clean up redactions
  const mergeBoxes = (boxes) => {
    if (boxes.length === 0) return [];
    
    const sorted = [...boxes].sort((a, b) => a.x0 - b.x0);
    const merged = [];

    for (const next of sorted) {
      if (merged.length === 0) {
        merged.push({ ...next });
        continue;
      }

      const last = merged[merged.length - 1];

      const verticalOverlap = 
        Math.max(last.y0, next.y0) <= Math.min(last.y1, next.y1) ||
        Math.abs(last.y0 - next.y0) < 10;

      const horizontalOverlap = next.x0 <= last.x1 + 25;

      if (verticalOverlap && horizontalOverlap) {
        last.x1 = Math.max(last.x1, next.x1);
        last.y0 = Math.min(last.y0, next.y0);
        last.y1 = Math.max(last.y1, next.y1);
      } else {
        merged.push({ ...next });
      }
    }

    return merged;
  };

  // Automatically generate the protected image using Canvas
  const handleGenerateProtected = () => {
    if (!screenshot) return;
    setIsProtectedGenerating(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to obtain canvas context');

        // Draw background base layer
        ctx.drawImage(img, 0, 0);

        // Collect boxes that need to be masked
        const boxesToMask = [];
        for (const secret of detectedSecrets) {
          if (reviewActions[secret.id] === ReviewAction.Mask) {
            boxesToMask.push(...(secret.boundingBoxes || []));
          }
        }

        const merged = mergeBoxes(boxesToMask);

        // Draw redactions
        for (const box of merged) {
          const width = box.x1 - box.x0;
          const height = box.y1 - box.y0;
          if (width <= 0 || height <= 0) continue;

          ctx.save();
          
          // Clip path for rounded borders
          ctx.beginPath();
          ctx.roundRect(box.x0, box.y0, width, height, 4);
          ctx.clip();

          if (viewMode === 'black_box') {
            ctx.fillStyle = '#0f172a';
            ctx.fill();
          } else if (viewMode === 'blur') {
            ctx.filter = `blur(${settings.blurRadius}px)`;
            ctx.drawImage(img, 0, 0);
          } else if (viewMode === 'pixelate') {
            const pixelSize = 8;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = Math.max(1, Math.floor(width / pixelSize));
            tempCanvas.height = Math.max(1, Math.floor(height / pixelSize));
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
              tempCtx.imageSmoothingEnabled = false;
              tempCtx.drawImage(canvas, box.x0, box.y0, width, height, 0, 0, tempCanvas.width, tempCanvas.height);
              
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, box.x0, box.y0, width, height);
            }
          }

          ctx.restore();
        }

        const dataUrl = canvas.toDataURL('image/png');
        setProtectedScreenshot(dataUrl);
      } catch (err) {
        console.error('[Renderer] Canvas redaction failed:', err);
        showToast(`Redaction error: ${err?.message || err}`, 'error');
      } finally {
        setIsProtectedGenerating(false);
      }
    };

    img.src = screenshot;
  };

  // Run auto-regeneration whenever critical states change
  useEffect(() => {
    if (screenshot) {
      handleGenerateProtected();
    } else {
      setProtectedScreenshot(null);
    }
  }, [screenshot, detectedSecrets, reviewActions, viewMode, settings.blurRadius]);

  // Copy safe image and validate
  const handleCopySafeImage = async () => {
    if (!protectedScreenshot) {
      showToast('No protected screenshot available.', 'error');
      return;
    }
    
    try {
      const success = await window.electronAPI.copyImageToClipboard(protectedScreenshot);
      if (success) {
        // Increment copies count
        const nextCopiesCount = protectedCopiesCount + 1;
        setProtectedCopiesCount(nextCopiesCount);
        localStorage.setItem('contextshield_copies_count', nextCopiesCount.toString());

        showToast('Safe redacted image copied to system clipboard!', 'success');
      } else {
        showToast('Clipboard write failed: image rejected.', 'error');
      }
    } catch (err) {
      console.error('[Renderer] Clipboard copy API failed:', err);
      showToast('Error writing safe image to clipboard.', 'error');
    }
  };

  // Reopen screenshot from local history
  const handleReopenHistory = async (item) => {
    try {
      setIsProcessingOcr(true);
      const fullImage = await window.electronAPI.getHistoryImage(item.imagePath);
      if (!fullImage) {
        showToast('Could not load history screenshot file.', 'error');
        return;
      }
      
      setScreenshot(fullImage);
      setStatus('detected');
      
      const result = await runLocalOCR(fullImage, settings.ocrLanguage);
      setOcrText(result.text);
      setOcrConfidence(result.confidence);
      
      const secrets = detectSecrets(result, settings.enabledRules);
      setDetectedSecrets(secrets);
      
      const defaults = {};
      for (const secret of secrets) {
        defaults[secret.id] = (secret.severity === Severity.Critical || secret.severity === Severity.High) 
          ? ReviewAction.Mask 
          : ReviewAction.Keep;
      }
      setReviewActions(defaults);
      
      showToast('Screenshot reloaded from history.', 'success');
      // Scroll to screenshot viewport smoothly
      handleScrollToSection('root');
    } catch (err) {
      console.error('[Renderer] Reopen history failed:', err);
      showToast('Failed to reopen screenshot.', 'error');
    } finally {
      setIsProcessingOcr(false);
    }
  };

  // Delete single history item
  const handleDeleteHistory = async (id) => {
    const success = await window.electronAPI.deleteHistoryItem(id);
    if (success) {
      setHistory((prev) => prev.filter((h) => h.id !== id));
      showToast('Scan deleted from history.', 'info');
    } else {
      showToast('Could not delete history item.', 'error');
    }
  };

  // Clear all local history
  const handleClearHistory = async () => {
    const success = await window.electronAPI.clearHistory();
    if (success) {
      setHistory([]);
      showToast('Scan history cleared.', 'info');
    } else {
      showToast('Could not clear history.', 'error');
    }
  };

  const handleSaveSettings = async (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('contextshield_settings', JSON.stringify(newSettings));
    
    // Call main process to update Clipboard Monitor
    await window.electronAPI.updateMonitorSettings(newSettings.clipboardMonitoring, newSettings.pollingInterval);
    
    // Update local guard toggle state
    setIsGuardOn(newSettings.clipboardMonitoring);
    if (newSettings.clipboardMonitoring) {
      setStatus('active');
    } else {
      setStatus('inactive');
      setScreenshot(null);
      setOcrText(null);
      setDetectedSecrets([]);
      setReviewActions({});
      setProtectedScreenshot(null);
    }
  };

  const handleThemeToggle = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    handleSaveSettings({
      ...settings,
      theme: nextTheme
    });
    showToast(`Theme changed to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode.`, 'info');
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('contextshield_onboarded', 'true');
    setShowOnboarding(false);
    showToast('Onboarding complete. Toggle Clipboard Guard to begin.', 'success');
  };

  return (
    <div className="app-container">
      {/* Header Panel */}
      <Header 
        status={status}
        isGuardOn={isGuardOn}
        onToggleChange={handleToggleChange}
        theme={settings.theme}
        onThemeToggle={handleThemeToggle}
        onScrollToSection={handleScrollToSection}
      />

      {/* Dashboard Telemetry Cards */}
      <section className="dashboard-grid">
        {/* Card 1: Clipboard */}
        <div className="dashboard-card">
          <div className="dash-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <div className="dash-info">
            <span className="dash-label">Clipboard Guard</span>
            <span className={`dash-value ${isGuardOn ? 'success' : 'danger'}`}>
              {isGuardOn ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Card 2: OCR */}
        <div className="dashboard-card">
          <div className="dash-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div className="dash-info">
            <span className="dash-label">OCR Status</span>
            <span className="dash-value">
              {isProcessingOcr ? `Scanning (${ocrProgress}%)` : screenshot ? 'Ready' : 'Idle'}
            </span>
          </div>
        </div>

        {/* Card 3: Detection */}
        <div className="dashboard-card">
          <div className="dash-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="dash-info">
            <span className="dash-label">Detected Secrets</span>
            <span className={`dash-value ${detectedSecrets.length > 0 ? 'danger' : 'success'}`}>
              {detectedSecrets.length > 0 ? `${detectedSecrets.length} Warnings` : screenshot ? '0 Matches' : '-'}
            </span>
          </div>
        </div>

        {/* Card 4: Protected Copies */}
        <div className="dashboard-card">
          <div className="dash-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </div>
          <div className="dash-info">
            <span className="dash-label">Protected Copies</span>
            <span className="dash-value">
              {protectedCopiesCount} Copied
            </span>
          </div>
        </div>

        {/* Card 5: History */}
        <div className="dashboard-card">
          <div className="dash-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="dash-info">
            <span className="dash-label">History Log</span>
            <span className="dash-value">
              {history.length} Scans
            </span>
          </div>
        </div>

        {/* Card 6: Status */}
        <div className="dashboard-card">
          <div className="dash-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="dash-info">
            <span className="dash-label">System Health</span>
            <span className={`dash-value ${status === 'detected' ? 'warning' : isGuardOn ? 'success' : 'danger'}`}>
              {status === 'detected' ? 'Action Needed' : isGuardOn ? 'Secured' : 'Offline'}
            </span>
          </div>
        </div>
      </section>

      {/* Middle Row (Screenshot | Privacy Review | Protected Screenshot) */}
      <section className="middle-columns-grid">
        <ScreenshotPanel 
          screenshot={screenshot}
          secrets={detectedSecrets}
          actions={reviewActions}
          showHighlights={showHighlights}
          onToggleHighlights={() => setShowHighlights(!showHighlights)}
          isGuardOn={isGuardOn}
          isProcessingOcr={isProcessingOcr}
          ocrProgress={ocrProgress}
        />

        <PrivacyReviewPanel 
          screenshot={screenshot}
          detectedSecrets={detectedSecrets}
          actions={reviewActions}
          onActionChange={handleActionChange}
          onAutoProtect={handleAutoProtect}
          onReset={handleReset}
        />

        <ProtectedScreenshotPanel 
          screenshot={screenshot}
          protectedScreenshot={protectedScreenshot}
          isProtectedGenerating={isProtectedGenerating}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCopySafeImage={handleCopySafeImage}
        />
      </section>

      {/* Bottom Row (OCR Console | History | Settings) */}
      <section className="bottom-columns-grid">
        <RawTextConsole 
          text={ocrText}
          confidence={ocrConfidence}
        />

        <HistoryPanel 
          history={history}
          onSelect={handleReopenHistory}
          onDelete={handleDeleteHistory}
          onClear={handleClearHistory}
        />

        <SettingsPanel 
          settings={settings}
          onSave={handleSaveSettings}
        />
      </section>

      {/* Onboarding Guide Modal */}
      {showOnboarding && (
        <Onboarding onClose={handleFinishOnboarding} />
      )}

      {/* Localized Offline Shield Footer */}
      <footer className="footer-note">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>
          <strong>100% On-Device Privacy Shield:</strong> ContextShield processes your screenshots entirely in local memory. Bounding boxes are drawn, scanned, and compiled locally. Zero outbound tracking, zero cloud data transfer.
        </span>
      </footer>

      {/* Non-Blocking Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-message toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
