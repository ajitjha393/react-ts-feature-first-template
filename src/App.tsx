import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { queryClient } from '@/lib/query-client';
import Layout from '@/components/Layout';
import HomePage from '@/features/home/HomePage';
import UsersPage from '@/features/users/UsersPage';
import MonitoringPage from '@/features/monitoring/MonitoringPage';
import { logger } from '@/lib/logging/logger';

export default function App(): React.ReactElement {
  React.useEffect(() => {
    logger.info('Application started', {
      version: import.meta.env.VITE_APP_VERSION,
      environment: import.meta.env.MODE,
    });
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="monitoring" element={<MonitoringPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
