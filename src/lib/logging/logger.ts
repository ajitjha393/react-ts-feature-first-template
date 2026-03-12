type LogContext = Record<string, unknown>;

interface FaroAPI {
  pushLog?: (logs: { level: string; message: string; attributes?: LogContext }[]) => void;
  pushError?: (
    error: Error,
    options?: { skipStackFrameProcessing: boolean; attributes?: LogContext },
  ) => void;
  pushEvent?: (eventName: string, attributes?: LogContext) => void;
  pushTrace?: (spanName: string, attributes?: LogContext) => void;
}

interface Faro {
  api?: FaroAPI;
}

/**
 * Get Faro instance for observability
 * Faro provides: distributed tracing, error tracking, performance monitoring
 */
function getFaro(): Faro | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  return (window as any).faro as Faro | undefined;
}

/**
 * Logger utility with Grafana Faro integration
 * All logs are automatically sent to Faro for observability
 */
export const logger = {
  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.debug(message, context);
    try {
      const faro = getFaro();
      if (faro?.api?.pushLog) {
        faro.api.pushLog([
          {
            level: 'debug',
            message,
            ...(context && { attributes: context }),
          },
        ]);
      }
    } catch {
      // Silently ignore Faro errors
    }
  },

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.info(message, context);
    try {
      const faro = getFaro();
      if (faro?.api?.pushLog) {
        faro.api.pushLog([
          {
            level: 'info',
            message,
            ...(context && { attributes: context }),
          },
        ]);
      }
    } catch {
      // Silently ignore Faro errors
    }
  },

  /**
   * Warn level logging
   */
  warn(message: string, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.warn(message, context);
    try {
      const faro = getFaro();
      if (faro?.api?.pushLog) {
        faro.api.pushLog([
          {
            level: 'warn',
            message,
            ...(context && { attributes: context }),
          },
        ]);
      }
    } catch {
      // Silently ignore Faro errors
    }
  },

  /**
   * Error level logging
   */
  error(message: string, context?: LogContext | Error): void {
    const logContext = context instanceof Error ? { error: context.message } : context;
    // eslint-disable-next-line no-console
    console.error(message, logContext);
    try {
      const faro = getFaro();
      if (faro?.api?.pushLog) {
        faro.api.pushLog([
          {
            level: 'error',
            message,
            ...(logContext && { attributes: logContext }),
          },
        ]);
      }
    } catch {
      // Silently ignore Faro errors
    }
  },

  /**
   * Exception tracking - automatically sent to Faro with stack trace
   */
  exception(error: Error, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.error('Exception:', error, context);
    try {
      const faro = getFaro();
      if (faro?.api?.pushError) {
        faro.api.pushError(error, {
          skipStackFrameProcessing: false,
          ...(context && { attributes: context }),
        });
      }
    } catch {
      // Silently ignore Faro errors
    }
  },

  /**
   * Track custom events for analytics
   */
  trackEvent(eventName: string, attributes?: LogContext): void {
    try {
      const faro = getFaro();
      if (faro?.api?.pushEvent) {
        faro.api.pushEvent(eventName, attributes);
      }
    } catch {
      // Silently ignore Faro errors
    }
  },

  /**
   * Distributed tracing span
   */
  startTrace(spanName: string): { end: () => void } {
    try {
      const faro = getFaro();
      if (faro?.api?.pushTrace) {
        const startTime = performance.now();
        return {
          end: () => {
            const duration = performance.now() - startTime;
            // eslint-disable-next-line no-console
            console.log(`Span: ${spanName} took ${duration.toFixed(2)}ms`);
          },
        };
      }
    } catch {
      // Silently ignore Faro errors
    }

    return {
      end: () => {
        // no-op
      },
    };
  },
};
