import { logStore } from '@/lib/logging/store';

interface LogContext {
  [key: string]: unknown;
}

// Get Faro instance from window
function getFaro(): any {
  return (window as any).__faro;
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    console.debug(message, context);
    logStore.addLog('debug', message, context);

    try {
      const faro = getFaro();
      if (faro?.api) {
        faro.api.pushLog([{ level: 'debug', message, ...context }]);
      }
    } catch (error) {
      // Faro not initialized, ignore
    }
  },

  info(message: string, context?: LogContext): void {
    console.info(message, context);
    logStore.addLog('info', message, context);

    try {
      const faro = getFaro();
      if (faro?.api) {
        faro.api.pushLog([{ level: 'info', message, ...context }]);
      }
    } catch (error) {
      // Faro not initialized, ignore
    }
  },

  warn(message: string, context?: LogContext): void {
    console.warn(message, context);
    logStore.addLog('warn', message, context);

    try {
      const faro = getFaro();
      if (faro?.api) {
        faro.api.pushLog([{ level: 'warn', message, ...context }]);
      }
    } catch (error) {
      // Faro not initialized, ignore
    }
  },

  error(message: string, context?: LogContext | Error): void {
    const logContext = context instanceof Error ? { error: context.message } : context;
    console.error(message, logContext);
    logStore.addLog('error', message, logContext);

    try {
      const faro = getFaro();
      if (faro?.api) {
        faro.api.pushLog([{ level: 'error', message, ...logContext }]);
      }
    } catch (error) {
      // Faro not initialized, ignore
    }
  },

  exception(error: Error, context?: LogContext): void {
    console.error('Exception:', error, context);
    logStore.addLog('error', `Exception: ${error.message}`, { ...context, stack: error.stack });

    try {
      const faro = getFaro();
      if (faro?.api) {
        faro.api.pushError(error, { ...context });
      }
    } catch (faroError) {
      // Faro not initialized, ignore
    }
  },
};
