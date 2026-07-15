# 🛡️ ContextShield

### On-Device Screenshot Privacy Protector

**ContextShield** is an offline-first desktop privacy application that detects sensitive information in screenshots and helps users redact exposed content before copying, exporting, or sharing the image.

Developed for **OSDHack 2026**, an open-source hackathon by the **Open Source Developers Community (OSDC)** around the theme of **On Device AI**.

> **Detect locally. Review intelligently. Share safely.**

---

## 🚀 OSDHack 2026

OSDHack 2026 focuses on building AI and intelligent systems that run closer to the user — faster, lighter, more private, and open source.

ContextShield follows this theme through a local screenshot privacy workflow. Clipboard screenshot monitoring, OCR processing, sensitive-data detection, privacy review, and image redaction are performed within the desktop application without requiring a cloud AI API for the core protection pipeline.

---

## 📌 Problem Statement

Screenshots are frequently used by developers, students, technical teams, and everyday users to share errors, configurations, dashboards, code, and application states.

However, screenshots may accidentally expose sensitive information such as:

- Database connection strings
- JWT tokens
- API keys
- Access keys
- Passwords
- Email addresses
- Phone numbers
- IP addresses
- UPI identifiers
- PAN-style identifiers
- Aadhaar-style identifiers

These details can easily be overlooked before a screenshot is shared through messaging platforms, issue trackers, documentation, or public repositories.

Manual review is inconsistent and becomes difficult when screenshots contain large amounts of text.

**ContextShield addresses this problem by creating a local privacy checkpoint between screenshot capture and screenshot sharing.**

---

## 💡 The Solution

ContextShield monitors clipboard image activity and analyzes captured screenshots through a local privacy protection pipeline.

When a screenshot is copied:

1. Clipboard Guard detects new image content.
2. The screenshot is processed locally.
3. OCR extracts visible text and text regions.
4. Sensitive-data detection rules analyze the extracted content.
5. Potential secrets are classified by severity.
6. Detected regions are highlighted in the screenshot preview.
7. The user reviews each privacy alert.
8. Sensitive regions can be redacted, kept, or ignored.
9. ContextShield generates a protected copy.
10. The safe image can be copied to the clipboard or exported as a PNG.

This creates a **human-in-the-loop privacy workflow** before screenshots leave the user's device.

---

## ✨ Key Features

### 📋 Clipboard Guard

Automatically monitors clipboard image changes and triggers screenshot analysis when protection is enabled.

Clipboard monitoring can be enabled or disabled directly from the application.

### 🔍 Local OCR Processing

Extracts visible text from screenshots and identifies text regions required for sensitive-data analysis and visual highlighting.

### 🚨 Sensitive Information Detection

ContextShield can identify representative patterns associated with:

- Database URIs
- JWT tokens
- API keys
- Access keys
- Passwords
- Email addresses
- Phone numbers
- IP addresses
- UPI identifiers
- PAN-style identifiers
- Aadhaar-style identifiers

### 🎯 Severity Classification

Potential privacy risks are grouped into severity levels:

- **Critical**
- **High**
- **Medium**
- **Low**

Severity classification helps users prioritize high-risk findings.

### 🔎 Privacy Review

Each detected item is displayed with:

- Detection category
- Severity
- Masked detected value
- Recommended action
- OCR context
- Detection reliability indicator
- Associated text-region count

### 🧑‍💻 Human-in-the-Loop Controls

For each detected item, the user can choose:

- **Redact** — protect the detected region
- **Keep** — leave the content visible
- **Ignore** — dismiss the detection

### ⚡ Auto Protect

Automatically applies protection decisions to detected sensitive regions for faster screenshot sanitization.

### 🎨 Multiple Redaction Modes

ContextShield supports:

- **Blur**
- **Pixelate**
- **Black Box**

Users can preview different protection methods before exporting the final screenshot.

### 🖼️ Protected Copy

Generates a sanitized version of the original screenshot based on the selected privacy decisions.

The protected image can be:

- Copied using **Copy Safe Image**
- Exported as a PNG

### 🕘 Capture History

Maintains a configurable local history of recent screenshot scans.

History entries include scan metadata and locally stored screenshot references.

Users can delete individual history entries or clear the complete capture history.

### ⚙️ Privacy Settings

ContextShield provides configurable controls for:

- Clipboard monitoring
- Clipboard polling interval
- Blur intensity
- Maximum history size
- Visual theme
- OCR language
- Detection rules

### 🌙 Light and Dark Themes

The application includes both light and dark visual modes.

---

## 🖼️ Application Screenshots

### ContextShield Dashboard

![ContextShield Dashboard](Images/contextshield-dashboard.png)

The main dashboard displays Clipboard Guard status, OCR readiness, detected secret warnings, protected copy count, history information, and system health.

---

### OCR Console, Capture History and Settings

![ContextShield OCR Console History Settings](Images/contextshield-ocr-console-history-settings.png)

The OCR console displays locally extracted text, while Capture History maintains recent scan information. Settings provide control over clipboard monitoring, polling interval, redaction intensity, history size, theme, and OCR configuration.

---

### Privacy Review and Redaction

![ContextShield Privacy Review and Redaction](Images/contextshield-privacy-review-and-redaction.png)

Detected sensitive information is highlighted in the screenshot preview and presented in the Privacy Review panel with severity, masked values, context, and recommended actions.

The Protected Copy panel generates the sanitized output.

---

### Threat-Isolated Dark Mode

![ContextShield Threat Isolated Dark Mode](Images/contextshield-threat-isolated-dark-mode.png)

ContextShield provides a dark-mode privacy workspace for reviewing detected secrets and generating protected screenshot copies.

---

## 🧠 On-Device Processing Pipeline

```text
Windows Clipboard
        │
        ▼
Clipboard Monitor
        │
        ▼
Screenshot Capture
        │
        ▼
Local OCR Processing
        │
        ▼
OCR Text + Text Regions
        │
        ▼
Sensitive Data Detection
        │
        ├── Database URI
        ├── JWT Token
        ├── API Key
        ├── Access Key
        ├── Password
        ├── Email Address
        ├── Phone Number
        ├── IP Address
        ├── UPI Identifier
        └── Identity Data Patterns
        │
        ▼
Risk Classification
        │
        ├── Critical
        ├── High
        ├── Medium
        └── Low
        │
        ▼
Privacy Review
        │
        ├── Redact
        ├── Keep
        └── Ignore
        │
        ▼
Local Image Redaction
        │
        ▼
Protected Copy
        │
        ├── Copy Safe Image
        └── PNG Export
```

---

## 🔐 Local AI and Privacy Verification

ContextShield is designed around an **on-device and offline-first processing architecture**.

### What Runs Locally

The core ContextShield protection workflow performs the following operations within the desktop application:

- Clipboard image monitoring
- Screenshot acquisition
- OCR processing
- Text-region extraction
- Sensitive-data detection
- Risk classification
- Bounding-region processing
- Privacy review
- Image redaction
- Protected image generation
- Capture history management

### Cloud Components

The core screenshot protection pipeline does **not require a cloud AI API**.

### Internet Requirement

Internet access is not required for the normal screenshot analysis and redaction workflow after the required application dependencies are installed.

### User Data

ContextShield does not intentionally transmit screenshots or OCR-extracted content to an external server as part of its core privacy protection pipeline.

Captured history data may be stored locally within the application's user data directory.

> Users should review the installed source code and dependencies when deploying ContextShield in high-security or regulated environments.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Electron | Desktop application runtime |
| JavaScript | Core application logic |
| HTML | Application interface structure |
| CSS | User interface styling |
| Local OCR Pipeline | Screenshot text extraction |
| Pattern and Context Detection | Sensitive-data identification |
| Electron Clipboard API | Clipboard image interaction |
| Electron IPC | Secure main and renderer communication |
| Node.js File System | Local capture history management |

---

## 🏗️ Architecture

ContextShield follows a desktop architecture with separated Electron execution contexts.

### Electron Main Process

Responsible for:

- Application lifecycle
- Desktop window creation
- Clipboard monitoring integration
- Protected clipboard image writing
- Local history storage
- IPC request handling

### Preload Layer

Provides a restricted communication bridge between the renderer and Electron main process.

Context isolation is enabled and direct Node.js integration is disabled in the renderer.

### Renderer Process

Responsible for:

- Dashboard interface
- Screenshot preview
- OCR status
- Privacy Review
- Detection filtering
- Redaction controls
- Protected Copy preview
- Capture History
- Settings
- Theme management

Detailed architecture documentation is available in [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 🔒 Electron Security Configuration

ContextShield uses Electron security controls including:

```text
contextIsolation: true
nodeIntegration: false
sandbox: true
```

Navigation outside the application is restricted, and unauthorized new windows are blocked.

IPC handlers validate expected argument types before processing requests.

These controls reduce unnecessary renderer privileges and limit direct access to Node.js capabilities.

---

## 📦 Installation and Setup

### Prerequisites

Install:

- Node.js
- npm
- Git

A Windows environment is recommended for the current desktop implementation and clipboard workflow.

Check the installed versions:

```bash
node --version
npm --version
git --version
```

---

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Replace `<YOUR_REPOSITORY_URL>` with the public ContextShield GitHub repository URL.

---

### 2. Open the Project Directory

```bash
cd ContextShield
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Run ContextShield

```bash
npm run dev
```

The ContextShield Electron desktop application should launch.

---

## 🧪 How to Reproduce the Demo

### Step 1 — Start ContextShield

Run:

```bash
npm run dev
```

### Step 2 — Enable Clipboard Guard

Open ContextShield and enable the **Clipboard Guard** toggle.

The application should display an active protection state.

### Step 3 — Prepare Representative Test Data

Use **dummy or synthetic credentials only**.

Example:

```text
DATABASE_URL=postgresql://demo_user:DemoPassword123@localhost:5432/demo_db

JWT_TOKEN=eyJhbGciOiJIUzI1NiJ9.demo.signature

GITHUB_TOKEN=ghp_demoTokenValue123456789

AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE

API_KEY=sk_test_DemoSecretKey1234567890

PASSWORD=DemoPassword123!

EMAIL=testuser@example.com

PHONE_NUMBER=9876543210

IP_ADDRESS=192.168.1.100

UPI_ID=testuser@upi

PAN=ABCDE1234F

AADHAAR=2345 6789 1234
```

> Never use real production credentials, personal identity numbers, or active API keys when testing or demonstrating ContextShield.

### Step 4 — Capture the Screenshot

On Windows, press:

```text
Win + Shift + S
```

Capture the area containing the representative test data.

The screenshot should be copied to the Windows clipboard.

### Step 5 — Review the Detection Results

ContextShield should process the clipboard image and display:

- Screenshot preview
- OCR output
- Highlighted text regions
- Detected privacy alerts
- Severity classifications

### Step 6 — Apply Protection

Review individual findings using:

```text
Redact
Keep
Ignore
```

Alternatively, use:

```text
Auto Protect
```

### Step 7 — Select a Redaction Mode

Choose:

```text
Blur
Pixelate
Black Box
```

### Step 8 — Generate the Protected Copy

Review the protected image and select:

```text
Copy Safe Image
```

or export the protected screenshot as a PNG.

---

## 📥 Sample Input

```text
DATABASE_URL=postgresql://demo_user:DemoPassword123@localhost:5432/demo_db

JWT_TOKEN=eyJhbGciOiJIUzI1NiJ9.demo.signature

API_KEY=sk_test_DemoSecretKey1234567890

PASSWORD=DemoPassword123!

EMAIL=testuser@example.com

PHONE_NUMBER=9876543210

IP_ADDRESS=192.168.1.100
```

---

## 📤 Expected Output

ContextShield should identify representative sensitive-data patterns and display privacy review alerts similar to:

```text
Database URI      CRITICAL
JWT Token         CRITICAL
API Key           CRITICAL
Password          HIGH
Email Address     MEDIUM
Phone Number      MEDIUM
IP Address        LOW
```

The exact detected categories, OCR confidence, and alert count may vary depending on screenshot quality and OCR recognition.

After redaction, ContextShield generates a protected image with selected sensitive regions visually concealed.

---

## 📊 Evaluation

ContextShield was functionally tested using screenshots containing representative synthetic sensitive-data patterns.

The evaluation workflow included:

1. Creating representative test credentials.
2. Capturing the test content as a screenshot.
3. Copying the screenshot to the clipboard.
4. Allowing ContextShield to process the image.
5. Reviewing OCR output.
6. Reviewing detected sensitive-data categories.
7. Applying privacy protection.
8. Manually inspecting the generated protected image.

The current project demonstrates functional detection and redaction across multiple representative privacy-risk categories.

Formal dataset-scale precision, recall, F1-score, and comparative benchmark testing have not yet been completed.

Detailed evaluation information is available in [EVALUATION.md](EVALUATION.md).

---

## ⚙️ Technical Performance

ContextShield uses a lightweight local processing workflow designed for desktop execution.

### Runtime

Primary application runtime:

```text
Electron
JavaScript
Node.js
```

### Processing Hardware

The current implementation does not require a dedicated GPU or NPU for the core protection workflow.

Primary processing is performed using standard desktop resources.

### Model and Detection Pipeline

ContextShield does not depend on a large cloud-hosted language model for the core sensitive-data detection pipeline.

Sensitive-data analysis uses local OCR output with lightweight detection and contextual pattern-processing logic.

### Quantization

Model quantization is not currently applicable to the core rule-based sensitive-data detection layer.

### Model Size

A standalone large AI model is not used by the core sensitive-data detection pipeline.

### Inference Latency

Formal end-to-end latency benchmarking has not yet been completed.

### Peak Memory Usage

Formal peak-memory benchmarking has not yet been completed.

Further technical details are available in [TECHNICAL_REPORT.md](TECHNICAL_REPORT.md).

---

## ⚠️ Known Limitations

ContextShield currently has several known limitations:

- OCR quality depends on screenshot clarity.
- Very small text may reduce OCR recognition quality.
- Blurred source screenshots can affect detection.
- Complex backgrounds may affect text-region extraction.
- OCR character substitutions can affect pattern matching.
- Unusual or previously unseen secret formats may not be detected.
- Pattern-based detection may generate false positives.
- Partially visible credentials may be missed.
- Severity classification is heuristic and should not be treated as a formal enterprise risk score.
- ContextShield is not a replacement for enterprise Data Loss Prevention systems.

Users should manually review protected screenshots before public sharing.

---

## 🛡️ Privacy and Safety

ContextShield follows a privacy-first, human-in-the-loop design.

### Data Handling

Screenshot processing is designed to occur locally within the desktop application.

### Clipboard Permission

Clipboard image access is required for automatic screenshot detection.

Clipboard Guard can be disabled by the user.

### Local Storage

Capture history may be stored in the application's local user data directory.

### User Control

Users maintain control over detected information through:

- Redact
- Keep
- Ignore
- Auto Protect
- History deletion
- Clear history
- Clipboard Guard toggle

### Safety Considerations

Detection systems can produce false positives and false negatives.

Users should verify protected screenshots before sharing sensitive material.

Detailed privacy information is available in [PRIVACY_AND_SAFETY.md](PRIVACY_AND_SAFETY.md).

---

## 📚 Project Documentation

Detailed technical documentation for ContextShield is available below:

| Document | Description |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture, processing pipeline, data flow, local and cloud components, and key design decisions. |
| [TECHNICAL_REPORT.md](TECHNICAL_REPORT.md) | Runtime details, OCR and detection pipeline, optimizations, hardware requirements, and technical limitations. |
| [EVALUATION.md](EVALUATION.md) | Functional evaluation methodology, tested sensitive-data categories, observed results, and known failure cases. |
| [PRIVACY_AND_SAFETY.md](PRIVACY_AND_SAFETY.md) | Data handling, clipboard permissions, local storage, privacy controls, limitations, and potential risks. |

These documents provide additional implementation and evaluation details for the ContextShield final submission to **OSDHack 2026**.

---

## 📁 Project Structure

```text
ContextShield/
│
├── Images/
│   ├── contextshield-dashboard.png
│   ├── contextshield-ocr-console-history-settings.png
│   ├── contextshield-privacy-review-and-redaction.png
│   └── contextshield-threat-isolated-dark-mode.png
│
├── public/
│
├── src/
│   ├── main/
│   ├── preload/
│   └── renderer/
│
├── docs/
├── compiled-detectionService.js
├── eng.traineddata
├── index.html
├── jsconfig.json
├── package.json
├── package-lock.json
├── PROJECT_SPEC.md
├── tsconfig.main.json
└── vite.config.js
```

The exact renderer file structure may vary with the current implementation.

---

## 🎯 Key Design Decisions

### Local-First Processing

The core privacy workflow is designed to avoid dependence on cloud AI APIs.

### Clipboard-Based Detection

ContextShield integrates into the existing screenshot workflow instead of requiring users to manually upload every screenshot.

### Human-in-the-Loop Review

Detected information is presented to the user before the protected output is finalized.

### Multiple Protection Modes

Different redaction styles provide flexibility based on the screenshot-sharing context.

### Restricted Electron Renderer

Context isolation, sandboxing, and disabled Node.js integration reduce renderer privileges.

### Local History Management

Recent scan information is stored locally to support user review without requiring a remote account or cloud database.

---

## 🔬 Future Enhancements

Future development may include:

- Lightweight local machine-learning classification
- Improved OCR preprocessing
- Expanded secret-format detection
- User-defined detection rules
- Better multilingual OCR support
- Formal precision and recall benchmarking
- Automated latency benchmarking
- Memory and CPU profiling
- Screenshot-sharing application integration
- Local model optimization and quantization
- Improved context-aware false-positive reduction
- Cross-platform testing
- Configurable history retention policies

---

## 🤝 Attribution

ContextShield is built using open-source technologies and libraries from the JavaScript and Electron ecosystem.

Core technologies include:

- Electron
- Node.js
- JavaScript
- HTML
- CSS
- OCR-related project dependencies listed in `package.json`

No production credentials or real personal identity data are intentionally included in the demonstration dataset.

All test secrets shown in project demonstrations are intended to be synthetic examples.

For the complete dependency list and exact package versions, refer to:

```text
package.json
package-lock.json
```

---

## 🏆 Hackathon Submission

**Project:** ContextShield  
**Category:** On-Device AI / Privacy Tooling  
**Hackathon:** OSDHack 2026  
**Organizer:** Open Source Developers Community (OSDC)  
**Theme:** On Device AI  

ContextShield demonstrates how local screenshot understanding and privacy protection can help reduce accidental exposure of sensitive information before screenshots are shared.

---

## 📄 License

This project is developed as an open-source project for OSDHack 2026.


---

## 🛡️ ContextShield

**Detect sensitive information before your screenshot becomes a privacy incident.**
