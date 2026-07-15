# Technical Report

# ContextShield

**OSDHack 2026 – Final Submission**

---

# 1. Project Overview

ContextShield is an Electron-based desktop application designed to protect users from accidentally sharing sensitive information present in screenshots. The application monitors clipboard screenshots, performs local OCR, detects sensitive information using rule-based pattern matching, allows users to review detected content, and generates a protected version of the screenshot through visual redaction.

The project follows the **On Device AI** philosophy by performing the core screenshot analysis locally within the desktop application.

---

# 2. Runtime Environment

| Component | Technology |
|-----------|------------|
| Desktop Runtime | Electron |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js |
| OCR | Local OCR Processing |
| Storage | Local File System |
| IPC | Electron IPC |
| Platform | Windows Desktop |

---

# 3. Processing Pipeline

The ContextShield processing workflow consists of the following stages:

1. Clipboard screenshot detection
2. Screenshot acquisition
3. Local OCR processing
4. Text extraction
5. Sensitive information detection
6. Risk classification
7. User privacy review
8. Image redaction
9. Protected image generation
10. Local history storage

All major processing steps occur inside the desktop application.

---

# 4. Sensitive Data Detection

The current implementation identifies representative sensitive-data patterns including:

- Database URIs
- JWT Tokens
- API Keys
- AWS Access Keys
- Passwords
- Email Addresses
- Phone Numbers
- IP Addresses
- UPI IDs
- PAN-style identifiers
- Aadhaar-style identifiers

Detected information is categorized into severity levels to assist user review.

---

# 5. Redaction Engine

ContextShield supports multiple visual protection techniques:

- Blur
- Pixelation
- Black Box

The protected image is generated locally after user confirmation.

---

# 6. Optimization

The application incorporates several optimizations:

- Clipboard polling only when monitoring is enabled
- Local screenshot processing
- Lightweight rule-based detection
- Configurable history retention
- Configurable blur intensity
- Configurable polling interval

These design choices help minimize unnecessary processing.

---

# 7. Local AI Verification

Core application functionality operates locally.

Local operations include:

- Screenshot monitoring
- OCR execution
- Sensitive-data detection
- Privacy review
- Image redaction
- Protected image generation

The core workflow does not require a cloud AI API.

---

# 8. Model Information

ContextShield does not currently use a large cloud-hosted language model for its core detection pipeline.

Sensitive information detection is performed using local OCR output combined with lightweight detection logic and contextual pattern matching.

---

# 9. Quantization

Model quantization is not applicable to the current rule-based detection pipeline.

---

# 10. Model Size

The current implementation does not package a standalone large AI model for sensitive-data detection.

---

# 11. Inference Latency

Formal latency benchmarking has **not yet been performed**.

Latency may vary depending on:

- Screenshot resolution
- OCR complexity
- Number of detected regions
- Host hardware

---

# 12. CPU / GPU / NPU Usage

Primary execution occurs on the CPU.

The application does not require a dedicated GPU or NPU for normal operation.

Formal hardware utilization measurements have not yet been collected.

---

# 13. Peak Memory Usage

Formal peak memory profiling has not yet been completed.

---

# 14. Tested Platform

The current implementation has been tested on a Windows desktop environment.

Typical environment:

- Operating System: Windows
- Runtime: Electron
- Architecture: x64

---

# 15. Known Technical Limitations

Current limitations include:

- OCR accuracy depends on screenshot quality.
- Small text may reduce recognition accuracy.
- Blurred screenshots may decrease OCR performance.
- Pattern-based detection can generate false positives.
- Previously unseen credential formats may not be detected.
- Partial or cropped secrets may be missed.
- OCR character substitution may affect detection.

---

# 16. Future Improvements

Potential future enhancements include:

- Improved OCR preprocessing
- Machine-learning-assisted classification
- Expanded secret pattern database
- User-defined detection rules
- Better multilingual OCR support
- Automated benchmarking
- CPU and memory profiling
- Cross-platform testing
- Additional privacy filters

---

# Conclusion

ContextShield demonstrates an offline-first desktop privacy protection workflow that helps users detect and redact sensitive information before screenshots are shared.

The project emphasizes local processing, user control, and privacy-preserving design while remaining lightweight and easy to deploy.