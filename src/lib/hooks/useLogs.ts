import { useEffect, useState } from 'react';
import { logStore, LogEntry } from '@/lib/logging/store';

/**
 * Hook to subscribe to log updates
 * Useful for displaying logs in UI (development/debugging)
 */
export function useLogs(): LogEntry[] {
  const [logs, setLogs] = useState<LogEntry[]>(() => logStore.getLogs());

  useEffect(() => {
    // Subscribe to log changes
    const unsubscribe = logStore.subscribe(() => {
      setLogs(logStore.getLogs());
    });

    return unsubscribe;
  }, []);

  return logs;
}
