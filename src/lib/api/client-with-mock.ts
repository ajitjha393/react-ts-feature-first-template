/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/prefer-promise-reject-errors, react-hooks/rules-of-hooks */
/**
 * API Client that switches between real and mock APIs
 * Allows development/testing without a running backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from '@/lib/logging/logger';
import { Result } from '@/lib/result';
import { useMockApi, mockApiService } from './mock';

export class ApiClient {
  private client: AxiosInstance;
  private mockMode: boolean;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api') {
    this.mockMode = useMockApi();

    if (!this.mockMode) {
      this.client = axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.setupInterceptors();
    } else {
      // Create dummy client for mock mode
      this.client = axios.create();
    }

    logger.info('API Client initialized', {
      mode: this.mockMode ? 'MOCK' : 'REAL',
      baseURL: this.mockMode ? '(mock)' : baseURL,
    });
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('API Request', { method: config.method, url: config.url });
        return config;
      },
      (error) => {
        logger.error('Request setup error', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('API Response', { status: response.status, url: response.config.url });
        return response;
      },
      (error: AxiosError) => {
        logger.error('API Error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
        });
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: unknown): Promise<Result<T>> {
    if (this.mockMode) {
      return this.handleMockRequest(url, 'GET', config);
    }

    return Result.tryAsync(this.client.get<T>(url, config).then((res) => res.data));
  }

  async post<T>(url: string, data?: unknown, config?: unknown): Promise<Result<T>> {
    if (this.mockMode) {
      return this.handleMockRequest(url, 'POST', config, data);
    }

    return Result.tryAsync(this.client.post<T>(url, data, config).then((res) => res.data));
  }

  async put<T>(url: string, data?: unknown, config?: unknown): Promise<Result<T>> {
    if (this.mockMode) {
      return this.handleMockRequest(url, 'PUT', config, data);
    }

    return Result.tryAsync(this.client.put<T>(url, data, config).then((res) => res.data));
  }

  async patch<T>(url: string, data?: unknown, config?: unknown): Promise<Result<T>> {
    if (this.mockMode) {
      return this.handleMockRequest(url, 'PATCH', config, data);
    }

    return Result.tryAsync(this.client.patch<T>(url, data, config).then((res) => res.data));
  }

  async delete<T>(url: string, config?: unknown): Promise<Result<T>> {
    if (this.mockMode) {
      return this.handleMockRequest(url, 'DELETE', config);
    }

    return Result.tryAsync(this.client.delete<T>(url, config).then((res) => res.data));
  }

  private async handleMockRequest<T>(
    url: string,
    method: string,
    config?: unknown,
    data?: unknown,
  ): Promise<Result<T>> {
    return Result.tryAsync(async () => {
      // Extract route and ID from URL
      const parts = url.split('/');

      if (url === '/users') {
        if (method === 'GET') {
          return (await mockApiService.getUsers()) as T;
        } else if (method === 'POST') {
          return (await mockApiService.createUser(data as { name: string; email: string })) as T;
        }
      } else if (url.startsWith('/users/')) {
        const id = parts[parts.length - 1];

        if (method === 'GET') {
          return (await mockApiService.getUser(id)) as T;
        } else if (method === 'PATCH') {
          return (await mockApiService.updateUser(
            id,
            data as { name?: string; email?: string },
          )) as T;
        } else if (method === 'DELETE') {
          return (await mockApiService.deleteUser(id)) as T;
        }
      }

      throw new Error(`Mock handler not found for ${method} ${url}`);
    });
  }
}

export const apiClient = new ApiClient();
