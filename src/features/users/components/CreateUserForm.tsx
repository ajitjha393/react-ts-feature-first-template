import React from 'react';
import { z } from '@/lib/validation';
import { validateInput } from '@/lib/validation';
import { useCreateUser } from '@/features/users/hooks';
import { logger } from '@/lib/logging/logger';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps): React.ReactElement {
  const [formData, setFormData] = React.useState({ name: '', email: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const createUserMutation = useCreateUser();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const result = validateInput(createUserSchema, formData);

    if (result.isFailure) {
      logger.warn('Validation failed', { message: result.error?.message });
      setErrors({ form: result.error?.message ?? 'Validation failed' });
      return;
    }

    // Submit
    logger.info('Creating user', { email: formData.email });

    try {
      await createUserMutation.mutateAsync(result.value);
      logger.info('User created successfully', { email: formData.email });
      setFormData({ name: '', email: '' });
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      logger.error('Failed to create user', error instanceof Error ? error : new Error(message));
      setErrors({ form: message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-bold">Create New User</h2>

      {errors.form && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{errors.form}</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          className="input-field mt-1"
          disabled={createUserMutation.isPending}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          className="input-field mt-1"
          disabled={createUserMutation.isPending}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="flex gap-2 border-t border-gray-200 pt-4">
        <button
          type="submit"
          disabled={createUserMutation.isPending}
          className="btn-primary flex-1"
        >
          {createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  );
}
