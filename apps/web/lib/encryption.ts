import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be 64 characters long (256 bits in hex)');
}

/**
 * Encrypt sensitive data
 */
export function encrypt(text: string): string {
  try {
    // Generate random IV and salt
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Derive key from base key + salt
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY!, salt, 100000, 32, 'sha256');
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get authentication tag
    const tag = cipher.getAuthTag();
    
    // Combine salt + iv + tag + encrypted data
    const combined = Buffer.concat([
      salt,
      iv,
      tag,
      Buffer.from(encrypted, 'hex')
    ]);
    
    return combined.toString('base64');
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedData: string): string {
  try {
    // Parse the combined data
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract components
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = combined.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    // Derive key from base key + salt
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY!, salt, 100000, 32, 'sha256');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    // Decrypt
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Hash sensitive data (one-way, for verification)
 */
export function hash(text: string): string {
  return crypto.pbkdf2Sync(text, ENCRYPTION_KEY!, 100000, 64, 'sha256').toString('hex');
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Encrypt PII fields for database storage
 */
export function encryptPII(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
}) {
  const encrypted: any = {};
  
  if (data.firstName) encrypted.firstName = encrypt(data.firstName);
  if (data.lastName) encrypted.lastName = encrypt(data.lastName);
  if (data.phone) encrypted.phone = encrypt(data.phone);
  if (data.addressLine1) encrypted.addressLine1 = encrypt(data.addressLine1);
  if (data.addressLine2) encrypted.addressLine2 = encrypt(data.addressLine2);
  
  return encrypted;
}

/**
 * Decrypt PII fields from database
 */
export function decryptPII(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
}) {
  const decrypted: any = {};
  
  try {
    if (data.firstName) decrypted.firstName = decrypt(data.firstName);
    if (data.lastName) decrypted.lastName = decrypt(data.lastName);
    if (data.phone) decrypted.phone = decrypt(data.phone);
    if (data.addressLine1) decrypted.addressLine1 = decrypt(data.addressLine1);
    if (data.addressLine2) decrypted.addressLine2 = decrypt(data.addressLine2);
  } catch (error) {
    console.error('PII decryption error:', error);
    // Return original data if decryption fails (backwards compatibility)
    return data;
  }
  
  return decrypted;
}