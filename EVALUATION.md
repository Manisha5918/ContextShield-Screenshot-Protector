# Evaluation

# ContextShield

**OSDHack 2026 – Final Submission**

---

# Overview

The ContextShield evaluation focuses on validating the application's ability to detect representative sensitive information from screenshots, assist users in reviewing detected content, and generate protected screenshots through local redaction.

Since ContextShield is a desktop privacy tool rather than a machine learning benchmark project, the evaluation primarily measures functional correctness and user workflow rather than predictive model accuracy.

---

# Evaluation Objectives

The evaluation aimed to verify that ContextShield can:

- Detect screenshots copied to the clipboard.
- Extract readable text using local OCR.
- Identify representative sensitive information.
- Classify detected information by severity.
- Highlight detected regions.
- Allow user review before redaction.
- Generate protected screenshots.
- Export or copy sanitized images.

---

# Test Environment

| Component | Configuration |
|------------|---------------|
| Operating System | Windows |
| Runtime | Electron |
| Programming Language | JavaScript |
| OCR | Local OCR Processing |
| Screenshot Source | Windows Snipping Tool |
| Storage | Local File System |

---

# Test Dataset

The evaluation used synthetic (non-production) screenshots containing representative sensitive information.

Example test content included:

- Database URIs
- JWT Tokens
- GitHub Tokens
- AWS Access Keys
- API Keys
- Passwords
- Email Addresses
- Phone Numbers
- IP Addresses
- UPI IDs
- PAN Identifiers
- Aadhaar-style Identifiers

No real credentials or personal information were used.

---

# Evaluation Procedure

For each test screenshot:

1. Prepare representative test credentials.
2. Capture the content using Windows Snipping Tool.
3. Copy the screenshot to the clipboard.
4. Enable Clipboard Guard.
5. Allow ContextShield to detect the screenshot.
6. Review OCR output.
7. Review highlighted sensitive regions.
8. Verify severity classification.
9. Apply redaction.
10. Generate a protected screenshot.
11. Verify the protected output.

---

# Functional Test Cases

## Test Case 1

### Clipboard Detection

**Input**

Copy a screenshot to the clipboard.

**Expected Result**

Clipboard Guard detects a new screenshot.

**Observed Result**

Successfully detected.

---

## Test Case 2

### OCR Processing

**Input**

Screenshot containing readable text.

**Expected Result**

OCR extracts visible text.

**Observed Result**

Text extracted successfully.

---

## Test Case 3

### Sensitive Data Detection

**Input**

Representative credentials.

**Expected Result**

Sensitive information identified.

**Observed Result**

Representative credential patterns detected successfully.

---

## Test Case 4

### Severity Classification

**Expected Result**

Detected information classified as:

- Critical
- High
- Medium
- Low

**Observed Result**

Severity indicators displayed correctly.

---

## Test Case 5

### Screenshot Highlighting

**Expected Result**

Detected regions highlighted inside Screenshot Preview.

**Observed Result**

Bounding regions displayed successfully.

---

## Test Case 6

### Privacy Review

**Expected Result**

Users can review each detection.

**Observed Result**

Detection information displayed with:

- Type
- Severity
- Context
- Recommended Action

---

## Test Case 7

### Manual Review

**Expected Result**

Users can choose:

- Redact
- Keep
- Ignore

**Observed Result**

All review actions functioned correctly.

---

## Test Case 8

### Protected Image Generation

**Expected Result**

Protected screenshot generated.

**Observed Result**

Protected image generated successfully.

---

## Test Case 9

### Export

**Expected Result**

Protected image copied or exported.

**Observed Result**

Copy Safe Image and PNG export completed successfully.

---

# Observed Results

During functional testing, ContextShield successfully demonstrated:

- Clipboard monitoring
- Screenshot capture
- OCR text extraction
- Sensitive data identification
- Risk classification
- Screenshot highlighting
- Privacy review
- Image redaction
- Protected image generation
- Local history storage

---

# Current Limitations

Current evaluation also identified several limitations:

- OCR quality depends on screenshot clarity.
- Small text reduces recognition quality.
- Complex backgrounds may reduce OCR accuracy.
- Pattern-based detection may produce false positives.
- Unrecognized credential formats may not be detected.
- OCR character substitutions may affect matching.

---

# Benchmark Status

Formal benchmarking has **not yet been performed** for:

- Precision
- Recall
- F1 Score
- Detection latency
- CPU utilization
- Memory utilization

These measurements are planned for future versions.

---

# Future Evaluation

Future testing may include:

- Larger screenshot datasets
- Multiple screen resolutions
- Performance benchmarking
- Stress testing
- False positive analysis
- Cross-platform evaluation
- Multilingual OCR testing
- User experience studies

---

# Conclusion

The functional evaluation demonstrates that ContextShield successfully implements an end-to-end screenshot privacy workflow, enabling users to detect, review, and redact representative sensitive information before screenshots are shared.

The project provides an effective proof of concept for privacy-preserving screenshot protection aligned with the **On Device AI** objectives of **OSDHack 2026**.