// src/lib/utils/crypto.ts
// Cryptographic utilities for API key management

import { randomBytes, createHash } from "crypto";

const API_KEY_PREFIX = "wn_ak_";
const API_KEY_BYTES = 32; // 256-bit keys

/**
 * Generate a new API key.
 * Returns the plaintext key (shown once to user) and its hash (stored in DB).
 */
export function generateApiKey(): {
  plaintextKey: string;
  keyHash: string;
  keyPrefix: string;
} {
  const rawKey = randomBytes(API_KEY_BYTES).toString("hex");
  const plaintextKey = `${API_KEY_PREFIX}${rawKey}`;
  const keyHash = hashApiKey(plaintextKey);
  const keyPrefix = plaintextKey.slice(0, API_KEY_PREFIX.length + 8);

  return { plaintextKey, keyHash, keyPrefix };
}

/**
 * Hash an API key for storage using SHA-256.
 * API keys are hashed (not encrypted) because we only need to verify,
 * never to recover the original key.
 */
export function hashApiKey(plaintextKey: string): string {
  return createHash("sha256").update(plaintextKey).digest("hex");
}

/**
 * Verify a plaintext API key against a stored hash.
 */
export function verifyApiKey(
  plaintextKey: string,
  storedHash: string
): boolean {
  const hash = hashApiKey(plaintextKey);
  // Constant-time comparison to prevent timing attacks
  if (hash.length !== storedHash.length) return false;

  let result = 0;
  for (let i = 0; i < hash.length; i++) {
    result |= hash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Generate a cryptographically secure random token (for password resets, etc.).
 */
export function generateToken(bytes: number = 32): string {
  return randomBytes(bytes).toString("hex");
}

/**
 * Compute SSH key fingerprint from a public key string.
 * Returns MD5 fingerprint in colon-separated hex format.
 */
export function computeSSHFingerprint(publicKey: string): string {
  // Extract the base64 portion of the SSH public key
  const parts = publicKey.trim().split(" ");
  const keyData = parts.length >= 2 ? parts[1] : parts[0];

  const buffer = Buffer.from(keyData, "base64");
  const hash = createHash("md5").update(buffer).digest("hex");

  // Format as colon-separated pairs: aa:bb:cc:dd...
  return hash.match(/.{2}/g)?.join(":") ?? hash;
}
