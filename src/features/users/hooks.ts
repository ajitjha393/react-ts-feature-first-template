import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/features/users/api';
import { User, CreateUserRequest, UpdateUserRequest } from '@/features/users/types';
import { logger } from '@/lib/logging/logger';

const USERS_QUERY_KEY = ['users'] as const;

export function useUser(id: string): ReturnType<typeof useQuery<User>> {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: async () => {
      const result = await usersApi.getUser(id);
      return result.getOrThrow();
    },
  });
}

export function useUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, 'list', page, limit],
    queryFn: async () => {
      const result = await usersApi.listUsers(page, limit);
      return result.getOrThrow();
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const result = await usersApi.createUser(data);
      return result.getOrThrow();
    },
    onSuccess: () => {
      logger.info('User created successfully');
      // Invalidate users list to refresh data
      void queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEY,
      });
    },
    onError: (error: Error) => {
      logger.error('Failed to create user', error);
    },
  });
}

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      const result = await usersApi.updateUser(userId, data);
      return result.getOrThrow();
    },
    onSuccess: (user) => {
      logger.info('User updated successfully', { userId });
      // Update specific user in cache
      queryClient.setQueryData([...USERS_QUERY_KEY, userId], user);
    },
    onError: (error: Error) => {
      logger.error('Failed to update user', error);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const result = await usersApi.deleteUser(userId);
      return result.getOrThrow();
    },
    onSuccess: () => {
      logger.info('User deleted successfully');
      // Invalidate users list
      void queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEY,
      });
    },
    onError: (error: Error) => {
      logger.error('Failed to delete user', error);
    },
  });
}
