import { initializeFaro as initFaroReact, getWebInstrumentations } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { WebVitalsInstrumentation } from '@grafana/faro-web-sdk';
import { logger } from './logger';

/**
 * Initialize Grafana Faro for comprehensive frontend observability
 * Includes:
 * - Distributed Tracing (Web Tracing SDK)
 * - Real User Monitoring (Web Vitals)
 * - Error Tracking & Session Replay
 * - Performance Monitoring
 */
export function initializeFaro(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const faroUrl = import.meta.env.VITE_FARO_URL as string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const appName = (import.meta.env.VITE_APP_NAME as string | undefined) ?? 'react-app';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const appVersion = (import.meta.env.VITE_APP_VERSION as string | undefined) ?? '0.1.0';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const environment = import.meta.env.MODE as string;

  // Initialize only if Faro URL is configured
  if (!faroUrl) {
    logger.warn(
      'VITE_FARO_URL not configured. Grafana Faro observability is disabled. Set VITE_FARO_URL to enable.',
    );
    return;
  }

  try {
    initFaroReact({
      url: faroUrl,
      app: {
        name: appName,
        version: appVersion,
        environment,
      },
      // Capture all sessions (can be adjusted based on volume)
      sessionSampleRate: 1.0,
      // Tracing instrumentation for distributed tracing
      instrumentations: [
        // Web instrumentations (fetch, XHR, console, etc)
        ...getWebInstrumentations(),
        // Distributed tracing across network requests
        new TracingInstrumentation(),
        // Real User Monitoring metrics (LCP, FID, CLS, etc)
        new WebVitalsInstrumentation(),
      ],
      // Pauses before sending logs (batch optimization)
      logBatchSize: 50,
      logBatchTimeoutMs: 5000,
      // Enable stacktrace parsing for better error reporting
      parseStacktrace: true,
      // Track user interactions
      trackEvent: true,
    });

    logger.info(`Grafana Faro initialized: ${appName} v${appVersion} (${environment})`);
  } catch (error) {
    logger.error(
      'Failed to initialize Grafana Faro',
      error instanceof Error ? error : new Error(String(error)),
    );
    // Don't throw - app should work even if Faro fails to initialize
  }
}
