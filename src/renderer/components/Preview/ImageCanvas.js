import { useRef, useState, useEffect } from 'react';
import { ReviewAction, Severity } from '../../models/types.js';

export function ImageCanvas({
  src,
  secrets,
  actions,
  showHighlights,
  externalScale,
  setExternalScale,
  externalPosition,
  setExternalPosition
}) {
  const imgRef = useRef(null);
  const [dimensions, setDimensions] = useState(null);

  // Zoom & Pan states
  const [internalScale, setInternalScale] = useState(1);
  const [internalPosition, setInternalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const scale = externalScale !== undefined ? externalScale : internalScale;
  const setScale = setExternalScale !== undefined ? setExternalScale : setInternalScale;
  const position = externalPosition !== undefined ? externalPosition : internalPosition;
  const setPosition = setExternalPosition !== undefined ? setExternalPosition : setInternalPosition;

  // Update layout dimensions on image load or window resize
  const updateDimensions = () => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth) {
      setDimensions({
        width: img.clientWidth,
        height: img.clientHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [src]);

  // Reset zoom & pan when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const handleWheel = (e) => {
    e.preventDefault(); // Prevent scrolling page
    const zoomFactor = 0.15;
    let nextScale = scale + (e.deltaY < 0 ? zoomFactor : -zoomFactor);
    nextScale = Math.max(1, Math.min(5, nextScale));
    
    if (nextScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
    setScale(nextScale);
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Limit panning bounds roughly
      const boundX = dimensions ? (dimensions.width * (scale - 1)) / 2 : 200;
      const boundY = dimensions ? (dimensions.height * (scale - 1)) / 2 : 200;
      
      setPosition({
        x: Math.max(-boundX - 50, Math.min(boundX + 50, newX)),
        y: Math.max(-boundY - 50, Math.min(boundY + 50, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case Severity.Critical:
        return {
          border: '2px solid rgba(217, 70, 239, 0.95)',
          background: 'rgba(217, 70, 239, 0.15)',
          boxShadow: '0 0 6px rgba(217, 70, 239, 0.4)'
        };
      case Severity.High:
        return {
          border: '2px solid rgba(239, 68, 68, 0.95)',
          background: 'rgba(239, 68, 68, 0.15)',
          boxShadow: '0 0 6px rgba(239, 68, 68, 0.4)'
        };
      case Severity.Medium:
        return {
          border: '2px solid rgba(245, 158, 11, 0.95)',
          background: 'rgba(245, 158, 11, 0.15)',
          boxShadow: '0 0 6px rgba(245, 158, 11, 0.4)'
        };
      case Severity.Low:
        return {
          border: '2px solid rgba(59, 130, 246, 0.95)',
          background: 'rgba(59, 130, 246, 0.15)',
          boxShadow: '0 0 6px rgba(59, 130, 246, 0.4)'
        };
    }
  };

  return (
    <div 
      className="screenshot-canvas-viewport" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        width: '100%', 
        height: '100%', 
        background: '#090a0f',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <div className="canvas-instruction-badge">
        {scale > 1 ? (
          <span>Zoom: {Math.round(scale * 100)}% | Drag to Pan | Double Click to Reset</span>
        ) : (
          <span>Scroll wheel to Zoom | Double Click to Reset</span>
        )}
      </div>

      <div 
        className="screenshot-canvas-wrapper" 
        style={{ 
          position: 'relative', 
          display: 'inline-block', 
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
      >
        <img 
          ref={imgRef}
          src={src} 
          alt="Clipboard Screenshot Preview" 
          className="screenshot-image"
          onLoad={updateDimensions}
          style={{ 
            display: 'block', 
            maxWidth: '100%', 
            maxHeight: '350px', 
            width: 'auto', 
            height: 'auto', 
            userSelect: 'none', 
            pointerEvents: 'none',
            borderRadius: '4px'
          }}
        />
        
        {/* Absolute Coordinate Highlights Layer */}
        {showHighlights && dimensions && secrets.map((secret) => {
          if (actions[secret.id] === ReviewAction.Ignore) {
            return null;
          }

          const scaleX = dimensions.width / dimensions.naturalWidth;
          const scaleY = dimensions.height / dimensions.naturalHeight;

          return (secret.boundingBoxes || []).map((box, index) => {
            const left = box.x0 * scaleX;
            const top = box.y0 * scaleY;
            const width = (box.x1 - box.x0) * scaleX;
            const height = (box.y1 - box.y0) * scaleY;

            const highlightStyle = getSeverityStyle(secret.severity);

            return (
              <div 
                key={`${secret.id}_box_${index}`}
                className={`secret-highlight-box severity-${secret.severity.toLowerCase()}`}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  borderRadius: '4px',
                  pointerEvents: 'none',
                  zIndex: 5,
                  ...highlightStyle
                }}
              />
            );
          });
        })}
      </div>
    </div>
  );
}
