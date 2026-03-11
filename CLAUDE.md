# Claude Code Instructions for This Project

When generating or modifying code in this React template, follow these standards strictly.

## Core Principles

### 1. Always Use Result Pattern for Errors
```typescript
// ✅ CORRECT
const result = await apiClient.get<User>('/users');
if (result.isSuccess) {
  processUser(result.value);
} else {
  logger.error('Failed to fetch user', result.error);
}

// ❌ WRONG - throwing exceptions
try {
  const user = await fetch('/users');
} catch (e) {
  // error handling
}
```

### 2. Feature-Based Structure
Always organize new features as:
```
src/features/{featureName}/
├── types.ts          # Domain types
├── api.ts            # API calls (return Result<T>)
├── hooks.ts          # React hooks using TanStack Query
├── components/
│   ├── Component.tsx
│   └── index.ts
├── __tests__/
│   └── hooks.test.ts
└── index.ts          # Public API (exports)
```

### 3. Type Everything
```typescript
// ✅ Explicit types everywhere
function processUser(user: User): string {
  return user.name.toUpperCase();
}

interface UserCardProps {
  user: User;
  onDelete?: (id: string) => Promise<void>;
}

// ❌ Never use implicit any
function process(data: any) { }
```

### 4. Data Fetching with TanStack Query
```typescript
// ✅ Correct pattern
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const result = await usersApi.getUser(id);
      return result.getOrThrow(); // Convert Result to error for Query
    },
  });
}

// In component
function UserProfile() {
  const { data: user, isLoading, error } = useUser(id);
  if (isLoading) return <Spinner />;
  if (error) return <ErrorAlert error={error} />;
  return <UserDetail user={user!} />;
}
```

### 5. API Client Pattern
```typescript
// ✅ All API calls return Result<T>
export const usersApi = {
  async getUser(id: string): Promise<Result<User>> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async createUser(data: CreateUserRequest): Promise<Result<User>> {
    return apiClient.post<User>('/users', data);
  },
};
```

### 6. Error Logging
```typescript
// ✅ Always log errors
import { logger } from '@/lib/logging/logger';

// In hooks
onError: (error: Error) => {
  logger.error('Operation failed', error);
}

// In API interceptors
logger.error('API Error', { status: error.response?.status });

// For exceptions
logger.exception(error, { context: 'operation' });

// ❌ Never silently fail
catch (e) {
  // No logging - WRONG!
}
```

### 7. Validation with Zod
```typescript
// ✅ Use Zod at boundaries
import { z } from '@/lib/validation';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
});

const result = validateInput(createUserSchema, data);
if (result.isSuccess) {
  // Use validated data
}
```

### 8. Styling with Tailwind
```typescript
// ✅ Use Tailwind classes
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
  Click me
</button>

// ❌ Never create CSS files
// ❌ Never use inline styles

// Use custom components defined in src/index.css
<button className="btn-primary">Click me</button>
```

## Required Imports

Always import from these locations:
```typescript
// Results and error handling
import { Result } from '@/lib/result';

// Logging
import { logger } from '@/lib/logging/logger';

// API
import { apiClient } from '@/lib/api/client';

// Validation
import { z, validateInput } from '@/lib/validation';

// React Query
import { useQuery, useMutation } from '@tanstack/react-query';

// React
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
```

## Code Generation Checklist

Before completing code, verify:
- [ ] ✅ All functions have explicit return types
- [ ] ✅ No `any` types
- [ ] ✅ API calls use Result pattern
- [ ] ✅ Error handling is present
- [ ] ✅ Errors are logged with logger
- [ ] ✅ TanStack Query for server state
- [ ] ✅ Types are defined (no inline types)
- [ ] ✅ No console.log (use logger)
- [ ] ✅ Imports use path aliases (@/)
- [ ] ✅ Components are typed with interfaces
- [ ] ✅ Dependencies correct in useEffect/hooks
- [ ] ✅ Tests included

## Common Patterns

### Creating a New Feature
1. **types.ts** - Define domain interfaces
2. **api.ts** - API calls returning Result<T>
3. **hooks.ts** - useQuery/useMutation hooks
4. **components/** - React components using hooks
5. **__tests__/** - Tests for hooks and components

### Handling Async Operations
```typescript
// Hook pattern
export function useLoadData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const result = await api.getData();
      return result.getOrThrow();
    },
  });
}

// Component pattern
function MyComponent() {
  const { data, isLoading, error } = useLoadData();

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  return <Content data={data!} />;
}
```

### Mutation Pattern
```typescript
const mutation = useMutation({
  mutationFn: async (data: CreateRequest) => {
    const result = await api.create(data);
    return result.getOrThrow(); // Throw if failed for Query to handle
  },
  onSuccess: () => {
    logger.info('Created successfully');
    queryClient.invalidateQueries({ queryKey: ['data'] });
  },
  onError: (error: Error) => {
    logger.error('Creation failed', error);
    showNotification('Failed to create');
  },
});
```

## What NOT to Do

❌ **Never throw exceptions** - Use Result pattern
❌ **Never use console.log** - Use logger utility
❌ **Never ignore errors** - Always log and handle
❌ **Never use any types** - Be explicit
❌ **Never use global state** - Use TanStack Query
❌ **Never hardcode values** - Use constants or env vars
❌ **Never create CSS files** - Use Tailwind
❌ **Never skip dependency arrays** - Causes bugs
❌ **Never mock library internals** - Only mock your code
❌ **Never inline complex logic** - Extract to hooks

## File Naming

```
✅ Components (PascalCase)
  UserCard.tsx
  UserForm.tsx
  index.ts

✅ Hooks (camelCase with use prefix)
  useUser.ts
  useUsers.ts

✅ Utilities (camelCase)
  validators.ts
  formatters.ts

✅ Types (interfaces.ts or types.ts)
  types.ts

✅ API (api.ts)
  api.ts
```

## Running Quality Checks

Before asking to commit/push code:
```bash
npm run type-check    # Check TypeScript
npm run lint          # Check linting (fails on warnings)
npm run format        # Format code
npm run test          # Run tests
```

## When to Ask Questions

Ask clarifications for:
- Business logic decisions
- API endpoint designs
- Validation requirements
- Component prop interfaces
- Error handling strategies

But DO NOT ask about:
- File structure (use features/*)
- Error handling (always use Result)
- Logging (always use logger)
- Typing (always type everything)
- Styling (always use Tailwind)

## Resources

- **README.md** - Complete documentation
- **ARCHITECTURE.md** - Design patterns explained
- **BEST_PRACTICES.md** - Do's and don'ts
- **QUICK_START.md** - Feature creation guide

## Optional: Grafana Faro

Grafana Faro is optional for monitoring:

```bash
# Only install if you have Faro configured
npm install @grafana/faro-react @grafana/faro-core @grafana/faro-web-tracing

# Then set in .env.local
VITE_FARO_URL=https://faro-collector.example.com/collect
```

Without Faro configured, logging still works locally via console.

---

**Last Updated:** 2025-03-11
**Template Version:** 1.0.1
