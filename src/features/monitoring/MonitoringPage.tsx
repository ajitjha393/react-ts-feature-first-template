import React, { useState } from 'react';
import { useLogs } from '@/lib/hooks/useLogs';
import { logger } from '@/lib/logging/logger';
import { LogEntry } from '@/lib/logging/store';
import { LogLevel, LogFilter } from '@/features/monitoring/types';

const levelColors: Record<LogLevel, string> = {
  debug: 'bg-gray-100 text-gray-800',
  info: 'bg-blue-100 text-blue-800',
  warn: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
};

export default function MonitoringPage(): React.ReactElement {
  const logs = useLogs();
  const [filter, setFilter] = useState<LogFilter>({ level: undefined, search: '' });
  const [autoScroll, setAutoScroll] = useState(true);

  // Filter logs based on current filters
  const filteredLogs = logs.filter((log) => {
    if (filter.level && log.level !== filter.level) return false;
    if (filter.search && !log.message.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Calculate stats
  const stats = {
    total: logs.length,
    errors: logs.filter((l) => l.level === 'error').length,
    warnings: logs.filter((l) => l.level === 'warn').length,
    info: logs.filter((l) => l.level === 'info').length,
    debug: logs.filter((l) => l.level === 'debug').length,
  };

  const handleTestLog = (): void => {
    logger.info('Test log message', {
      timestamp: new Date().toISOString(),
      random: Math.random(),
    });
  };

  const handleTestError = (): void => {
    logger.error('Test error message', new Error('This is a test error'));
  };

  const handleClearLogs = (): void => {
    logger.info('Logs cleared by user');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-gray-900">Monitoring & Logging</h1>
        <p className="text-gray-600">
          Real-time view of all application logs. Logs are sent to Grafana Faro (if configured).
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="card">
          <p className="text-sm font-medium text-gray-600">Total Logs</p>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-red-600">Errors</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.errors}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-yellow-600">Warnings</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.warnings}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-blue-600">Info</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.info}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-gray-600">Debug</p>
          <p className="mt-2 text-3xl font-bold text-gray-600">{stats.debug}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Level</label>
            <select
              value={filter.level || ''}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  level: (e.target.value as LogLevel) || undefined,
                })
              }
              className="input-field mt-1"
            >
              <option value="">All Levels</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Search Message</label>
            <input
              type="text"
              placeholder="Search logs..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="input-field mt-1"
            />
          </div>

          {/* Controls */}
          <div className="flex items-end gap-2">
            <button onClick={handleTestLog} className="btn-primary flex-1">
              Test Log
            </button>
            <button onClick={handleTestError} className="btn-secondary flex-1">
              Test Error
            </button>
          </div>
        </div>

        {/* Auto-scroll toggle */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Auto-scroll to latest</span>
          </label>
          <button
            onClick={handleClearLogs}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* Logs Display */}
      <div className="card max-h-96 space-y-2 overflow-y-auto bg-gray-900 p-4 font-mono text-sm">
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500">No logs match the current filters.</p>
        ) : (
          filteredLogs.map((log) => (
            <LogEntryComponent key={log.id} log={log} />
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-900">About This Monitoring Page</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-800">
          <li>
            All logs are captured and displayed here in real-time
          </li>
          <li>
            Logs are automatically sent to Grafana Faro (if <code className="rounded bg-white px-1">VITE_FARO_URL</code> is configured)
          </li>
          <li>
            Use this page to debug issues during development
          </li>
          <li>
            Last 500 logs are kept in memory
          </li>
          <li>
            Click "Test Log" and "Test Error" to generate sample logs
          </li>
        </ul>
      </div>
    </div>
  );
}

interface LogEntryComponentProps {
  log: LogEntry;
}

function LogEntryComponent({ log }: LogEntryComponentProps): React.ReactElement {
  const [expanded, setExpanded] = React.useState(false);
  const time = new Date(log.timestamp).toLocaleTimeString();

  return (
    <div className="space-y-1">
      <div
        onClick={() => setExpanded(!expanded)}
        className={`cursor-pointer rounded px-2 py-1 ${levelColors[log.level]}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="font-bold">[{log.level.toUpperCase()}]</span>
            <span className="ml-2 text-xs opacity-75">{time}</span>
            <span className="ml-2">{log.message}</span>
          </div>
          {log.context && <span className="ml-2 text-xs">▼</span>}
        </div>
      </div>

      {expanded && log.context && (
        <div className="ml-4 rounded border border-gray-600 bg-gray-800 p-2 text-gray-300">
          <pre className="overflow-auto text-xs">{JSON.stringify(log.context, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
