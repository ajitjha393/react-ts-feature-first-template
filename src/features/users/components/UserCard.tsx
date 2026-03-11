import React from 'react';
import { User } from '@/features/users/types';
import { useDeleteUser } from '@/features/users/hooks';

interface UserCardProps {
  user: User;
  onUpdate?: (user: User) => void;
}

export function UserCard({ user, onUpdate }: UserCardProps): React.ReactElement {
  const deleteUserMutation = useDeleteUser();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async (): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUserMutation.mutateAsync(user.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-gray-900">{user.name}</h3>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-xs text-gray-500">
          Created: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onUpdate?.(user)}
          className="btn-secondary"
          disabled={isDeleting}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="btn-secondary text-red-600 hover:bg-red-50"
          disabled={isDeleting || deleteUserMutation.isPending}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
