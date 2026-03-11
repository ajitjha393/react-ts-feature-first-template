# React App Template

A comprehensive, production-ready React template with best practices, proper architecture, logging, and error handling.

## Features

- **Feature-First Architecture**: Domain-driven organization with self-contained feature modules
- **Type Safety**: Full TypeScript with strict compiler options
- **Error Handling**: ErrorOr/Result pattern for railway-oriented programming
- **Logging**: Grafana Faro integration for monitoring and error tracking
- **Code Quality**: ESLint (strict rules) + Prettier for consistent code style
- **State Management**: TanStack Query for server state + hooks for client state
- **UI Framework**: Tailwind CSS with custom component library
- **Testing**: Vitest with React Testing Library
- **API Client**: Axios with interceptors and Result pattern
- **Validation**: Zod for schema validation

## Project Structure

```
src/
├── components/          # Shared, reusable components
│   ├── ErrorBoundary.tsx
│   └── Layout.tsx
├── features/           # Feature modules (feature-based structure)
│   └── home/
│       └── HomePage.tsx
├── lib/                # Utilities, hooks, core functionality
│   ├── api/
│   │   └── client.ts
│   ├── hooks/
│   │   └── useAsync.ts
│   ├── logging/
│   │   ├── faro.ts     # Grafana Faro setup
│   │   └── logger.ts   # Logging utilities
│   ├── validation/
│   │   └── index.ts    # Zod validation
│   ├── query-client.ts # TanStack Query configuration
│   └── result.ts       # Result/ErrorOr pattern
├── shared/             # Constants, types, enums (optional)
├── test/               # Test configuration
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Setup & Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables** - Create `.env.local`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_FARO_URL=https://faro-collector.example.com/collect
   VITE_APP_NAME=my-app
   VITE_APP_VERSION=0.1.0
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check code with ESLint (fails on warnings)
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted
- `npm run type-check` - Run TypeScript type checker
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report

## Architecture Patterns

### Result/ErrorOr Pattern

Instead of throwing exceptions, use the `Result` type for predictable error handling:

```typescript
import { Result } from '@/lib/result';

// Creating results
const success = Result.ok(data);
const failure = Result.fail<Data>(new Error('Failed to fetch'));

// Checking results
if (result.isSuccess) {
  console.log(result.value);
} else {
  console.error(result.error);
}

// Chaining operations
const transformed = Result.ok(5)
  .map((x) => x * 2)
  .flatMap((x) => fetchData(x));
```

### Feature-Based Structure

Organize code by features, not by technical layers:

```
features/
├── users/
│   ├── components/
│   │   ├── UserCard.tsx
│   │   └── UserForm.tsx
│   ├── hooks/
│   │   ├── useUser.ts
│   │   └── useUsers.ts
│   ├── api/
│   │   └── userApi.ts
│   ├── types.ts
│   └── index.ts
└── posts/
    ├── components/
    ├── hooks/
    ├── api/
    └── ...
```

### API Client Usage

```typescript
import { apiClient } from '@/lib/api/client';

// GET request
const result = await apiClient.get<User>('/users/1');
if (result.isSuccess) {
  console.log(result.value);
} else {
  console.error(result.error);
}

// POST request
const postResult = await apiClient.post<User>('/users', {
  name: 'John',
  email: 'john@example.com',
});
```

### TanStack Query Integration

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: async () => {
    const result = await apiClient.get<User>(`/users/${userId}`);
    return result.getOrThrow();
  },
});

// Mutation
const mutation = useMutation({
  mutationFn: (user: User) => apiClient.post('/users', user),
});
```

### Validation with Zod

```typescript
import { z } from '@/lib/validation';
import { validateInput } from '@/lib/validation';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().positive().optional(),
});

const result = validateInput<User>(userSchema, data);
if (result.isSuccess) {
  // Use validated data
  processUser(result.value);
}
```

### Logging

```typescript
import { logger } from '@/lib/logging/logger';

// Simple logging
logger.info('User logged in', { userId: 123 });
logger.warn('Low memory', { available: '500MB' });

// Error logging
logger.error('Request failed', error);

// Exception tracking (automatically sent to Grafana Faro)
logger.exception(new Error('Critical failure'), { context: 'operation' });
```

## Linting & Code Quality

### ESLint Rules

The template enforces strict ESLint rules:
- All TypeScript strict checks enabled
- No implicit `any` types
- No unused variables or parameters
- Proper async/await patterns
- React hooks rules
- Code must pass before commit

### Prettier Configuration

- 2-space indentation
- Single quotes
- Trailing commas
- 100 character line width
- Semicolons

### Pre-commit Hooks (Recommended)

Add `husky` and `lint-staged` for automatic linting:

```bash
npm install -D husky lint-staged
npx husky install
```

`.husky/pre-commit`:
```bash
npx lint-staged
```

`.lintstagedrc.json`:
```json
{
  "*.{ts,tsx}": "eslint --fix",
  "*.{ts,tsx,json,css}": "prettier --write"
}
```

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/myFunction';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction(5);
    expect(result).toBe(10);
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render button and handle click', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('@/features/heavy/HeavyComponent'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Image Optimization

Use Tailwind's responsive classes:

```tsx
<img
  src="image.jpg"
  alt="Description"
  className="h-auto w-full object-cover"
  loading="lazy"
/>
```

### Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer
```

Then add to `vite.config.ts`:

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
    }),
  ],
};
```

## Deployment

### Build

```bash
npm run build
```

Output goes to `dist/` directory.

### Environment Variables

Create separate `.env` files for each environment:
- `.env.development` - Development
- `.env.staging` - Staging
- `.env.production` - Production

## Best Practices

1. **Type everything** - Use TypeScript types for all function parameters and returns
2. **No console.log** - Use `logger` utility instead for production-ready logging
3. **Handle all errors** - Never ignore promise rejections; use Result pattern
4. **Validate inputs** - Use Zod at system boundaries (user input, API responses)
5. **Test behavior** - Focus on user behavior, not implementation details
6. **Keep components small** - Each component should have single responsibility
7. **Use hooks properly** - Follow rules of hooks; dependency arrays matter
8. **Avoid prop drilling** - Use context or state management for shared state
9. **Memoize selectively** - Use `memo`, `useMemo`, `useCallback` only when needed
10. **Clean up side effects** - Always return cleanup functions from `useEffect`

## Troubleshooting

### ESLint errors

```bash
npm run lint:fix  # Auto-fix most issues
```

### Build errors

```bash
npm run type-check  # Check for TypeScript errors
```

### Test failures

```bash
npm run test:ui  # Run tests with interactive UI
```

## Contributing

1. All code must pass linting (`npm run lint`)
2. All code must be formatted with Prettier
3. Add tests for new features
4. Update README for API changes

## License

MIT
