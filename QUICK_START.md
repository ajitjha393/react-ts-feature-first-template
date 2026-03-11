# Quick Start Guide

Get up and running with this React template in 5 minutes.

## 1. Installation

```bash
# Navigate to project
cd react-template

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your values
```

## 2. Development Server

```bash
npm run dev
```

Opens http://localhost:3000 with hot reload enabled.

## 3. Create Your First Feature

### Step 1: Define Types

Create `src/features/posts/types.ts`:

```typescript
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}
```

### Step 2: Create API Layer

Create `src/features/posts/api.ts`:

```typescript
import { apiClient } from '@/lib/api/client';
import { Post, CreatePostRequest } from './types';
import { Result } from '@/lib/result';

export const postsApi = {
  async list(): Promise<Result<Post[]>> {
    return apiClient.get<Post[]>('/posts');
  },

  async create(data: CreatePostRequest): Promise<Result<Post>> {
    return apiClient.post<Post>('/posts', data);
  },
};
```

### Step 3: Create Hooks

Create `src/features/posts/hooks.ts`:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { postsApi } from './api';
import { Post, CreatePostRequest } from './types';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const result = await postsApi.list();
      return result.getOrThrow();
    },
  });
}

export function useCreatePost() {
  return useMutation({
    mutationFn: (data: CreatePostRequest) =>
      postsApi.create(data).then(r => r.getOrThrow()),
  });
}
```

### Step 4: Create Components

Create `src/features/posts/components/PostCard.tsx`:

```typescript
import React from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps): React.ReactElement {
  return (
    <div className="card">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="mt-2 text-gray-600">{post.content}</p>
      <p className="mt-4 text-xs text-gray-500">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
```

### Step 5: Create Page Component

Create `src/features/posts/PostsPage.tsx`:

```typescript
import React from 'react';
import { usePosts } from './hooks';
import { PostCard } from './components/PostCard';

export default function PostsPage(): React.ReactElement {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Posts</h1>
      <div className="space-y-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

### Step 6: Add Route

Edit `src/App.tsx`:

```typescript
import PostsPage from '@/features/posts/PostsPage';

<Routes>
  <Route element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="posts" element={<PostsPage />} />  {/* Add this */}
  </Route>
</Routes>
```

## 4. Code Quality

Check your code before committing:

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Test
npm run test
```

Or run all checks:

```bash
npm run type-check && npm run lint && npm run test
```

## 5. Project Structure Overview

```
src/
├── components/          # Shared components (Layout, ErrorBoundary, etc)
├── features/            # Feature modules
│   ├── home/           # Home feature
│   ├── posts/          # Posts feature (your new feature)
│   └── users/          # User feature example
├── lib/                # Core utilities
│   ├── api/           # API client
│   ├── hooks/         # Reusable hooks
│   ├── logging/       # Logging & monitoring
│   ├── validation/    # Zod schemas
│   ├── query-client.ts
│   └── result.ts      # ErrorOr pattern
├── shared/            # Shared constants, types (optional)
├── test/              # Test configuration
├── App.tsx            # Main app
└── main.tsx           # Entry point
```

## 6. Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Code Quality
npm run lint               # Check code
npm run lint:fix           # Fix linting issues
npm run format             # Format code
npm run type-check         # Check TypeScript

# Testing
npm run test               # Run tests
npm run test:ui            # Interactive test UI
npm run test:coverage      # Coverage report
```

## 7. Adding Dependencies

When you need to add a new package:

```bash
npm install package-name

# Then run linting to ensure types are installed
npm run type-check
```

**Approved packages:**
- UI: `shadcn/ui`, `headless-ui`, `radix-ui`
- Forms: `react-hook-form`, `zod`
- Utils: `lodash-es`, `date-fns`, `clsx`
- HTTP: `axios` (already included)
- State: `zustand` for client state
- **Avoid:** Redux (use TanStack Query), MobX, Relay

## 8. Environment Variables

Available variables in `src/`:

```typescript
import.meta.env.VITE_API_URL      // API base URL
import.meta.env.VITE_FARO_URL     // Logging URL
import.meta.env.VITE_APP_NAME     // App name
import.meta.env.VITE_APP_VERSION  // App version
import.meta.env.MODE              // 'development' or 'production'
import.meta.env.PROD              // true if production
```

## 9. Debugging

### Browser DevTools

- React DevTools extension
- TanStack Query DevTools

### Logging

Use `logger` for debugging:

```typescript
import { logger } from '@/lib/logging/logger';

logger.debug('Debug info', { value: 123 });
logger.info('Information', { event: 'login' });
logger.warn('Warning', { issue: 'low memory' });
logger.error('Error', error);
logger.exception(error, { context: 'operation' });
```

### Type Checking

Get real-time type errors:

```bash
npm run type-check
```

## 10. Next Steps

- [ ] Read [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
- [ ] Read [BEST_PRACTICES.md](./BEST_PRACTICES.md) for guidelines
- [ ] Create your first feature (posts, users, etc)
- [ ] Set up API endpoints
- [ ] Add authentication
- [ ] Deploy to production

## Common Issues

### Port 3000 Already in Use

```bash
# Use different port
npm run dev -- --port 3001
```

### ESLint Errors on Startup

```bash
npm run lint:fix
npm run type-check
```

### Tests Failing

Check the error message:

```bash
npm run test -- --reporter=verbose
```

### Type Errors

Run type checker:

```bash
npm run type-check
```

## Getting Help

- Check [README.md](./README.md) for complete documentation
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for pattern explanations
- Review examples in `src/features/` directory
- Check `src/lib/` for available utilities

## Tips

1. **Hot Reload** - Changes save automatically, just refresh browser
2. **Type Safety** - TypeScript catches errors before runtime
3. **Linting** - ESLint prevents common mistakes
4. **Testing** - Write tests as you code
5. **Logging** - Always log errors for debugging

Happy coding! 🚀
