// src/lib/services/e2e-networks.ts
// ═══════════════════════════════════════════════════════════════
// E2E Networks API Service — SINGLE INTERFACE to all E2E ops
// All methods call E2E and return normalized data for Wollnut
// ═══════════════════════════════════════════════════════════════

import {
  type E2EApiResponse,
  type E2ENode,
  type E2EPlan,
  type E2EImage,
  type E2ESSHKey,
  type E2EVolume,
  type E2EBalance,
  type E2EBilling,
  type CreateNodeParams,
  type NodeActionParams,
  type CreateSSHKeyParams,
  type CreateVolumeParams,
  type AttachVolumeParams,
} from "@/types/e2e.types";
import {
  E2EApiError,
  E2EAuthError,
  E2ERateLimitError,
  E2EResourceNotFoundError,
} from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("e2e-networks");

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────

interface E2EConfig {
  apiToken: string;
  baseUrl: string;
  projectId: string;
  contactPersonId: string;
  maxRetries: number;
  retryBaseDelayMs: number;
  requestTimeoutMs: number;
}

function loadConfig(): E2EConfig {
  const apiToken = process.env.E2E_API_TOKEN;
  const projectId = process.env.E2E_PROJECT_ID;
  const contactPersonId = process.env.E2E_CONTACT_PERSON_ID;

  if (!apiToken) {
    throw new Error(
      "E2E_API_TOKEN environment variable is required. " +
        "Get your Personal Access Token from E2E Networks dashboard."
    );
  }
  if (!projectId) {
    throw new Error("E2E_PROJECT_ID environment variable is required.");
  }
  if (!contactPersonId) {
    throw new Error("E2E_CONTACT_PERSON_ID environment variable is required.");
  }

  return {
    apiToken,
    projectId,
    contactPersonId,
    baseUrl:
      process.env.E2E_API_BASE_URL ||
      "https://api.e2enetworks.com/myaccount/api/v1",
    maxRetries: 3,
    retryBaseDelayMs: 1000,
    requestTimeoutMs: 30_000,
  };
}

// ─────────────────────────────────────────────
// SERVICE CLASS
// ─────────────────────────────────────────────

class E2ENetworksService {
  private config: E2EConfig;

  constructor() {
    this.config = loadConfig();
  }

  // ═══════════════════════════════════════════
  // NODES (GPU INSTANCES)
  // ═══════════════════════════════════════════

  /**
   * Create a new GPU node/instance on E2E Networks.
   * Caller is responsible for verifying credits before calling this.
   */
  async createNode(params: CreateNodeParams): Promise<E2ENode> {
    log.info("Creating E2E node", {
      method: "createNode",
      plan: params.plan,
      image: String(params.image),
      region: params.region,
    });

    const body = {
      name: params.name,
      plan: params.plan,
      image: params.image,
      region: params.region,
      ssh_keys: params.ssh_keys,
      backups: params.backups ?? false,
      saved_image: params.saved_image,
      vpc_id: params.vpc_id,
      security_group_id: params.security_group_id,
      enable_bitninja: params.enable_bitninja ?? false,
      reserve_ip: params.reserve_ip,
      disable_password: params.disable_password ?? true,
      is_ipv6_availed: params.is_ipv6_availed ?? false,
      default_gateway: params.default_gateway,
      label: params.label || params.name,
    };

    const response = await this.request<E2ENode>("POST", "/nodes/", body);

    log.info("E2E node created", {
      method: "createNode",
      e2eNodeId: String(response.id),
      name: response.name,
      status: response.status,
    });

    return response;
  }

  /**
   * List all nodes under the configured E2E project.
   */
  async listNodes(): Promise<E2ENode[]> {
    log.debug("Listing E2E nodes", { method: "listNodes" });

    const response = await this.request<E2ENode[]>("GET", "/nodes/");
    return Array.isArray(response) ? response : [];
  }

  /**
   * Get details for a specific node by its E2E node ID.
   */
  async getNode(nodeId: string): Promise<E2ENode> {
    log.debug("Getting E2E node", {
      method: "getNode",
      e2eNodeId: nodeId,
    });

    return this.request<E2ENode>("GET", `/nodes/${nodeId}/`);
  }

  /**
   * Perform a lifecycle action on a node (power_on, power_off, reboot, etc.).
   */
  async performAction(
    nodeId: string,
    action: NodeActionParams["type"]
  ): Promise<void> {
    log.info("Performing E2E node action", {
      method: "performAction",
      e2eNodeId: nodeId,
      action,
    });

    const body: NodeActionParams = { type: action };
    await this.request<unknown>("POST", `/nodes/${nodeId}/actions/`, body);

    log.info("E2E node action completed", {
      method: "performAction",
      e2eNodeId: nodeId,
      action,
    });
  }

  /**
   * Permanently delete/destroy a node on E2E.
   * This is irreversible — caller should have confirmed with the user.
   */
  async deleteNode(nodeId: string): Promise<void> {
    log.warn("Deleting E2E node", {
      method: "deleteNode",
      e2eNodeId: nodeId,
    });

    await this.request<unknown>("DELETE", `/nodes/${nodeId}/`);

    log.info("E2E node deleted", {
      method: "deleteNode",
      e2eNodeId: nodeId,
    });
  }

  // ═══════════════════════════════════════════
  // GPU PLANS
  // ═══════════════════════════════════════════

  /**
   * List all available GPU/compute plans from E2E.
   * Used by the plan sync job to populate our GPUPlan table.
   */
  async listGPUPlans(): Promise<E2EPlan[]> {
    log.debug("Listing E2E GPU plans", { method: "listGPUPlans" });

    const response = await this.request<E2EPlan[]>("GET", "/nodes/plans/");
    return Array.isArray(response) ? response : [];
  }

  // ═══════════════════════════════════════════
  // IMAGES / TEMPLATES
  // ═══════════════════════════════════════════

  /**
   * List all available OS/ML images from E2E.
   * Used to populate our Template table.
   */
  async listImages(): Promise<E2EImage[]> {
    log.debug("Listing E2E images", { method: "listImages" });

    const response = await this.request<E2EImage[]>("GET", "/images/");
    return Array.isArray(response) ? response : [];
  }

  /**
   * Get details for a specific image by ID.
   */
  async getImage(imageId: string): Promise<E2EImage> {
    log.debug("Getting E2E image", {
      method: "getImage",
      imageId,
    });

    return this.request<E2EImage>("GET", `/images/${imageId}/`);
  }

  // ═══════════════════════════════════════════
  // SSH KEYS
  // ═══════════════════════════════════════════

  /**
   * Register an SSH public key with E2E Networks.
   * Returns the created key with its E2E-assigned ID.
   */
  async addSSHKey(name: string, publicKey: string): Promise<E2ESSHKey> {
    log.info("Adding SSH key to E2E", {
      method: "addSSHKey",
      keyName: name,
    });

    const body: CreateSSHKeyParams = {
      name,
      public_key: publicKey,
    };

    const response = await this.request<E2ESSHKey>("POST", "/ssh-keys/", body);

    log.info("SSH key added to E2E", {
      method: "addSSHKey",
      e2eKeyId: String(response.id),
      fingerprint: response.fingerprint,
    });

    return response;
  }

  /**
   * List all SSH keys registered in the E2E account.
   */
  async listSSHKeys(): Promise<E2ESSHKey[]> {
    log.debug("Listing E2E SSH keys", { method: "listSSHKeys" });

    const response = await this.request<E2ESSHKey[]>("GET", "/ssh-keys/");
    return Array.isArray(response) ? response : [];
  }

  /**
   * Delete an SSH key from E2E by its E2E key ID.
   */
  async deleteSSHKey(keyId: string): Promise<void> {
    log.info("Deleting SSH key from E2E", {
      method: "deleteSSHKey",
      e2eKeyId: keyId,
    });

    await this.request<unknown>("DELETE", `/ssh-keys/${keyId}/`);
  }

  // ═══════════════════════════════════════════
  // VOLUMES (PERSISTENT STORAGE)
  // ═══════════════════════════════════════════

  /**
   * Create a new EBS volume on E2E.
   */
  async createVolume(params: CreateVolumeParams): Promise<E2EVolume> {
    log.info("Creating E2E volume", {
      method: "createVolume",
      name: params.name,
      sizeGb: params.size,
      region: params.region,
    });

    const response = await this.request<E2EVolume>("POST", "/volumes/", params);

    log.info("E2E volume created", {
      method: "createVolume",
      e2eVolumeId: String(response.id),
    });

    return response;
  }

  /**
   * List all volumes in the E2E account.
   */
  async listVolumes(): Promise<E2EVolume[]> {
    log.debug("Listing E2E volumes", { method: "listVolumes" });

    const response = await this.request<E2EVolume[]>("GET", "/volumes/");
    return Array.isArray(response) ? response : [];
  }

  /**
   * Attach a volume to a running node.
   */
  async attachVolume(volumeId: string, nodeId: string): Promise<void> {
    log.info("Attaching E2E volume", {
      method: "attachVolume",
      e2eVolumeId: volumeId,
      e2eNodeId: nodeId,
    });

    const body: AttachVolumeParams = { node_id: parseInt(nodeId, 10) };
    await this.request<unknown>(
      "POST",
      `/volumes/${volumeId}/attach/`,
      body
    );

    log.info("E2E volume attached", {
      method: "attachVolume",
      e2eVolumeId: volumeId,
      e2eNodeId: nodeId,
    });
  }

  /**
   * Detach a volume from its node.
   */
  async detachVolume(volumeId: string): Promise<void> {
    log.info("Detaching E2E volume", {
      method: "detachVolume",
      e2eVolumeId: volumeId,
    });

    await this.request<unknown>("POST", `/volumes/${volumeId}/detach/`);

    log.info("E2E volume detached", {
      method: "detachVolume",
      e2eVolumeId: volumeId,
    });
  }

  /**
   * Permanently delete a volume on E2E.
   * Volume must be detached first.
   */
  async deleteVolume(volumeId: string): Promise<void> {
    log.warn("Deleting E2E volume", {
      method: "deleteVolume",
      e2eVolumeId: volumeId,
    });

    await this.request<unknown>("DELETE", `/volumes/${volumeId}/`);

    log.info("E2E volume deleted", {
      method: "deleteVolume",
      e2eVolumeId: volumeId,
    });
  }

  // ═══════════════════════════════════════════
  // BILLING / ACCOUNT
  // ═══════════════════════════════════════════

  /**
   * Get the current account balance on E2E.
   * Used by admin panel to monitor E2E account health.
   */
  async getAccountBalance(): Promise<E2EBalance> {
    log.debug("Getting E2E account balance", {
      method: "getAccountBalance",
    });

    return this.request<E2EBalance>("GET", "/account/balance/");
  }

  /**
   * Get billing summary from E2E.
   * Used by admin panel for cost tracking.
   */
  async getBillingSummary(): Promise<E2EBilling> {
    log.debug("Getting E2E billing summary", {
      method: "getBillingSummary",
    });

    return this.request<E2EBilling>("GET", "/account/billing/");
  }

  // ═══════════════════════════════════════════
  // PRIVATE: HTTP REQUEST LAYER
  // ═══════════════════════════════════════════

  /**
   * Centralized HTTP request handler for all E2E API calls.
   *
   * Features:
   *  - Bearer token auth
   *  - Project & contact person query params
   *  - Retry with exponential backoff (3 attempts)
   *  - Timeout handling
   *  - Structured error classification
   *  - Request/response logging
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const startTime = Date.now();

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const response = await this.executeRequest(method, url, body);
        const durationMs = Date.now() - startTime;

        // Handle non-OK responses
        if (!response.ok) {
          const errorBody = await this.safeParseJson(response);
          this.handleErrorResponse(
            response.status,
            errorBody,
            endpoint,
            attempt
          );
        }

        // Parse successful response
        const data = await this.safeParseJson(response);

        log.debug("E2E API request succeeded", {
          method,
          endpoint,
          statusCode: response.status,
          durationMs,
          attempt,
        });

        // E2E wraps responses in { code, data, message } sometimes
        return this.extractData<T>(data);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on auth errors or 4xx client errors (except 429)
        if (
          error instanceof E2EAuthError ||
          error instanceof E2EResourceNotFoundError
        ) {
          throw error;
        }

        // Retry on rate limits with the specified delay
        if (error instanceof E2ERateLimitError) {
          if (attempt < this.config.maxRetries) {
            const delay = error.retryAfter * 1000;
            log.warn("E2E rate limited, waiting to retry", {
              endpoint,
              attempt,
              retryAfterMs: delay,
            });
            await this.sleep(delay);
            continue;
          }
          throw error;
        }

        // Retry on server errors and network failures
        if (attempt < this.config.maxRetries) {
          const delay = this.calculateBackoff(attempt);
          log.warn("E2E API request failed, retrying", {
            endpoint,
            attempt,
            nextRetryMs: delay,
            errorMessage: lastError.message,
          });
          await this.sleep(delay);
          continue;
        }
      }
    }

    // All retries exhausted
    log.error("E2E API request failed after all retries", lastError, {
      method,
      endpoint,
    });

    throw new E2EApiError(
      `E2E API request failed after ${this.config.maxRetries} attempts: ${lastError?.message}`,
      endpoint,
      502
    );
  }

  /**
   * Execute the actual fetch call with timeout.
   */
  private async executeRequest(
    method: string,
    url: string,
    body?: unknown
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.requestTimeoutMs
    );

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.config.apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body && method !== "GET" && method !== "DELETE") {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      return await fetch(url, fetchOptions);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new E2EApiError(
          `E2E API request timed out after ${this.config.requestTimeoutMs}ms`,
          url,
          504
        );
      }
      throw new E2EApiError(
        `E2E API network error: ${error instanceof Error ? error.message : String(error)}`,
        url,
        502
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Build the full URL with project/contact query params.
   */
  private buildUrl(endpoint: string): string {
    const base = this.config.baseUrl.replace(/\/+$/, "");
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = new URL(`${base}${path}`);

    // E2E requires project_id and contact_person_id as query params
    url.searchParams.set("project_id", this.config.projectId);
    url.searchParams.set("contact_person_id", this.config.contactPersonId);

    return url.toString();
  }

  /**
   * Safely parse JSON response body, returning raw text wrapper on failure.
   */
  private async safeParseJson(response: Response): Promise<unknown> {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { rawBody: text };
    }
  }

  /**
   * Extract the actual data payload from E2E's response wrapper.
   * E2E sometimes wraps: { code: 200, data: <actual>, message: "..." }
   * and sometimes returns data directly.
   */
  private extractData<T>(raw: unknown): T {
    if (raw === null || raw === undefined) {
      return raw as T;
    }

    if (typeof raw === "object" && raw !== null) {
      const obj = raw as Record<string, unknown>;

      // E2E wrapped response format
      if ("data" in obj && ("code" in obj || "message" in obj)) {
        return obj.data as T;
      }

      // Some endpoints return { results: [...] }
      if ("results" in obj && Array.isArray(obj.results)) {
        return obj.results as T;
      }
    }

    return raw as T;
  }

  /**
   * Classify and throw the appropriate error based on HTTP status.
   */
  private handleErrorResponse(
    status: number,
    body: unknown,
    endpoint: string,
    attempt: number
  ): never {
    const bodyObj = (typeof body === "object" && body !== null)
      ? body as Record<string, unknown>
      : {};

    const message = (bodyObj.message as string) ||
      (bodyObj.error as string) ||
      `E2E API error (HTTP ${status})`;

    const code = (bodyObj.code as number) || status;

    log.error("E2E API error response", undefined, {
      endpoint,
      statusCode: status,
      e2eCode: code,
      e2eMessage: message,
      attempt,
    });

    switch (status) {
      case 401:
      case 403:
        throw new E2EAuthError(endpoint);

      case 404:
        throw new E2EResourceNotFoundError("resource", endpoint, endpoint);

      case 429: {
        const retryAfter = parseInt(
          String(bodyObj.retry_after ?? "60"),
          10
        );
        throw new E2ERateLimitError(endpoint, retryAfter);
      }

      case 400:
      case 422:
        throw new E2EApiError(
          `E2E validation error: ${message}`,
          endpoint,
          status,
          code,
          message
        );

      default:
        throw new E2EApiError(
          `E2E API error: ${message}`,
          endpoint,
          status >= 500 ? 502 : status,
          code,
          message
        );
    }
  }

  /**
   * Exponential backoff: 1s, 2s, 4s (capped at 10s).
   */
  private calculateBackoff(attempt: number): number {
    const delay = this.config.retryBaseDelayMs * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 500; // add up to 500ms jitter
    return Math.min(delay + jitter, 10_000);
  }

  /**
   * Promise-based sleep.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ─────────────────────────────────────────────
// SINGLETON EXPORT
// ─────────────────────────────────────────────

let _instance: E2ENetworksService | null = null;

/**
 * Get the E2E Networks service singleton.
 * Lazy-initialized to avoid crashing at import time if env vars are missing
 * (e.g. during build or in frontend bundles).
 */
export function getE2EService(): E2ENetworksService {
  if (!_instance) {
    _instance = new E2ENetworksService();
  }
  return _instance;
}

/**
 * Direct singleton for convenience (throws at import if env vars missing).
 * Use getE2EService() for lazy initialization.
 */
export const e2eService = new Proxy({} as E2ENetworksService, {
  get(_, prop) {
    return Reflect.get(getE2EService(), prop);
  },
});

export { E2ENetworksService };
