import React from 'react';
import { Link } from 'react-router-dom';
import { logger } from '@/lib/logging/logger';

export default function HomePage(): React.ReactElement {
  React.useEffect(() => {
    logger.info('HomePage mounted', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

    return () => {
      logger.info('HomePage unmounted');
    };
  }, []);

  const handleTestLogging = (): void => {
    logger.info('User clicked test logging button', {
      clickTime: new Date().toISOString(),
      page: 'HomePage',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Welcome</h1>
        <p className="text-lg text-gray-600">
          This is a production-ready React template with feature-first architecture, proper logging, and
          best practices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 text-xl font-bold">✓ Architecture</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Feature-based folder structure</li>
            <li>Result/ErrorOr pattern for errors</li>
            <li>Clean separation of concerns</li>
            <li>Type-safe TypeScript</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="mb-2 text-xl font-bold">✓ Developer Experience</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>ESLint strict rules (0 warnings)</li>
            <li>Prettier auto-formatting</li>
            <li>Vitest + React Testing Library</li>
            <li>Hot module replacement</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="mb-2 text-xl font-bold">✓ Logging & Monitoring</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Grafana Faro integration</li>
            <li>Real-time log viewer</li>
            <li>Automatic error tracking</li>
            <li>Performance monitoring</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="mb-2 text-xl font-bold">✓ Data Fetching</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>TanStack Query integration</li>
            <li>Automatic caching & sync</li>
            <li>Error handling with Result</li>
            <li>Request deduplication</li>
          </ul>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/users"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-bold">Users</h3>
          <p className="text-sm text-gray-600 mt-1">
            Complete CRUD example with proper error handling and logging
          </p>
        </Link>

        <Link
          to="/monitoring"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-bold">Monitoring</h3>
          <p className="text-sm text-gray-600 mt-1">
            Real-time log viewer - see all application logs here
          </p>
        </Link>

        <div className="card">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-bold">Ready to Build</h3>
          <p className="text-sm text-gray-600 mt-1">
            Check QUICK_START.md to create your first feature
          </p>
        </div>
      </div>

      {/* Logging Demo */}
      <div className="rounded-lg bg-indigo-50 p-6">
        <h2 className="mb-2 text-lg font-bold text-indigo-900">Logging Demo</h2>
        <p className="text-indigo-800 text-sm mb-4">
          Click the button below to generate a log entry. View it in real-time on the{' '}
          <Link to="/monitoring" className="underline font-semibold hover:text-indigo-900">
            Monitoring page
          </Link>
          .
        </p>
        <button onClick={handleTestLogging} className="btn-primary">
          Generate Test Log
        </button>
      </div>

      {/* Getting Started */}
      <div className="rounded-lg bg-blue-50 p-6">
        <h2 className="mb-4 text-lg font-bold text-blue-900">Quick Start</h2>
        <ol className="list-inside list-decimal space-y-2 text-blue-800 text-sm">
          <li>
            <strong>Explore features:</strong> Check <code className="rounded bg-white px-2 py-1">src/features/</code> for
            feature structure
          </li>
          <li>
            <strong>View logs:</strong> Go to{' '}
            <Link to="/monitoring" className="underline font-semibold">
              Monitoring page
            </Link>
            {' '}to see all logs
          </li>
          <li>
            <strong>Create features:</strong> Use QUICK_START.md as a guide
          </li>
          <li>
            <strong>Understand patterns:</strong> Read ARCHITECTURE.md and BEST_PRACTICES.md
          </li>
          <li>
            <strong>Check code quality:</strong> Run{' '}
            <code className="rounded bg-white px-2 py-1">npm run lint</code>
          </li>
        </ol>
      </div>

      {/* Key Files */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Documentation</h2>
        <div className="grid gap-2 text-sm">
          <p>
            <strong>README.md</strong> - Complete API reference and feature documentation
          </p>
          <p>
            <strong>ARCHITECTURE.md</strong> - Design patterns and architectural decisions
          </p>
          <p>
            <strong>BEST_PRACTICES.md</strong> - Code guidelines and do's/don'ts
          </p>
          <p>
            <strong>QUICK_START.md</strong> - Step-by-step guide to create new features
          </p>
          <p>
            <strong>CLAUDE.md</strong> - Instructions for AI code generation
          </p>
        </div>
      </div>
    </div>
  );
}
