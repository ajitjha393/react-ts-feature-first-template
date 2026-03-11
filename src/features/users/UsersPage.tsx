import React from 'react';
import { useUsers, useCreateUser } from '@/features/users/hooks';
import { UserCard } from '@/features/users/components/UserCard';
import { logger } from '@/lib/logging/logger';
import { CreateUserForm } from '@/features/users/components/CreateUserForm';

export default function UsersPage(): React.ReactElement {
  const { data: usersData, isLoading, error, refetch } = useUsers();
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    logger.info('UsersPage mounted');
    return () => {
      logger.info('UsersPage unmounted');
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6">
        <h2 className="font-bold text-red-900">Error Loading Users</h2>
        <p className="mt-2 text-red-800">{error.message}</p>
        <button
          onClick={() => void refetch()}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  const users = usersData?.users ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-gray-600">Manage application users</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Create User'}
        </button>
      </div>

      {showForm && (
        <CreateUserForm
          onSuccess={() => {
            setShowForm(false);
            void refetch();
          }}
        />
      )}

      {users.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <p className="text-gray-600">No users found. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {users.length} {users.length === 1 ? 'user' : 'users'} total
          </p>
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onUpdate={() => void refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
