/**
 * Token management utilities
 */

import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  request?: string; // Enterprise ID
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Decode JWT token
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

/**
 * Check if token is valid (not expired)
 */
export function isTokenValid(token: string): boolean {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return false;

    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

/**
 * Get stored token from localStorage
 */
export function getStoredToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Save token to localStorage
 */
export function setStoredToken(token: string): void {
  localStorage.setItem("token", token);
}

/**
 * Remove token from localStorage
 */
export function clearStoredToken(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("id_enterprise_filter");
  localStorage.removeItem("typelog");
  localStorage.removeItem("map_show_name");
}

/**
 * Get user from token
 */
export function getUserFromToken(token: string): DecodedToken | null {
  return decodeToken(token);
}

/**
 * Save user data to localStorage
 */
export function saveUserData(user: DecodedToken, loginType: "normal" | "sso" = "normal"): void {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("typelog", loginType);
  localStorage.setItem("map_show_name", "true");

  if (user.request) {
    localStorage.setItem("id_enterprise_filter", user.request);
  }
}

/**
 * Get user data from localStorage
 */
export function getUserData(): DecodedToken | null {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}
