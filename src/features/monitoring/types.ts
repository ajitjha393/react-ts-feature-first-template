export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogFilter {
  level?: LogLevel;
  search?: string;
}

export interface MonitoringStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  debugCount: number;
}
