/**
 * LoggerService - Centralized logging utility
 * 
 * Replaces all console.log, console.error, console.warn calls
 * with a standardized, environment-aware logging system.
 * 
 * Supports:
 * - Environment-based filtering (dev only vs production)
 * - Log levels (DEBUG, INFO, WARN, ERROR)
 * - Structured context and details
 * - Extension for error tracking services (Sentry, LogRocket, etc.)
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  details?: any;
  stackTrace?: string;
}

export class LoggerService {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static logHistory: LogEntry[] = [];
  private static maxHistorySize = 100;

  /**
   * Main logging method - handles all log levels
   */
  static log(
    level: LogLevel,
    context: string,
    message: string,
    details?: any
  ): void {
    // Always create log entry (for future analytics/monitoring)
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      details,
      stackTrace: this.getStackTrace(),
    };

    // Add to history
    this.addToHistory(logEntry);

    // Only output to console in development
    if (this.isDevelopment) {
      this.outputToConsole(logEntry);
    }

    // Send critical errors to error tracking (can be enabled for production)
    if (level === LogLevel.ERROR) {
      this.handleCriticalError(logEntry);
    }
  }

  /**
   * Debug level logging (development only)
   */
  static debug(context: string, message: string, details?: any): void {
    this.log(LogLevel.DEBUG, context, message, details);
  }

  /**
   * Info level logging
   */
  static info(context: string, message: string, details?: any): void {
    this.log(LogLevel.INFO, context, message, details);
  }

  /**
   * Warning level logging
   */
  static warn(context: string, message: string, details?: any): void {
    this.log(LogLevel.WARN, context, message, details);
  }

  /**
   * Error level logging
   */
  static error(context: string, message: string, error?: any): void {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error;

    this.log(LogLevel.ERROR, context, message, errorDetails);
  }

  /**
   * Output log to console (development only)
   */
  private static outputToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.context}]`;
    const consoleMethod = entry.level.toLowerCase() as keyof typeof console;

    if (consoleMethod in console) {
      const method = console[consoleMethod as 'debug' | 'info' | 'warn' | 'error'];
      
      if (entry.details) {
        (method as any)(prefix, entry.message, entry.details);
      } else {
        (method as any)(prefix, entry.message);
      }
    }
  }

  /**
   * Add log to in-memory history
   */
  private static addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);

    // Keep memory bounded
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  /**
   * Get stack trace for debugging
   */
  private static getStackTrace(): string | undefined {
    if (!this.isDevelopment) return undefined;

    const error = new Error();
    return error.stack?.split('\n').slice(3).join('\n');
  }

  /**
   * Handle critical errors (can integrate with error tracking)
   */
  private static handleCriticalError(_entry: LogEntry): void {
    // TODO: Integrate with Sentry, LogRocket, or other error tracking
    // Example:
    // if (window.Sentry) {
    //   window.Sentry.captureException(entry.details || new Error(entry.message), {
    //     tags: { context: entry.context },
    //     extra: { details: entry.details },
    //   });
    // }
  }

  /**
   * Get log history (useful for debugging in production)
   */
  static getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  /**
   * Clear log history
   */
  static clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Export logs for debugging/analysis
   */
  static exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }

  /**
   * Convenience method for API errors with standard format
   */
  static apiError(
    context: string,
    endpoint: string,
    statusCode?: number,
    error?: any
  ): void {
    const message = `API Error: ${endpoint} (${statusCode || 'Unknown'})`;
    this.error(context, message, error);
  }

  /**
   * Convenience method for validation errors
   */
  static validationError(
    context: string,
    field: string,
    reason: string
  ): void {
    const message = `Validation Error: ${field} - ${reason}`;
    this.warn(context, message);
  }
}

// Default export for convenience
export default LoggerService;
