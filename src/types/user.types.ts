// src/types/user.types.ts
// User and auth-related types

export type UserRole = "USER" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  creditsBalance: number;
  autoRecharge: boolean;
  emailVerified: string | null;
  onboardedAt: string | null;
  createdAt: string;
}

export interface SSHKey {
  id: string;
  name: string;
  fingerprint: string;
  publicKey: string;
  isDefault: boolean;
  createdAt: string;
}

export interface ApiKeyInfo {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

/** Returned only once when creating a new API key */
export interface ApiKeyCreated extends ApiKeyInfo {
  plaintextKey: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  read: boolean;
  createdAt: string;
}

/** Admin view of a user */
export interface AdminUserView extends UserProfile {
  instanceCount: number;
  totalSpend: number;
  bannedAt: string | null;
  banReason: string | null;
}
