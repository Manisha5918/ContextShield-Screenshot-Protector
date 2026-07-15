# System Architecture

# ContextShield

**OSDHack 2026 – Final Submission**

---

# Overview

ContextShield is an Electron-based desktop application that protects users from accidentally sharing sensitive information contained in screenshots.

The application continuously monitors clipboard screenshots, extracts text locally using OCR, identifies sensitive information through rule-based detection, allows user review, and generates a protected version of the screenshot before it is copied or exported.

The architecture follows an **offline-first, on-device processing model**, minimizing dependence on external services during the core privacy workflow.

---

# High-Level Architecture

```text
                        Windows Clipboard
                               │
                               ▼
                    Clipboard Monitoring Service
                               │
                               ▼
                     Screenshot Capture Pipeline
                               │
                               ▼
                      Local OCR Processing Engine
                               │
                               ▼
                 OCR Text + Bounding Box Extraction
                               │
                               ▼
              Sensitive Information Detection Engine
                               │
        ┌──────────────┬──────────────┬──────────────┐
        ▼              ▼              ▼
   Pattern Match   Context Rules   Risk Scoring
        │              │              │
        └──────────────┴──────────────┘
                               │
                               ▼
                    Privacy Review Interface
                               │
        ┌──────────────┬──────────────┬──────────────┐
        ▼              ▼              ▼
      Redact          Keep          Ignore
                               │
                               ▼
                    Protected Image Generator
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
          Copy Safe Image          PNG Export
```

---

# Application Layers

## 1. Electron Main Process

The Electron main process is responsible for:

- Application lifecycle
- Window creation
- Clipboard monitoring
- IPC communication
- Local history management
- Secure file operations

It also prevents unauthorized navigation and restricts renderer privileges.

---

## 2. Preload Layer

The preload script provides a secure communication bridge between the renderer process and Electron APIs.

Responsibilities include:

- Secure IPC exposure
- Clipboard interaction
- History operations
- Settings communication

Node.js APIs are not exposed directly to the renderer.

---

## 3. Renderer Process

The renderer process contains the graphical user interface.

Major modules include:

- Dashboard
- Screenshot Preview
- OCR Console
- Privacy Review
- Protected Copy
- Capture History
- Settings
- Theme Management

---

# Processing Workflow

## Step 1

Clipboard Guard monitors Windows clipboard activity.

---

## Step 2

When a screenshot is detected:

- Screenshot is captured
- Image is stored temporarily in memory

---

## Step 3

OCR processing extracts:

- Visible text
- Text locations
- Confidence information

---

## Step 4

Extracted text is passed to the Sensitive Data Detection Engine.

The engine evaluates:

- Database URIs
- JWT Tokens
- API Keys
- AWS Keys
- Passwords
- Email Addresses
- Phone Numbers
- IP Addresses
- UPI IDs
- PAN identifiers
- Aadhaar identifiers

---

## Step 5

Each detection is assigned a severity level:

- Critical
- High
- Medium
- Low

---

## Step 6

Detected regions are highlighted inside the Screenshot Preview.

The Privacy Review panel displays:

- Detection type
- Severity
- Masked value
- Recommended action
- OCR context
- Reliability score

---

## Step 7

The user reviews each detection and chooses:

- Redact
- Keep
- Ignore

or applies:

- Auto Protect

---

## Step 8

The Protected Image Generator applies the selected redaction method:

- Blur
- Pixelate
- Black Box

---

## Step 9

The final protected screenshot can be:

- Copied to clipboard
- Downloaded as PNG

---

# Local Components

The following components operate locally:

- Clipboard monitoring
- Screenshot capture
- OCR processing
- Text extraction
- Detection engine
- Risk classification
- Privacy review
- Image redaction
- History management
- Protected image generation

---

# Cloud Components

The current implementation does not require a cloud AI API for the core screenshot protection workflow.

---

# Data Flow

```text
Clipboard Screenshot

        │

        ▼

Screenshot Capture

        │

        ▼

OCR Processing

        │

        ▼

Extracted Text

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

# Security Design

ContextShield uses Electron security best practices including:

- Context Isolation
- Sandboxed Renderer
- Disabled Node Integration
- Restricted Navigation
- Secure IPC Communication
- Local File Storage

These controls help reduce renderer privileges and improve application security.

---

# Design Decisions

## Local-First Processing

Sensitive screenshots remain on the user's device throughout the core processing workflow.

---

## Human-in-the-Loop Review

Users remain in control of every detected privacy alert before redaction.

---

## Lightweight Detection

Rule-based detection provides fast analysis without requiring large cloud-hosted AI models.

---

## Modular Architecture

Clipboard monitoring, OCR, detection, redaction, history, and settings are separated into independent components, improving maintainability and future extensibility.

---

# Future Architecture Enhancements

Potential future improvements include:

- Lightweight local machine learning models
- Improved OCR preprocessing
- User-defined detection rules
- Better multilingual OCR support
- Plugin-based detection modules
- Cross-platform desktop support
- Additional privacy filters
- Performance profiling and optimization

---

# Summary

ContextShield adopts a modular, secure, and offline-first desktop architecture that enables users to detect and redact sensitive information before screenshots are shared.

The design prioritizes local processing, user privacy, secure Electron practices, and extensibility while aligning with the **On Device AI** theme of **OSDHack 2026**.