// utils/logger.ts
export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  VERBOSE = 5,
}

// Global log level configuration
const LOG_LEVEL: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR;

class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }
  
  private shouldLog(level: LogLevel): boolean {
    return level <= LOG_LEVEL;
  }
  
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }
  
  error(message: string, error?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message), error || '');
    }
  }
  
  warn(message: string, data?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message), data || '');
    }
  }
  
  info(message: string, data?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage('INFO', message), data || '');
    }
  }
  
  debug(message: string, data?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', message), data || '');
    }
  }
  
  verbose(message: string, data?: any) {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      console.log(this.formatMessage('VERBOSE', message), data || '');
    }
  }
  
  // Performance tracking
  private perfTimes = new Map<string, number>();
  
  time(label: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.perfTimes.set(label, Date.now());
    }
  }
  
  timeEnd(label: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const startTime = this.perfTimes.get(label);
      if (startTime) {
        const duration = Date.now() - startTime;
        console.log(this.formatMessage('PERF', `${label} took ${duration}ms`));
        this.perfTimes.delete(label);
      }
    }
  }
  
  // Batch logging for arrays
  batch(level: LogLevel, messages: string[]) {
    if (this.shouldLog(level)) {
      console.group(this.formatMessage('BATCH', `Batch of ${messages.length} items`));
      messages.forEach(msg => console.log(msg));
      console.groupEnd();
    }
  }
}

// Create a logger instance with context
export const createLogger = (context: string) => new Logger(context);

// Default logger for general use
export const logger = createLogger('App');