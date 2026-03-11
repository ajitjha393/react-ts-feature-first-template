import { useCallback, useEffect, useState } from 'react';
import { Result } from '@/lib/result';
import { logger } from '@/lib/logging/logger';

interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

/**
 * Hook for handling async operations with proper error handling
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately on mount
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
): UseAsyncState<T> & { execute: () => Promise<Result<T>> } {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = useCallback(async (): Promise<Result<T>> => {
    setState({ status: 'pending', data: null, error: null });
    const result = await Result.tryAsync(asyncFunction());

    if (result.isSuccess) {
      setState({ status: 'success', data: result.value!, error: null });
    } else {
      setState({ status: 'error', data: null, error: result.error! });
      logger.error('Async operation failed', result.error);
    }

    return result;
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      void execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
}
