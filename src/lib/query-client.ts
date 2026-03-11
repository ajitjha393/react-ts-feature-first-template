import { QueryClient } from '@tanstack/react-query';
import { logger } from '@/lib/logging/logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// Log query errors
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'error') {
    logger.error('Query error', {
      error: event.error,
      query: event.query.queryKey,
    });
  }
});

// Log mutation errors
queryClient.getMutationCache().subscribe((event) => {
  if (event.type === 'error') {
    logger.error('Mutation error', {
      error: event.error,
    });
  }
});
