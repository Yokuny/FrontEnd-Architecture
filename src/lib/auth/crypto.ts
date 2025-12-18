/**
 * Crypto utilities for SSO authentication
 */

import CryptoJS from "crypto-js";

const SSO_SECRET = import.meta.env.VITE_SSO_TOKEN || "";

/**
 * Encrypt SSO payload for backend
 * Uses AES encryption with time-based secret
 */
export function encryptSSOPayload(data: object, time: number): string {
  try {
    const secret = `${SSO_SECRET}${time}`;
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
    return encrypted;
  } catch {
    return "";
  }
}

/**
 * Decrypt SSO payload (for testing/debugging)
 */
export function decryptSSOPayload(encrypted: string, time: number): object | null {
  try {
    const secret = `${SSO_SECRET}${time}`;
    const decrypted = CryptoJS.AES.decrypt(encrypted, secret);
    const data = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Generate random string for nonce/state
 */
export function generateRandomString(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Hash string with SHA256
 */
export function hashString(str: string): string {
  return CryptoJS.SHA256(str).toString();
}
