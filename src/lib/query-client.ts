/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
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

// Monitor query cache - track all query state changes
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
queryClient.getQueryCache().subscribe((event) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  switch (event.type) {
    case 'error':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      logger.error('Query error', {
        queryKey: event.query.queryKey,
        error: event.error instanceof Error ? event.error.message : String(event.error),
      });
      // Track query errors in Faro for monitoring
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      logger.trackEvent('query_error', {
        queryKey: JSON.stringify(event.query.queryKey),
        error: event.error instanceof Error ? event.error.message : String(event.error),
      });
      break;

    case 'success':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      logger.debug('Query success', {
        queryKey: event.query.queryKey,
      });
      break;

    case 'updated':
      // Query was updated
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (event.action.type === 'error') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        logger.warn('Query update failed', {
          queryKey: event.query.queryKey,
        });
      }
      break;

    default:
      break;
  }
});

// Monitor mutation cache - track all mutation state changes
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
queryClient.getMutationCache().subscribe((event) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  switch (event.type) {
    case 'error':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      logger.error('Mutation error', {
        error: event.error instanceof Error ? event.error.message : String(event.error),
        variables: event.mutation.state.variables,
      });
      // Track mutation errors in Faro
      logger.trackEvent('mutation_error', {
        error: event.error instanceof Error ? event.error.message : String(event.error),
      });
      break;

    case 'success':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      logger.debug('Mutation success', {
        variables: event.mutation.state.variables,
      });
      // Track successful mutations
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      logger.trackEvent('mutation_success', {
        variablesCount: Object.keys(event.mutation.state.variables || {}).length,
      });
      break;

    case 'updated':
      // Mutation was updated
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (event.action.type === 'error') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        logger.warn('Mutation update failed', {
          error: event.action.payload?.message,
        });
      }
      break;

    default:
      break;
  }
});
