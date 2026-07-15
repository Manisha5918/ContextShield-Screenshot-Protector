# ContextShield Desktop

## Project Overview

ContextShield Desktop is an open-source, on-device privacy companion for developers.

The application proactively detects newly copied screenshot images from the system clipboard and analyzes them locally for potentially exposed developer secrets and sensitive information.

The goal is to help developers identify accidental exposure of credentials and private information before screenshots are pasted into communication platforms, issue trackers, emails, or other applications.

## Core User Flow

1. The user enables Clipboard Guard.
2. The user captures a screenshot using a normal screenshot workflow such as Windows + Shift + S.
3. The screenshot is copied to the system clipboard.
4. ContextShield detects the new clipboard image.
5. The image is analyzed locally on the user's device.
6. Local OCR extracts visible text and positional information.
7. The privacy detection pipeline identifies potentially sensitive content.
8. The user receives a privacy warning.
9. The user reviews detected risks.
10. Sensitive regions can be redacted locally.
11. The protected image is copied back to the clipboard.
12. The user pastes the protected image into any application or website.

## Core Privacy Principle

Sensitive screenshots should not need to leave the user's device in order to determine whether they contain sensitive information.

The following data must not be sent to cloud AI services or remote analysis APIs:

- Screenshot pixels
- OCR extracted text
- Passwords
- API keys
- Authentication tokens
- Detected secrets
- Sensitive values

Core privacy analysis must execute locally.

## Target Platform

Initial prototype target:

Windows desktop.

## Planned Technology Stack

- Electron
- React
- TypeScript
- Vite
- Local OCR
- HTML Canvas API
- Local AI runtime
- Local model artifact

The exact OCR and AI model artifacts must be verified before final integration.

## Desktop Architecture

### Electron Main Process

Responsible for:

- Desktop application lifecycle
- System clipboard access
- Detecting new clipboard images
- Native desktop functionality

### Preload Layer

Responsible for:

- Secure IPC bridge
- Exposing only required desktop functions to the renderer

Use Electron contextBridge.

Do not enable unrestricted Node.js access in the renderer.

### React Renderer

Responsible for:

- Protection status
- Screenshot preview
- Privacy risk review
- Original and protected image comparison
- Redaction controls
- User interface

## Planned Detection Pipeline

Screenshot
→ Local OCR
→ Text and bounding boxes
→ Pattern Detection
→ Developer Structure Detection
→ Local Context Analysis
→ Privacy Risk Fusion
→ User Review
→ Local Redaction

## Developer-Specific Risk Categories

The prototype should focus on:

- Password assignments
- Database credentials
- Connection strings
- JWT-like tokens
- JWT signing secrets
- Bearer tokens
- Authorization headers
- API keys
- Environment variable secrets
- Private key headers
- Internal IP addresses
- Developer email addresses
- Local usernames visible in file paths

## Detection Philosophy

ContextShield should use a hybrid privacy detection pipeline.

### Deterministic Detection

Used for strongly structured sensitive information.

Examples:

- JWT-like tokens
- Bearer tokens
- Emails
- IP addresses
- Private key headers
- Credential assignments

### Local Context Analysis

Used to distinguish potentially sensitive context from normal technical discussion.

Example:

"Password authentication is supported."

This may be safe educational text.

"Production database password is tiger123."

This may contain an exposed credential.

The local AI component should assist with context-aware risk classification.

## Risk Decisions

Possible decisions:

- REDACT
- REVIEW
- KEEP

High-confidence structured secrets may be recommended for redaction.

Ambiguous detections should be shown for user review.

ContextShield must not claim that an image is guaranteed to be safe.

## Core MVP

The first working version must support:

1. Electron desktop application.
2. Clipboard image monitoring.
3. Duplicate image detection.
4. Screenshot preview.
5. Local OCR.
6. Developer secret detection.
7. Risk list.
8. Sensitive region highlighting.
9. Local redaction.
10. Copy protected image to clipboard.

## Development Rule

Build the project incrementally.

Do not implement all features at once.

The development order is:

Phase 1:
Electron desktop shell and clipboard image detection.

Phase 2:
Local OCR.

Phase 3:
Deterministic developer secret detection.

Phase 4:
Bounding box highlighting and redaction.

Phase 5:
Copy protected image to clipboard.

Phase 6:
Local context-aware AI model integration.

Phase 7:
Testing, performance measurement, documentation, and demo preparation.

## Current Phase

PHASE 1 ONLY.

Do not implement OCR, AI, secret detection, redaction, authentication, cloud APIs, ASP.NET, MySQL, or analytics until Phase 1 is verified.