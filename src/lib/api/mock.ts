/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, react-hooks/rules-of-hooks */
/**
 * Mock API responses for testing without a real backend
 * Toggle between mock and real API using environment variable or localStorage
 */

import { logger } from '@/lib/logging/logger';

// Simulate network delay
const delay = (ms = 500): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// ============ Mock Data ============

export const mockUsers = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    createdAt: new Date('2024-03-10').toISOString(),
  },
];

// ============ Mock Service ============

export class MockApiService {
  private users = [...mockUsers];

  async getUsers(): Promise<{ users: typeof this.users; total: number }> {
    await delay();
    logger.info('[MOCK] GET /api/users');
    return {
      users: this.users,
      total: this.users.length,
    };
  }

  async getUser(id: string): Promise<(typeof this.users)[0]> {
    await delay();
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      logger.error('[MOCK] User not found', { id });
      throw new Error(`User with ID ${id} not found`);
    }

    logger.info('[MOCK] GET /api/users/:id', { id });
    return user;
  }

  async createUser(data: { name: string; email: string }): Promise<(typeof this.users)[0]> {
    await delay();

    // Validation
    if (!data.name || data.name.trim().length === 0) {
      logger.error('[MOCK] Validation error - name required');
      throw new Error('Name is required');
    }

    if (!data.email || !data.email.includes('@')) {
      logger.error('[MOCK] Validation error - invalid email');
      throw new Error('Valid email is required');
    }

    if (this.users.some((u) => u.email === data.email)) {
      logger.error('[MOCK] Validation error - email exists', { email: data.email });
      throw new Error(`User with email ${data.email} already exists`);
    }

    const newUser = {
      id: String(Math.max(...this.users.map((u) => parseInt(u.id, 10)), 0) + 1),
      name: data.name.trim(),
      email: data.email.trim(),
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    logger.info('[MOCK] POST /api/users - created', { userId: newUser.id });
    return newUser;
  }

  async updateUser(
    id: string,
    data: { name?: string; email?: string },
  ): Promise<(typeof this.users)[0]> {
    await delay();

    const user = this.users.find((u) => u.id === id);
    if (!user) {
      logger.error('[MOCK] User not found for update', { id });
      throw new Error(`User with ID ${id} not found`);
    }

    if (data.name !== undefined && data.name.trim().length === 0) {
      logger.error('[MOCK] Validation error - name cannot be empty');
      throw new Error('Name cannot be empty');
    }

    if (data.email !== undefined && !data.email.includes('@')) {
      logger.error('[MOCK] Validation error - invalid email');
      throw new Error('Valid email is required');
    }

    if (data.email && this.users.some((u) => u.email === data.email && u.id !== id)) {
      logger.error('[MOCK] Validation error - email taken', { email: data.email });
      throw new Error(`User with email ${data.email} already exists`);
    }

    if (data.name) user.name = data.name.trim();
    if (data.email) user.email = data.email.trim();

    logger.info('[MOCK] PATCH /api/users/:id - updated', { id });
    return user;
  }

  async deleteUser(id: string): Promise<(typeof this.users)[0]> {
    await delay();

    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      logger.error('[MOCK] User not found for deletion', { id });
      throw new Error(`User with ID ${id} not found`);
    }

    const deletedUser = this.users.splice(index, 1)[0];
    logger.info('[MOCK] DELETE /api/users/:id - deleted', { id });
    return deletedUser;
  }
}

// ============ Global Mock Instance ============

export const mockApiService = new MockApiService();

// ============ Helper Functions ============

/**
 * Check if mock API should be used
 * Priority: localStorage > environment variable > default false
 */
export function useMockApi(): boolean {
  const stored = localStorage.getItem('USE_MOCK_API');
  if (stored !== null) {
    return stored === 'true';
  }
  return import.meta.env.VITE_USE_MOCK_API === 'true';
}

/**
 * Toggle mock API on/off
 */
export function toggleMockApi(enabled: boolean): void {
  localStorage.setItem('USE_MOCK_API', String(enabled));
  logger.info('Mock API toggled', { enabled });
  // Reload to apply changes
  window.location.reload();
}

/**
 * Log mock API status
 */
export function logMockApiStatus(): void {
  const mockEnabled = useMockApi();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  logger.info('API Configuration', {
    mockEnabled,
    mockStatus: mockEnabled ? 'USING MOCK API' : 'USING REAL API',
    apiUrl: mockEnabled ? '(mock)' : apiUrl,
  });
}
