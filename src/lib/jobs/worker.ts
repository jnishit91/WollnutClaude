// src/lib/jobs/worker.ts
// Entry point for all background workers
// Run with: npm run worker

import { createLogger } from "@/lib/utils/logger";
import { startBillingCron } from "./billing-cron";
import { startStatusSync } from "./status-sync";
import { startAutoShutdownWorker } from "./auto-shutdown";

const log = createLogger("worker");

async function main() {
  log.info("Starting Wollnut Workers...");

  const billing = startBillingCron();
  const statusSync = startStatusSync();
  const autoShutdown = startAutoShutdownWorker();

  if (!billing && !statusSync && !autoShutdown) {
    log.warn(
      "No workers started — REDIS_URL is not configured. Set REDIS_URL to enable background jobs."
    );
    process.exit(1);
  }

  log.info(
    "Wollnut Workers started: billing-cron (60s), status-sync (30s), auto-shutdown"
  );

  // Keep process running
  process.on("SIGTERM", () => {
    log.info("Received SIGTERM, shutting down...");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    log.info("Received SIGINT, shutting down...");
    process.exit(0);
  });
}

main().catch((err) => {
  log.error("Worker startup failed", err);
  process.exit(1);
});
