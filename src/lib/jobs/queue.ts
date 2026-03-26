// src/lib/jobs/queue.ts
// BullMQ queue setup with Redis

import { Queue, Worker, type Processor, type WorkerOptions } from "bullmq";
import IORedis from "ioredis";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("queue");

const REDIS_URL = process.env.REDIS_URL;

let connection: IORedis | null = null;

function getConnection(): IORedis | null {
  if (!REDIS_URL) {
    log.warn("REDIS_URL is not set — background jobs will not run");
    return null;
  }

  if (!connection) {
    connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    connection.on("error", (err) => {
      log.error("Redis connection error", err);
    });
  }

  return connection;
}

// Queue names
export const QUEUE_NAMES = {
  BILLING: "billing",
  STATUS_SYNC: "status-sync",
  AUTO_SHUTDOWN: "auto-shutdown",
  NOTIFICATIONS: "notifications",
} as const;

// Create queues (lazy — only if Redis is available)
const queues = new Map<string, Queue>();

export function getQueue(name: string): Queue | null {
  const conn = getConnection();
  if (!conn) return null;

  if (!queues.has(name)) {
    queues.set(
      name,
      new Queue(name, {
        connection: conn,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 500 },
        },
      })
    );
  }

  return queues.get(name)!;
}

// Worker factory
const workers: Worker[] = [];

export function createWorker<T>(
  queueName: string,
  processor: Processor<T>,
  opts?: Partial<WorkerOptions>
): Worker<T> | null {
  const conn = getConnection();
  if (!conn) return null;

  const worker = new Worker<T>(queueName, processor, {
    connection: conn,
    concurrency: 1,
    ...opts,
  });

  worker.on("failed", (job, err) => {
    log.error(`Job failed: ${queueName}/${job?.id}`, err);
  });

  worker.on("completed", (job) => {
    log.info(`Job completed: ${queueName}/${job.id}`);
  });

  workers.push(worker as unknown as Worker);
  return worker;
}

// Graceful shutdown
async function shutdown() {
  log.info("Shutting down workers and queues...");

  await Promise.all(workers.map((w) => w.close()));
  await Promise.all(Array.from(queues.values()).map((q) => q.close()));

  if (connection) {
    await connection.quit();
    connection = null;
  }

  log.info("All workers and queues closed");
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export { getConnection };
