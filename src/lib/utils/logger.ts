// src/lib/utils/logger.ts
// Structured JSON logger for Wollnut Labs

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface LogContext {
  service?: string;
  method?: string;
  endpoint?: string;
  userId?: string;
  instanceId?: string;
  e2eNodeId?: string;
  durationMs?: number;
  statusCode?: number;
  [key: string]: unknown;
}

class Logger {
  private service: string;

  constructor(service: string = "wollnut") {
    this.service = service;
  }

  child(context: { service: string }): Logger {
    return new Logger(context.service);
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...context };

    if (error instanceof Error) {
      errorContext.errorName = error.name;
      errorContext.errorMessage = error.message;
      errorContext.stack = error.stack;

      // Attach any custom properties from our error classes
      if ("statusCode" in error) errorContext.statusCode = (error as Record<string, unknown>).statusCode as number;
      if ("code" in error) errorContext.errorCode = (error as Record<string, unknown>).code as string;
      if ("endpoint" in error) errorContext.endpoint = (error as Record<string, unknown>).endpoint as string;
    } else if (error !== undefined) {
      errorContext.errorRaw = String(error);
    }

    this.log("error", message, errorContext);
  }

  fatal(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...context };
    if (error instanceof Error) {
      errorContext.errorName = error.name;
      errorContext.errorMessage = error.message;
      errorContext.stack = error.stack;
    }
    this.log("fatal", message, errorContext);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      ...context,
    };

    // In production, output structured JSON; in dev, readable format
    if (process.env.NODE_ENV === "production") {
      const output = JSON.stringify(entry);
      if (level === "error" || level === "fatal") {
        console.error(output);
      } else if (level === "warn") {
        console.warn(output);
      } else {
        console.log(output);
      }
    } else {
      const color = LOG_COLORS[level];
      const prefix = `${color}[${level.toUpperCase()}]\x1b[0m`;
      const svc = `\x1b[90m[${this.service}]\x1b[0m`;
      const ts = `\x1b[90m${new Date().toLocaleTimeString()}\x1b[0m`;

      console.log(`${ts} ${prefix} ${svc} ${message}`);

      if (context && Object.keys(context).length > 0) {
        const { stack, ...rest } = context;
        if (Object.keys(rest).length > 0) {
          console.log(`  \x1b[90m${JSON.stringify(rest, null, 2)}\x1b[0m`);
        }
        if (stack && level === "error") {
          console.log(`  \x1b[31m${stack}\x1b[0m`);
        }
      }
    }
  }
}

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m",  // cyan
  info: "\x1b[32m",   // green
  warn: "\x1b[33m",   // yellow
  error: "\x1b[31m",  // red
  fatal: "\x1b[35m",  // magenta
};

// Export singleton + factory
export const logger = new Logger("wollnut");

export function createLogger(service: string): Logger {
  return new Logger(service);
}
