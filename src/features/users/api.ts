import { apiClient } from '@/lib/api/client';
import { User, CreateUserRequest, UpdateUserRequest } from '@/features/users/types';
import { Result } from '@/lib/result';

export const usersApi = {
  async getUser(id: string): Promise<Result<User>> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async listUsers(page = 1, limit = 10): Promise<Result<{ users: User[]; total: number }>> {
    return apiClient.get<{ users: User[]; total: number }>('/users', {
      params: { page, limit },
    });
  },

  async createUser(data: CreateUserRequest): Promise<Result<User>> {
    return apiClient.post<User>('/users', data);
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<Result<User>> {
    return apiClient.patch<User>(`/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<Result<void>> {
    return apiClient.delete<void>(`/users/${id}`);
  },
};
