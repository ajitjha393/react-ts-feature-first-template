/**
 * Initialize Grafana Faro for frontend monitoring
 * Optional: Only initialize if VITE_FARO_URL is configured
 */
export function initializeFaro(): void {
  // Only initialize if configured and in production
  const faroUrl = import.meta.env.VITE_FARO_URL;

  if (!faroUrl || !import.meta.env.PROD) {
    return; // Skip initialization in development or if not configured
  }

  try {
    // Dynamically import Faro to avoid issues if not configured
    import('@grafana/faro-react').then(({ initializeFaro: initFaro }) => {
      initFaro({
        url: faroUrl,
        app: {
          name: import.meta.env.VITE_APP_NAME || 'react-app',
          version: import.meta.env.VITE_APP_VERSION || '0.1.0',
          environment: import.meta.env.MODE,
        },
        sessionSampleRate: 1.0,
      });
    }).catch((error) => {
      console.error('Failed to initialize Faro:', error);
    });
  } catch (error) {
    console.error('Failed to initialize Faro:', error);
  }
}
