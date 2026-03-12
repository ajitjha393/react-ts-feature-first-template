/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/prefer-promise-reject-errors */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from '@/lib/logging/logger';
import { Result } from '@/lib/result';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - for distributed tracing
    this.client.interceptors.request.use(
      (config) => {
        const startTime = performance.now();

        // Store request start time for latency tracking
        (config as any)._startTime = startTime;

        logger.debug('API Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          timestamp: new Date().toISOString(),
        });

        return config;
      },
      (error) => {
        logger.error('Request setup error', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor - track performance and errors
    this.client.interceptors.response.use(
      (response) => {
        const duration = performance.now() - ((response.config as any)._startTime || 0);

        logger.debug('API Response', {
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          status: response.status,
          statusText: response.statusText,
          durationMs: Math.round(duration),
          timestamp: new Date().toISOString(),
        });

        // Track event in Faro for analytics
        logger.trackEvent('api_request_success', {
          method: response.config.method,
          status: response.status,
          url: response.config.url,
          durationMs: duration,
        });

        return response;
      },
      (error: AxiosError) => {
        const duration = performance.now() - ((error.config as any)._startTime || 0);

        logger.error('API Error', {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          durationMs: Math.round(duration),
          timestamp: new Date().toISOString(),
        });

        // Track error event in Faro for monitoring
        logger.trackEvent('api_request_error', {
          method: error.config?.method,
          status: error.response?.status,
          url: error.config?.url,
          durationMs: duration,
          errorMessage: error.message,
        });

        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: unknown): Promise<Result<T>> {
    return Result.tryAsync(this.client.get<T>(url, config).then((res) => res.data));
  }

  async post<T>(url: string, data?: unknown, config?: unknown): Promise<Result<T>> {
    return Result.tryAsync(this.client.post<T>(url, data, config).then((res) => res.data));
  }

  async put<T>(url: string, data?: unknown, config?: unknown): Promise<Result<T>> {
    return Result.tryAsync(this.client.put<T>(url, data, config).then((res) => res.data));
  }

  async patch<T>(url: string, data?: unknown, config?: unknown): Promise<Result<T>> {
    return Result.tryAsync(this.client.patch<T>(url, data, config).then((res) => res.data));
  }

  async delete<T>(url: string, config?: unknown): Promise<Result<T>> {
    return Result.tryAsync(this.client.delete<T>(url, config).then((res) => res.data));
  }
}

export const apiClient = new ApiClient();
