import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Users', href: '/users', icon: '👥' },
];

export default function Layout(): React.ReactElement {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">⚛️</div>
              <h1 className="text-2xl font-bold text-gray-900">React App</h1>
            </div>

            <div className="flex gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 text-center md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Template</p>
              <p className="text-xs text-gray-600">Feature-First Architecture</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Stack</p>
              <p className="text-xs text-gray-600">React + TypeScript + TanStack Query</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Version</p>
              <p className="text-xs text-gray-600">© {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
