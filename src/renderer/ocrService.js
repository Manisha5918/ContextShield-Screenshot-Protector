import { createWorker } from 'tesseract.js';

let cachedWorker = null;
let cachedLang = '';
let globalLoggerDelegate = null;

/**
 * Reuses or initializes a Tesseract worker for the selected language.
 */
async function getOCRWorker(lang) {
  if (cachedWorker && cachedLang === lang) {
    return cachedWorker;
  }

  if (cachedWorker) {
    try {
      await cachedWorker.terminate();
    } catch (e) {
      console.warn('[OCR Service] Error terminating old worker:', e);
    }
    cachedWorker = null;
  }

  cachedWorker = await createWorker(lang, 1, {
    workerPath: './ocr/worker.min.js',
    corePath: './ocr/core',
    langPath: './ocr/lang',
    gzip: false,
    logger: (m) => {
      if (m.status === 'recognizing' && globalLoggerDelegate) {
        globalLoggerDelegate(m.progress);
      }
    }
  });

  cachedLang = lang;
  return cachedWorker;
}

/**
 * Preprocesses screenshot image using HTML5 Canvas:
 * 1. Upscale by 2x for small IDE/terminal fonts.
 * 2. Convert to grayscale.
 * 3. Contrast stretch to maximize text separation.
 * 4. Detect dark themes and invert so Tesseract always processes dark-on-light.
 * 5. Binarize extremes to eliminate compression noise.
 */
async function preprocessImage(dataUrl, scale) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Draw and scale up
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        let min = 255;
        let max = 0;
        const lum = new Uint8Array(data.length / 4);

        // 1. Calculate luminance and min/max bounds
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const v = 0.299 * r + 0.587 * g + 0.114 * b;
          lum[i / 4] = v;
          if (v < min) min = v;
          if (v > max) max = v;
        }

        const range = max - min || 1;

        // 2. Determine average luminance to detect Dark Theme
        let sum = 0;
        for (let i = 0; i < lum.length; i++) {
          sum += lum[i];
        }
        const avg = sum / lum.length;
        const isDarkTheme = avg < 120; // typical threshold for IDEs/terminals

        // 3. Normalize contrast and invert if dark theme
        for (let i = 0; i < data.length; i += 4) {
          let v = ((lum[i / 4] - min) / range) * 255;

          if (isDarkTheme) {
            v = 255 - v; // invert to black text on white background
          }

          // Denoise / extreme binarize
          if (v < 80) {
            v = 0;
          } else if (v > 180) {
            v = 255;
          }

          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('[OCR Preprocessor] Preprocessing failed, using fallback:', err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

/**
 * Runs OCR locally on a base64 image data URL using Tesseract.js WebAssembly.
 * Optimized for high accuracy and fast reuse.
 */
export async function runLocalOCR(dataUrl, lang = 'eng', onProgress) {
  globalLoggerDelegate = onProgress || null;
  const scale = 2;

  try {
    const preprocessedUrl = await preprocessImage(dataUrl, scale);
    const worker = await getOCRWorker(lang);
    
    const { data } = await worker.recognize(preprocessedUrl, {}, { blocks: true });
    
    const lines = [];
    if (data.blocks) {
      for (const block of data.blocks) {
        if (block.paragraphs) {
          for (const paragraph of block.paragraphs) {
            if (paragraph.lines) {
              for (const line of paragraph.lines) {
                const words = (line.words || []).map((word) => ({
                  text: word.text || '',
                  confidence: word.confidence || 0,
                  bbox: {
                    x0: Math.round((word.bbox?.x0 || 0) / scale),
                    y0: Math.round((word.bbox?.y0 || 0) / scale),
                    x1: Math.round((word.bbox?.x1 || 0) / scale),
                    y1: Math.round((word.bbox?.y1 || 0) / scale)
                  }
                }));
                lines.push({
                  text: line.text || '',
                  words
                });
              }
            }
          }
        }
      }
    }

    return {
      text: data.text || '',
      confidence: data.confidence || 0,
      lines
    };
  } catch (err) {
    console.error('[OCR Service] Error running local OCR:', err);
    // Graceful recovery
    return {
      text: '',
      confidence: 0,
      lines: []
    };
  }
}
