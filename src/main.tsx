import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeFaro } from '@/lib/logging/faro';
import App from '@/App';
import '@/index.css';

// Initialize Grafana Faro logging
initializeFaro();

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
