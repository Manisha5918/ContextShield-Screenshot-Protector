# 🛡️ ContextShield

> **Detect before you share. Protect before you expose.**

ContextShield is a privacy-first, on-device screenshot protection desktop application that detects sensitive information in screenshots and generates protected, redacted copies before they are shared.

## OSDHack 2026

**Built for OSDHack 2026 — On Device AI**

OSDHack 2026 is an online open-source hackathon by the **Open Source Developers Community (OSDC)** focused on building AI that runs closer to the user — faster, lighter, more private, and open source.

The challenge focuses on applications where the core AI functionality runs locally on a phone, laptop, desktop, browser, edge device, or embedded system instead of depending fully on cloud AI APIs.

ContextShield follows this vision through an **offline-first, privacy-focused screenshot protection workflow** where OCR processing, sensitive information detection, privacy analysis, and screenshot redaction are performed locally on the user's device.

---

## 📌 Overview

Screenshots are a common part of modern technical workflows.

Developers, students, technical teams, and professionals regularly share screenshots of:

- Terminal outputs
- Environment variables
- Configuration files
- Debugging logs
- Development dashboards
- Source code
- API responses
- Internal tools

However, these screenshots may accidentally expose sensitive information such as API keys, authentication tokens, passwords, database credentials, or personal information.

Manually checking every screenshot before sharing is unreliable.

**ContextShield introduces a privacy checkpoint between screenshot capture and screenshot sharing.**

The application monitors screenshots, performs local OCR, detects potentially sensitive information, highlights privacy risks, and generates a protected screenshot with selected information redacted.

---

## ❗ Problem Statement

Sensitive information can escape through screenshots.

A developer may carefully protect source code and environment files while accidentally sharing a screenshot containing:

```text
DATABASE_URL=postgresql://admin:password@localhost:5432/mydb

JWT_TOKEN=<token>

API_KEY=<secret-key>

EMAIL=user@example.com

PHONE_NUMBER=9876543210
```

Traditional secret scanning tools primarily analyse:

- Source code
- Git repositories
- Commits
- Configuration files

However, they may not protect the **visual sharing layer**.

Once sensitive information appears in a screenshot, it can be accidentally shared through documentation, issue trackers, team chats, social platforms, or technical communities.

ContextShield addresses this problem by analysing screenshots **before they are shared**.

---

## 💡 Solution

ContextShield is an on-device screenshot privacy protection system.

The application follows the workflow:

```text
Capture → OCR → Detect → Review → Redact → Share
```

When Clipboard Guard is enabled, ContextShield monitors newly captured screenshots.

The screenshot is processed using an offline OCR engine to extract visible textual information.

The extracted text is analysed locally for potentially sensitive information.

Detected privacy risks are displayed in the Privacy Review panel, where the user can choose to:

- **Redact** — protect the detected information
- **Keep** — preserve the information
- **Ignore** — exclude the detection from the current review

ContextShield then generates a protected copy using blur, pixelation, or black-box redaction.

---

## ✨ Key Features

### 🖼️ Screenshot Clipboard Guard

Monitors screenshot activity and detects newly captured screenshot images.

When enabled, ContextShield automatically begins the privacy analysis workflow.

### 🔍 Offline OCR Processing

Extracts visible text from screenshots using local OCR processing.

The core OCR workflow does not require a cloud OCR API.

### 🔐 Sensitive Information Detection

ContextShield identifies patterns associated with potentially sensitive information, including:

- Database URLs
- JWT tokens
- GitHub-style tokens
- AWS access key patterns
- API keys
- Passwords
- Email addresses
- Phone numbers
- IP addresses
- Local file paths
- UPI IDs
- PAN-like identifiers
- Aadhaar-like identifiers

### 🚨 Privacy Risk Classification

Detected information is organised using risk severity levels:

- Critical
- High
- Medium
- Low

Users can filter detected privacy alerts according to severity.

### 🛡️ Privacy Review Panel

Each detected privacy alert provides information such as:

- Detection category
- Risk severity
- Masked detected value
- Recommended action
- Detection context
- Reliability indicator
- Detection block count

The user remains in control of the final protection decision.

### ⚡ Auto Protect

Automatically selects detected sensitive regions for protection.

This helps users quickly prepare screenshots containing multiple privacy risks.

### 🎨 Multiple Redaction Modes

ContextShield provides three visual redaction methods:

- **Blur**
- **Pixelate**
- **Black Box**

Users can select the protection style based on their requirements.

### 🔒 Protected Copy Generation

After privacy review, ContextShield generates a protected version of the screenshot.

The safe image can be copied or exported as a PNG file.

### 💻 OCR Console

Displays locally extracted OCR text and OCR confidence information.

This provides visibility into the text identified by the OCR pipeline.

### 🕒 Capture History

Maintains a local history of processed screenshots.

Capture records display:

- Screenshot preview
- Alert count
- OCR confidence
- Capture timestamp

### 🌙 Light and Dark Mode

ContextShield provides light and dark visual themes for different working environments.

### ⚙️ Configurable Privacy Rules

The sensitive information detection engine uses configurable privacy rules.

The rule system can be extended to support additional sensitive information patterns.

### 📱 On-Device Privacy Workflow

The core screenshot protection workflow is designed to operate locally.

OCR extraction, pattern analysis, privacy review, and screenshot redaction are performed on the user's device.

---

## 📸 Application Screenshots

### ContextShield Dashboard

The ContextShield dashboard displays Clipboard Guard status, OCR state, detected secrets, protected copy statistics, screenshot history, and system health.

![ContextShield Dashboard](Images/contextshield-dashboard.png)

---

### Privacy Review and Redaction

ContextShield analyses extracted screenshot text, highlights detected sensitive regions, and provides privacy review controls before generating a protected copy.

![ContextShield Privacy Review and Redaction](Images/contextshield-privacy-review-and-redaction.png)

---

### OCR Console, Capture History and Settings

The application provides OCR output visibility, processed screenshot history, privacy configuration, and local OCR settings.

![ContextShield OCR Console History and Settings](Images/contextshield-ocr-console-history-settings.png)

---

### Threat Isolated Dark Mode

The dark interface displays detected privacy threats, risk information, screenshot highlights, and protected output in a security-focused workspace.

![ContextShield Threat Isolated Dark Mode](Images/contextshield-threat-isolated-dark-mode.png)

---

## 🧠 On-Device AI Architecture

ContextShield is built around the **On Device AI** theme of OSDHack 2026.

```text
             Screenshot Capture
                     │
                     ▼
             Clipboard Monitoring
                     │
                     ▼
              Local OCR Engine
                     │
                     ▼
              Extracted Text
                     │
                     ▼
       Sensitive Information Detection
                     │
                     ▼
             Risk Classification
                     │
                     ▼
               Privacy Review
                     │
                     ▼
              Redaction Engine
                     │
                     ▼
            Protected Screenshot
```

The core analysis pipeline runs locally on the desktop.

This offline-first architecture reduces dependency on cloud AI APIs for the application's main privacy functionality.

---

## 🔄 Detection Pipeline

### 1. Screenshot Detection

Clipboard Guard monitors the system clipboard for newly captured screenshot images.

### 2. Local OCR Extraction

The screenshot is processed by the offline OCR engine.

Visible textual content is extracted from the image.

### 3. Sensitive Pattern Analysis

Extracted OCR text is passed to the local detection service.

Detection rules analyse patterns associated with credentials, personal information, network information, and sensitive configuration data.

### 4. Risk Classification

Detected information is classified based on its potential privacy or security impact.

### 5. Privacy Review

The detected information is displayed to the user.

The user can select Redact, Keep, or Ignore.

### 6. Screenshot Redaction

Selected regions are protected using the configured visual redaction method.

### 7. Protected Copy Generation

ContextShield generates a safer version of the screenshot for sharing.

---

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Electron | Desktop application environment |
| JavaScript | Application logic |
| React | User interface |
| Vite | Frontend build tooling |
| Tesseract.js | Offline OCR processing |
| CSS | Application interface styling |
| Canvas API | Screenshot annotation and redaction |
| Local Storage | Local preferences and application state |

---

## 📂 Project Structure

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
│   └── ocr/
│
├── src/
│   ├── main/
│   ├── preload/
│   └── renderer/
│       ├── components/
│       │   ├── Preview/
│       │   └── Risk/
│       │
│       ├── detectionService.js
│       ├── ocrService.js
│       ├── main.js
│       └── index.css
│
├── .gitignore
├── PROJECT_SPEC.md
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.main.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following tools are installed:

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/Manisha5918/ContextShield-Screenshot-Protector.git
```

### Navigate to the Project

```bash
cd ContextShield-Screenshot-Protector
```

### Install Dependencies

```bash
npm install
```

### Run ContextShield

```bash
npm run dev
```

The ContextShield desktop application will start in development mode.

---

## 🖥️ How to Use ContextShield

1. Launch ContextShield.
2. Enable **Clipboard Guard**.
3. Capture a screenshot.
4. ContextShield detects the screenshot.
5. The local OCR engine extracts visible text.
6. Sensitive information patterns are analysed.
7. Detected privacy risks are highlighted.
8. Review each detected alert.
9. Select **Redact**, **Keep**, or **Ignore**.
10. Select Blur, Pixelate, or Black Box protection.
11. Generate the protected screenshot.
12. Copy the safe image or export it as PNG.

---

## 🧪 Demonstration Scenario

For testing, a screenshot may contain synthetic values such as:

```text
DATABASE_URL=postgresql://admin:TestPassword123@localhost:5432/mydb

JWT_TOKEN=<demo-token>

GITHUB_TOKEN=<demo-token>

AWS_ACCESS_KEY_ID=<demo-access-key>

API_KEY=<demo-api-key>

PASSWORD=SuperSecretPassword123!

EMAIL=testuser@example.com

PHONE_NUMBER=9876543210

IP_ADDRESS=192.168.1.100

LOCAL_PATH=C:\Users\Developer\Documents\secret-project
```

ContextShield performs OCR and analyses the extracted text.

Potentially sensitive values are highlighted in the Screenshot Preview and displayed as privacy alerts.

Selected sensitive regions are then visually protected in the generated screenshot.

> All demonstration credentials and identifiers should be synthetic test values. Real production credentials should never be used for project testing or demonstrations.

---

## 🔐 Privacy-First Design

ContextShield follows an offline-first privacy architecture.

The core workflow is designed so that:

- Screenshot OCR runs locally.
- Extracted text is analysed locally.
- Sensitive pattern detection runs locally.
- Privacy review is handled locally.
- Screenshot redaction runs locally.
- Protected screenshots are generated locally.

The main privacy functionality does not depend fully on cloud AI APIs.

This directly supports the **On Device AI** focus of OSDHack 2026.

---

## 🌟 Why ContextShield?

Existing secret scanning solutions commonly ask:

> **"Does my repository contain a secret?"**

ContextShield focuses on a different privacy problem:

> **"Does the screenshot I am about to share expose something sensitive?"**

Sensitive information does not only escape through source code repositories.

It can also be exposed visually through screenshots of terminals, configuration files, dashboards, logs, and development environments.

ContextShield adds a privacy protection layer to the screenshot sharing workflow.

---

## 🏆 Built for OSDHack 2026

ContextShield was developed for **OSDHack 2026**, an online open-source hackathon organised by the **Open Source Developers Community (OSDC)**.

### Hackathon Theme

**On Device AI**

> Build AI that runs closer to the user — faster, lighter, more private, and open source.

ContextShield aligns with the hackathon theme by performing its core screenshot privacy workflow locally on the desktop.

The project combines:

- Offline-first processing
- Local OCR
- Local sensitive information analysis
- Privacy-focused screenshot review
- Local image redaction
- Open-source extensibility

Instead of depending fully on cloud AI APIs for its primary functionality, ContextShield brings privacy analysis closer to the user and the data being protected.

---

## 🔮 Future Enhancements

- Custom user-defined privacy detection rules
- Expanded offline OCR language support
- Advanced local secret classification
- Improved OCR confidence analysis
- Manual region-level redaction
- Application-specific screenshot policies
- Configurable detection allowlists
- Screenshot comparison and duplicate detection
- Automatic protected screenshot naming
- Exportable local privacy scan reports
- Lightweight local ML-based risk classification
- Cross-platform desktop improvements

---

## 🤝 Open-Source Extensibility

ContextShield is designed so the detection system can be extended with additional privacy rules.

Contributors can improve areas such as:

- Sensitive information patterns
- OCR preprocessing
- Risk classification
- Redaction techniques
- User interface components
- Local privacy workflows

The long-term goal is to create an extensible privacy layer for safer screenshot sharing.

---

## 👩‍💻 Author

**Manisha G**

B.Tech Artificial Intelligence and Data Science  


---

## 🙌 Acknowledgement

ContextShield was built for **OSDHack 2026**, organised by the **Open Source Developers Community (OSDC)**.

The project was developed around the hackathon's **On Device AI** theme, with a focus on offline-first processing, privacy-friendly tools, and local AI workflows that reduce dependency on cloud-based services.

---

## 🛡️ ContextShield

**Detect before you share. Protect before you expose.**
