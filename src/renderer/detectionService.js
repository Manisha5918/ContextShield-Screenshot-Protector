import { SecretType, Severity } from './models/types.js';

// Luhn check helper for credit cards
function checkLuhn(value) {
  const clean = value.replace(/[\s-]/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  if (!/^\d+$/.test(clean)) return false;
  
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum % 10) === 0;
}

// Public IP check helper (excludes private ranges and loopback)
function checkPublicIp(value) {
  const parts = value.split('.');
  if (parts.length !== 4) return false;
  
  const octets = parts.map(p => parseInt(p, 10));
  for (const num of octets) {
    if (isNaN(num) || num < 0 || num > 255) return false;
  }
  
  const o1 = octets[0];
  const o2 = octets[1];
  
  // Exclude local loopback, private ranges, link-local, broadcast
  if (o1 === 127) return false;
  if (o1 === 10) return false;
  if (o1 === 192 && o2 === 168) return false;
  if (o1 === 172 && (o2 >= 16 && o2 <= 31)) return false;
  if (o1 === 169 && o2 === 254) return false;
  if (o1 >= 224) return false; // multicast / reserved
  
  return true;
}

export const DETECTION_RULES = [
  {
    name: 'Private Key Header',
    regex: /-----BEGIN\s+(?:RSA|OPENSSH|DSA|EC|PGP)?\s*PRIVATE\s+KEY-----/gi,
    type: SecretType.PrivateKey,
    severity: Severity.Critical,
    recommendation: 'Exposed private keys grant direct access to infrastructure. Revoke and delete.',
    baseConfidence: 99,
    category: 'Credentials'
  },
  {
    name: 'JSON Web Token (JWT)',
    regex: /\bey[A-Za-z0-9_\-\s\n]+[.,][A-Za-z0-9_\-\s\n]+[.,][A-Za-z0-9_\-\s\n]+\b/g,
    type: SecretType.JwtToken,
    severity: Severity.Critical,
    recommendation: 'Revoke and rotate this token immediately. Exposed JWTs grant unauthorized session access.',
    baseConfidence: 95,
    category: 'Tokens'
  },
  {
    name: 'Database URL / Connection String',
    regex: /\b(mongodb(?:\+srv)?|postgres|postgresql|mysql|sqlserver|redis):\/\/([A-Za-z0-9_.\-%\s\n]{1,30})\s*:\s*([A-Za-z0-9_.\-%\s\n]{1,30})\s*@\s*([A-Za-z0-9_.\-%\s\n:]{1,50})/gi,
    type: SecretType.DatabaseUrl,
    severity: Severity.Critical,
    recommendation: 'Rotate the database password immediately. Exposed DB credentials can lead to severe data leaks.',
    baseConfidence: 98,
    category: 'Credentials'
  },
  {
    name: 'Bearer Token',
    regex: /\bBearer\s+([A-Za-z0-9_\-\.\=\+\/\s\n]{16,})\b/gi,
    type: SecretType.BearerToken,
    severity: Severity.Critical,
    recommendation: 'Revoke this bearer token. Unsecured credentials in headers compromise API protection.',
    baseConfidence: 92,
    category: 'Tokens',
    valueGroupIndex: 1
  },
  {
    name: 'GitHub Personal Access Token',
    regex: /\b(ghp_[a-zA-Z0-9\s\n]{34,40}|github_pat_[a-zA-Z0-9\s\n]{75,85})\b/g,
    type: SecretType.ApiKey,
    severity: Severity.Critical,
    recommendation: 'Revoke and regenerate this GitHub token immediately to protect source code access.',
    baseConfidence: 99,
    category: 'API Keys'
  },
  {
    name: 'OpenAI API Key',
    regex: /\b(sk-[a-zA-Z0-9\s\n]{44,52}|sk-proj-[a-zA-Z0-9_\-\s\n]{90,110})\b/g,
    type: SecretType.ApiKey,
    severity: Severity.Critical,
    recommendation: 'Revoke the OpenAI API key immediately to prevent billing exploits and quota exhaustion.',
    baseConfidence: 99,
    category: 'API Keys'
  },
  {
    name: 'Google API Key',
    regex: /\b(AIzaSy[a-zA-Z0-9_\-\s\n]{30,36})\b/g,
    type: SecretType.ApiKey,
    severity: Severity.Critical,
    recommendation: 'Revoke the Google Cloud API key or restrict its scope and referer settings.',
    baseConfidence: 95,
    category: 'API Keys'
  },
  {
    name: 'AWS Access Key ID',
    regex: /\b(AKIA[0-9A-Z\s\n]{16,20})\b/g,
    type: SecretType.ApiKey,
    severity: Severity.Critical,
    recommendation: 'Deactivate this AWS Access Key ID and audit CloudTrail for unauthorized operations.',
    baseConfidence: 98,
    category: 'API Keys'
  },
  {
    name: 'Stripe Secret Key',
    regex: /\b((?:sk|rk|cs)_(?:live|test)_[0-9a-zA-Z\s\n]{22,32})\b/g,
    type: SecretType.ApiKey,
    severity: Severity.Critical,
    recommendation: 'Immediately revoke Stripe keys. Exposed secret keys compromise merchant financial data.',
    baseConfidence: 99,
    category: 'API Keys'
  },
  {
    name: 'Twilio Account SID',
    regex: /\bAC[a-f0-9]{32}\b/gi,
    type: SecretType.ApiKey,
    severity: Severity.Critical,
    recommendation: 'Exposed Twilio SID could lead to API access. Rotate the associated Auth Token.',
    baseConfidence: 95,
    category: 'API Keys'
  },
  {
    name: 'Password Assignment',
    regex: /\b(password|passwd|pass|db_password)\s*[:=]\s*['"]?([a-zA-Z0-9_\-\.\=\+\/\@\$\%\^\&\*\(\)\[\]\{\}]+(?:[ \t][a-zA-Z0-9_\-\.\=\+\/\@\$\%\^\&\*\(\)\[\]\{\}]+)*)['"]?/gi,
    type: SecretType.Password,
    severity: Severity.Critical,
    recommendation: 'Rotate this password. Hardcoded passwords in scripts violate security compliance.',
    baseConfidence: 90,
    category: 'Credentials',
    valueGroupIndex: 2
  },
  {
    name: 'API Key Assignment',
    regex: /\b(api_key|apikey|secret_key|auth_token|client_secret|oauth_token)\s*[:=]\s*['"]?([a-zA-Z0-9_\-\.\=\+\/]+(?:[ \t][a-zA-Z0-9_\-\.\=\+\/]+)*)['"]?/gi,
    type: SecretType.ApiKey,
    severity: Severity.Critical,
    recommendation: 'Revoke and rotate this assignment. Exposed secrets compromise backend services.',
    baseConfidence: 95,
    category: 'Credentials',
    valueGroupIndex: 2
  },
  {
    name: 'Multiline Password Field',
    regex: /(?:password|passwd|pass|keypass)\b\s*[:=]?\s*[\r\n]+\s*([^\s]{4,})/gi,
    type: SecretType.Password,
    severity: Severity.Critical,
    recommendation: 'Secure this password. Exposed passwords in login screens represent active credential risk.',
    baseConfidence: 92,
    category: 'Credentials',
    valueGroupIndex: 1
  },
  {
    name: 'Multiline Username Field',
    regex: /(?:username|user\s+id|userid|login)\b\s*[:=]?\s*[\r\n]+\s*([a-zA-Z0-9_\-\.\@]{3,15})/gi,
    type: SecretType.Username,
    severity: Severity.Medium,
    recommendation: 'Consider redacting usernames from login dialogues to defend against target user enumeration.',
    baseConfidence: 85,
    category: 'PII',
    valueGroupIndex: 1
  },
  {
    name: 'Credit / Debit Card Number',
    regex: /\b(?:\d[ -]?){13,19}\b/g,
    type: SecretType.CreditCard,
    severity: Severity.High,
    recommendation: 'Immediately redact financial card details. Leaked cards invite monetary fraud.',
    baseConfidence: 99,
    category: 'PII',
    validator: checkLuhn
  },
  {
    name: 'Aadhaar Number',
    regex: /\b\d{4}[\s-]\d{4}[\s-]\d{4}\b/g,
    type: SecretType.Aadhaar,
    severity: Severity.High,
    recommendation: 'Mask Indian Aadhaar Card details. Leaking national ID details breaches privacy rules.',
    baseConfidence: 90,
    category: 'PII'
  },
  {
    name: 'PAN Number',
    regex: /\b[A-Za-z]{5}[0-9]{4}[A-Za-z]\b/g,
    type: SecretType.PAN,
    severity: Severity.High,
    recommendation: 'Mask Indian Permanent Account Number (PAN). Leaking taxpayer IDs compromises identity.',
    baseConfidence: 95,
    category: 'PII'
  },
  {
    name: 'Passport Number',
    regex: /\b[A-Za-z][0-9]{7}\b/g,
    type: SecretType.Passport,
    severity: Severity.High,
    recommendation: 'Mask Passport numbers. Exposed travel IDs present high identity-theft risk.',
    baseConfidence: 85,
    category: 'PII'
  },
  {
    name: 'Driving Licence Number',
    regex: /\b[A-Za-z]{2}[0-9]{2}[ -]?[0-9]{11}\b/g,
    type: SecretType.DrivingLicence,
    severity: Severity.High,
    recommendation: 'Mask Driving Licence number. Leaking state license values increases identity risk.',
    baseConfidence: 85,
    category: 'PII'
  },
  {
    name: 'Bank Account Assignment',
    regex: /\b(?:account|acc|acct)\b\s*(?:no|num|number)?\s*[:=]?\s*([0-9]{9,18})\b/gi,
    type: SecretType.BankAccount,
    severity: Severity.High,
    recommendation: 'Redact bank account numbers. Financial routes should be kept secure.',
    baseConfidence: 80,
    category: 'PII',
    valueGroupIndex: 1
  },
  {
    name: 'IFSC Code',
    regex: /\b[A-Za-z]{4}0[A-Za-z0-9]{6}\b/g,
    type: SecretType.IFSC,
    severity: Severity.High,
    recommendation: 'Exposed bank routes. Keep IFSC and routing keys confidential.',
    baseConfidence: 90,
    category: 'PII'
  },
  {
    name: 'UPI ID',
    regex: /\b[a-zA-Z0-9_.-]+@[a-zA-Z]{3,}\b/g,
    type: SecretType.UPI,
    severity: Severity.High,
    recommendation: 'UPI IDs identify private digital handles. Mask them to block spam and phishing.',
    baseConfidence: 90,
    category: 'PII',
    validator: (val) => {
      const parts = val.split('@');
      if (parts.length !== 2) return false;
      return !parts[1].includes('.'); // UPI handles do not have dots in handle (excludes email domains)
    }
  },
  {
    name: 'Developer Email Address',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    type: SecretType.Email,
    severity: Severity.Medium,
    recommendation: 'Verify if sharing email is appropriate. Masking prevents automated email harvest.',
    baseConfidence: 80,
    category: 'PII'
  },
  {
    name: 'Phone Number',
    regex: /(?:\+91[\-\s]?)?\b[6-9]\d{9}\b|\b\+(?:[0-9][\-\s]?){8,14}[0-9]\b/g,
    type: SecretType.Phone,
    severity: Severity.Medium,
    recommendation: 'Mask phone contacts. Publicizing numbers exposes users to unsolicited calls.',
    baseConfidence: 80,
    category: 'PII'
  },
  {
    name: 'Local Username in File Path',
    regex: /(?:\b[Cc]:\\Users\\([a-zA-Z0-9_\.\-]+)|\b\/home\/([a-zA-Z0-9_\.\-]+)|\b\/Users\/([a-zA-Z0-9_\.\-]+))/gi,
    type: SecretType.LocalPath,
    severity: Severity.Medium,
    recommendation: 'Mask file paths containing local names to prevent OS schema disclosure.',
    baseConfidence: 85,
    category: 'PII',
    valueGroupIndex: 1
  },
  {
    name: 'Expiry Date',
    regex: /\b(0[1-9]|1[0-2])\/([0-9]{2}|[0-9]{4})\b/g,
    type: SecretType.ExpiryDate,
    severity: Severity.Medium,
    recommendation: 'Mask card expiration details. Expiration values are crucial for transaction verification.',
    baseConfidence: 75,
    category: 'PII'
  },
  {
    name: 'CVV Field',
    regex: /\b(?:cvv|cvc|security\s+code)\s*[:=]?\s*([0-9]{3,4})\b/gi,
    type: SecretType.CVV,
    severity: Severity.Medium,
    recommendation: 'Never share CVV codes. Redact these details immediately.',
    baseConfidence: 90,
    category: 'PII',
    valueGroupIndex: 1
  },
  {
    name: 'Internal IP Address',
    regex: /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g,
    type: SecretType.IpAddress,
    severity: Severity.Low,
    recommendation: 'Redacting internal IPs conceals structural configuration layout.',
    baseConfidence: 85,
    category: 'Network'
  },
  {
    name: 'Public IP Address',
    regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    type: SecretType.IpAddress,
    severity: Severity.Low,
    recommendation: 'Mask public IP addresses to protect machine routing location details.',
    baseConfidence: 75,
    category: 'Network',
    validator: checkPublicIp
  },
  {
    name: 'MAC Address',
    regex: /\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g,
    type: SecretType.MacAddress,
    severity: Severity.Low,
    recommendation: 'Redact hardware addresses. MAC details uniquely identify physical endpoints.',
    baseConfidence: 90,
    category: 'Network'
  }
];

/**
 * Scans the structured OCR result, matches rules globally using a multiline reconstructed document,
 * and maps matched regions back to individual OCR words and coordinates.
 */
export function detectSecrets(ocrResult, enabledRules) {
  const detected = [];
  let secretIdCounter = 1;

  if (!ocrResult || !ocrResult.lines || !Array.isArray(ocrResult.lines)) {
    return [];
  }

  // 1. Reconstruct global text and map global indices back to words
  let globalText = '';
  const globalWordSpans = [];

  for (const line of ocrResult.lines) {
    if (!line) {
      globalText += '\n';
      continue;
    }
    
    const lineStartOffset = globalText.length;
    const lineText = line.text || '';
    globalText += lineText + '\n';

    let searchStart = 0;
    const words = line.words || [];
    for (const word of words) {
      if (!word || !word.text) continue;

      const idx = lineText.indexOf(word.text, searchStart);
      if (idx !== -1) {
        globalWordSpans.push({
          word,
          start: lineStartOffset + idx,
          end: lineStartOffset + idx + word.text.length
        });
        searchStart = idx + word.text.length;
      }
    }
  }

  // 2. Iterate rules and match over the global text
  for (const rule of DETECTION_RULES) {
    const isRuleEnabled = !enabledRules || enabledRules[rule.name] !== false;
    console.log(`[DEBUG] Rule "${rule.name}" enabled=${isRuleEnabled}`);

    if (enabledRules && enabledRules[rule.name] === false) {
      continue;
    }

    rule.regex.lastIndex = 0;
    let match;

    while ((match = rule.regex.exec(globalText)) !== null) {
      const matchedText = match[0];
      if (!matchedText.trim()) continue;
      console.log(`[DEBUG] Found raw match for "${rule.name}": "${matchedText}"`);

      // Run validator if defined
      if (rule.validator) {
        const checkValue = rule.valueGroupIndex !== undefined ? match[rule.valueGroupIndex] : matchedText;
        if (!checkValue || !rule.validator(checkValue)) {
          console.log(`[DEBUG] Match "${matchedText}" failed validation checker.`);
          continue; // skip match if validation fails
        }
      }

      // Determine the start and end offsets of the sensitive value to redact
      let valStart = match.index;
      let valEnd = valStart + matchedText.length;

      // If valueGroupIndex is defined, adjust coordinates to cover only that capture group
      if (rule.valueGroupIndex !== undefined && match[rule.valueGroupIndex]) {
        const groupText = match[rule.valueGroupIndex];
        const groupIndexInMatch = matchedText.indexOf(groupText);
        if (groupIndexInMatch !== -1) {
          valStart = match.index + groupIndexInMatch;
          valEnd = valStart + groupText.length;
        }
      }

      const relatedWords = [];
      const boundingBoxes = [];
      let positionalMappingIncomplete = false;

      // Extract words overlapping the value range
      for (const span of globalWordSpans) {
        if (valStart < span.end && span.start < valEnd) {
          relatedWords.push(span.word);
          boundingBoxes.push(span.word.bbox);
        }
      }

      if (relatedWords.length === 0) {
        positionalMappingIncomplete = true;
      }

      // Reconstruct surrounding line(s) as context
      const lineStart = globalText.lastIndexOf('\n', match.index) + 1;
      let lineEnd = globalText.indexOf('\n', match.index + matchedText.length);
      if (lineEnd === -1) lineEnd = globalText.length;
      const context = globalText.substring(lineStart, lineEnd).trim();

      detected.push({
        id: `secret_${secretIdCounter++}`,
        type: rule.type,
        severity: rule.severity,
        matchedText: rule.valueGroupIndex !== undefined && match[rule.valueGroupIndex] ? match[rule.valueGroupIndex] : matchedText,
        context: context || matchedText,
        recommendation: rule.recommendation,
        confidence: rule.baseConfidence,
        relatedWords,
        boundingBoxes,
        positionalMappingIncomplete
      });
    }
  }

  return detected;
}
