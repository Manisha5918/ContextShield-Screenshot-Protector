# ContextShield

## On-Device Screenshot Privacy Protector

ContextShield is an offline-first desktop application that helps users identify and redact sensitive information from screenshots before they are shared.

Developed for **OSDHack 2026**, ContextShield demonstrates how local OCR and on-device processing can improve privacy during everyday screenshot workflows without depending on cloud-based AI services.

---

# Problem Statement

Developers, students, IT professionals, and technical support teams frequently share screenshots while collaborating, debugging, documenting software, or reporting issues.

These screenshots may unintentionally expose sensitive information such as:

- Database connection strings
- API keys
- Authentication tokens
- Passwords
- Email addresses
- Phone numbers
- Internal IP addresses
- Personal identifiers

Once shared publicly, these details may create privacy and security risks.

Manual inspection of every screenshot is time-consuming and unreliable.

---

# Solution

ContextShield introduces a privacy review step before screenshots are copied or shared.

The application monitors the clipboard for newly captured screenshots, extracts visible text locally, detects sensitive information using configurable detection rules, and allows users to review and redact identified regions before generating a protected screenshot.

The core workflow operates locally on the user's device.

---

# Features

## Clipboard Guard

Monitors the Windows clipboard for newly captured screenshots.

Duplicate screenshots are ignored using buffer comparison, preventing unnecessary OCR processing.

---

## Local OCR Processing

Extracts text and bounding boxes using an offline OCR engine.

Image preprocessing improves OCR quality through:

- Image upscaling
- Grayscale conversion
- Contrast enhancement
- Dark theme inversion
- Image denoising

---

## Sensitive Data Detection

Detects representative sensitive information including:

- Database connection strings
- JWT tokens
- API keys
- GitHub personal access tokens
- AWS access keys
- Passwords
- Email addresses
- Phone numbers
- Credit cards
- Aadhaar
- PAN
- Passport identifiers
- Driving licence numbers
- UPI IDs
- MAC addresses
- IP addresses
- Local file paths

Each detection is assigned one of four severity levels:

- Critical
- High
- Medium
- Low

---

## Privacy Review

Detected items are presented in a structured review panel.

Each finding displays:

- Detection category
- Severity
- OCR confidence
- Context
- Recommended action

Users can choose to:

- Redact
- Keep
- Ignore

or apply Auto Protect to multiple findings.

---

## Screenshot Preview

Provides an interactive preview with:

- Bounding box overlays
- Zoom
- Pan
- Reset
- Highlight toggle

---

## Redaction Engine

Supports three protection modes:

- Blur
- Pixelate
- Black Box

Adjacent regions are merged automatically to produce cleaner redactions.

---

## Protected Screenshot

Users can:

- Copy the protected screenshot
- Export the protected image as PNG

---

## OCR Console

Displays extracted OCR text in a terminal-style interface for transparency and debugging.

---

## History

Stores recent scans locally with thumbnails, timestamps, and detection summaries.

Users can reopen or delete previous scans.

---

## Settings

Allows configuration of:

- Clipboard monitoring
- Polling interval
- Blur radius
- OCR language
- Theme
- Detection rules

---

# Application Screenshots

## Dashboard

![Dashboard](Images/contextshield-dashboard.png)

---

## Privacy Review

![Privacy Review](Images/contextshield-privacy-review-and-redaction.png)

---

## OCR Console, History and Settings

![OCR Console](Images/contextshield-ocr-console-history-settings.png)

---

## Threat Detection

![Threat Detection](Images/contextshield-threat-isolated-dark-mode.png)

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Desktop Runtime | Electron |
| Frontend | React |
| Build Tool | Vite |
| Language | JavaScript |
| OCR | Tesseract.js WebAssembly |
| Storage | Local File System |
| IPC | Electron Context Bridge |
| Styling | CSS |

---

# How ContextShield Works

```
Screenshot Captured
        │
        ▼
Clipboard Guard
        │
        ▼
Image Preprocessing
        │
        ▼
Offline OCR
        │
        ▼
Sensitive Data Detection
        │
        ▼
Risk Classification
        │
        ▼
Privacy Review
        │
        ▼
Redaction
        │
        ▼
Protected Screenshot
```

---

# Project Structure

```
ContextShield/

├── Images/
├── public/
├── src/
│   ├── main/
│   ├── preload/
│   └── renderer/
├── README.md
├── ARCHITECTURE.md
├── TECHNICAL_REPORT.md
├── EVALUATION.md
├── PRIVACY_AND_SAFETY.md
├── package.json
└── vite.config.js
```

---

# Installation

Clone the repository.

```bash
git clone <repository-url>
```

Install dependencies.

```bash
npm install
```

Run the application.

```bash
npm run dev
```

---

# Sample Input

```
DATABASE_URL=postgres://admin:password@localhost:5432/demo

JWT_TOKEN=eyJhbGciOi...

API_KEY=sk_test_xxxxxxxxx

EMAIL=test@example.com

PHONE=9876543210
```

---

# Expected Output

ContextShield highlights detected sensitive regions, classifies them by severity, and allows users to generate a protected screenshot using Blur, Pixelate, or Black Box redaction.

---

# On-Device AI Verification

The following operations execute locally:

- Clipboard monitoring
- Image preprocessing
- OCR processing
- Sensitive data detection
- Risk classification
- Screenshot redaction
- Protected image generation

The core screenshot protection workflow does not require cloud-based AI services.

---

# Documentation

Additional documentation is available in:

- ARCHITECTURE.md
- TECHNICAL_REPORT.md
- EVALUATION.md
- PRIVACY_AND_SAFETY.md

---

# Future Work

Future improvements may include:

- Improved multilingual OCR
- Machine-learning-assisted detection
- Custom detection rules
- Performance benchmarking
- Cross-platform support
- Enhanced OCR preprocessing

---

# Hackathon

Developed for **OSDHack 2026** under the **On Device AI** theme.

ContextShield demonstrates how local OCR, privacy-focused design, and secure desktop processing can help reduce accidental exposure of sensitive information in screenshots.

---

# License

This project is released under the license included in the repository.
