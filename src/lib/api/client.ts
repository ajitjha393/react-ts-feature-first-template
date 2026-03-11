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
