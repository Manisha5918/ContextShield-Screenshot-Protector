export const SecretType = Object.freeze({
  Password: 'Password',
  DatabaseUrl: 'DatabaseUrl',
  JwtToken: 'JwtToken',
  BearerToken: 'BearerToken',
  PrivateKey: 'PrivateKey',
  IpAddress: 'IpAddress',
  Email: 'Email',
  ApiKey: 'ApiKey',
  Username: 'Username',
  Phone: 'Phone',
  Aadhaar: 'Aadhaar',
  PAN: 'PAN',
  CreditCard: 'CreditCard',
  CVV: 'CVV',
  ExpiryDate: 'ExpiryDate',
  BankAccount: 'BankAccount',
  IFSC: 'IFSC',
  UPI: 'UPI',
  Passport: 'Passport',
  DrivingLicence: 'DrivingLicence',
  MacAddress: 'MacAddress',
  LocalPath: 'LocalPath'
});

export const Severity = Object.freeze({
  Critical: 'Critical',
  High: 'High',
  Medium: 'Medium',
  Low: 'Low'
});

export const ReviewAction = Object.freeze({
  Mask: 'Mask',
  Keep: 'Keep',
  Ignore: 'Ignore'
});
