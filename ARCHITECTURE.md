# Architecture Guide

This document explains the architectural principles and patterns used in this React template.

## Core Principles

### 1. Feature-First Architecture

The application is organized by **business features and domains**, not by technical layers. Each feature is a self-contained module with all its necessary code in one place:

```
src/
├── features/
│   ├── users/          # User management domain
│   │   ├── types.ts
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── components/
│   │   └── index.ts
│   ├── posts/          # Post management domain
│   ├── auth/           # Authentication domain
│   └── monitoring/     # Monitoring domain
├── lib/                # Shared infrastructure
├── components/         # Shared UI components
└── shared/             # Constants, types
```

### 2. Layering Within Features (Horizontal Layers)

Within each feature, code is organized in **horizontal layers** (types → API → hooks → components):

```
features/users/
├── types.ts           # Domain types & interfaces
├── api.ts             # API calls (returns Result<T>)
├── hooks.ts           # React hooks & queries
├── components/        # Feature UI components
│   ├── UserCard.tsx
│   ├── UserForm.tsx
│   └── index.ts
├── UsersPage.tsx      # Feature page
└── index.ts           # Public API exports
```

**Benefits:**
- **Localized code** - All user feature code in one place
- **Independent development** - Features don't depend on each other
- **Easy to refactor** - Move/remove entire features without breaking others
- **Scales with teams** - Teams can own entire features
- **Clear dependencies** - Features can't accidentally depend on internal implementation

### 3. Result/ErrorOr Pattern

Instead of throwing exceptions, functions return `Result<T>`:

```typescript
// Old way (exception-based)
try {
  const user = await getUser(id);
  console.log(user);
} catch (error) {
  console.error(error);
}

// New way (Result-based)
const result = await getUser(id);
if (result.isSuccess) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

**Benefits:**
- Explicit error handling
- No hidden exceptions
- Composable with `map` and `flatMap`
- Type-safe error flows

### 4. Dependency Injection via Hooks

React hooks serve as dependency injection containers:

```typescript
// Service layer provides hooks
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.get(`/users/${id}`),
  });
}

// Components inject the hook
export function UserProfile({ userId }: Props) {
  const { data: user } = useUser(userId);
  return <div>{user.name}</div>;
}
```

## Layer Details

### UI Components Layer (`src/components/`, `src/features/*/components/`)

**Responsibilities:**
- Rendering JSX
- Handling user interactions
- Managing local component state
- Displaying data from hooks

**Rules:**
- Components should be "dumb" - they just render
- Minimal business logic
- No direct API calls (use hooks instead)
- Props should be typed with interfaces
- Use TypeScript generics for reusable components

**Example:**

```typescript
interface UserCardProps {
  user: User;
  onDelete?: (userId: string) => void;
}

export function UserCard({ user, onDelete }: UserCardProps): React.ReactElement {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <button onClick={() => onDelete?.(user.id)}>Delete</button>
    </div>
  );
}
```

### Business Logic Layer (`src/features/*/hooks.ts`, `src/lib/hooks/`)

**Responsibilities:**
- Fetching and caching data (TanStack Query)
- Managing mutations
- Validation
- Business logic orchestration

**Rules:**
- Hooks should not render anything
- Hooks should handle loading, error, and success states
- Use TanStack Query for server state
- Use `Result` type for error handling
- Always log errors

**Example:**

```typescript
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const result = await usersApi.getUser(id);
      if (result.isFailure) {
        logger.error('Failed to fetch user', result.error);
        throw result.error;
      }
      return result.value;
    },
  });
}
```

### Infrastructure Layer (`src/lib/api/`, `src/lib/logging/`)

**Responsibilities:**
- HTTP requests (API client)
- Logging and monitoring
- Local storage
- External service integrations

**Rules:**
- No business logic
- Functions should return `Result` type
- All errors should be logged
- Configuration via environment variables

**Example:**

```typescript
export class ApiClient {
  async get<T>(url: string): Promise<Result<T>> {
    return Result.tryAsync(
      this.client.get<T>(url).then((res) => res.data),
    );
  }
}
```

### Core Layer (`src/lib/`, `src/shared/`)

**Responsibilities:**
- Type definitions
- Constants
- Utility functions
- Validation schemas

**Rules:**
- Zero dependencies on other layers
- Pure functions
- Fully testable
- Well-documented

## State Management Strategy

### Server State (TanStack Query)

Use TanStack Query for:
- API responses
- Async data fetching
- Caching
- Background updates

```typescript
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: async () => (await usersApi.list()).getOrThrow(),
});
```

### Client State (React Hooks)

Use React hooks for:
- UI state (open/closed modals, collapsed sections)
- Form state
- Temporary client-only data

```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Never use global state for:
- Server data (use TanStack Query)
- Authentication (use a provider with React Context)

## Error Handling Strategy

### At Boundaries

Validate and transform errors at system boundaries:

```typescript
// API client converts HTTP errors to Result
async get<T>(url: string): Promise<Result<T>> {
  return Result.tryAsync(this.client.get<T>(url).then(r => r.data));
}

// Hook transforms Result to thrown error for Query
async queryFn() {
  const result = await api.get(url);
  return result.getOrThrow(); // Convert to error for Query to handle
}
```

### In Components

Use error boundaries and conditional rendering:

```typescript
function UserProfile() {
  const { data: user, error, isLoading } = useUser(id);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorAlert error={error} />;
  return <UserDetail user={user!} />;
}
```

### Logging

Log at infrastructure boundaries:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('API Error', { url: error.config.url, status: error.response?.status });
    return Promise.reject(error);
  },
);
```

## Data Flow

```
User Action
    ↓
Component Handler
    ↓
Hook/Mutation
    ↓
API Client / Business Logic
    ↓
Server / Storage
    ↓
Response / Result
    ↓
Component State Update
    ↓
UI Render
```

## Testing Strategy

### Unit Tests

Test pure functions and business logic:

```typescript
// Test the Result type
describe('Result', () => {
  it('should map over success', () => {
    expect(Result.ok(5).map(x => x * 2).value).toBe(10);
  });
});
```

### Component Tests

Test user behavior, not implementation:

```typescript
describe('UserCard', () => {
  it('should delete user when delete button is clicked', async () => {
    const { getByRole } = render(<UserCard user={mockUser} />);
    await userEvent.click(getByRole('button', { name: /delete/i }));
    expect(mockDeleteFn).toHaveBeenCalledWith(mockUser.id);
  });
});
```

### Integration Tests

Test multiple components together:

```typescript
describe('User Management', () => {
  it('should create and display new user', async () => {
    const { getByRole, getByText } = render(<UserManagement />);
    await userEvent.type(getByRole('textbox', { name: /name/i }), 'John');
    await userEvent.click(getByRole('button', { name: /create/i }));
    expect(getByText('John')).toBeInTheDocument();
  });
});
```

## Performance Considerations

### Code Splitting

Lazy load heavy features:

```typescript
const UsersPage = lazy(() => import('@/features/users/UsersPage'));
```

### Memoization

Use selectively only when needed:

```typescript
const UserCard = memo(({ user }: Props) => (
  <div>{user.name}</div>
));
```

### TanStack Query Caching

Properly configure cache times:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
    },
  },
});
```

## Development Workflow

1. **Identify the feature** - What are you building?
2. **Create types** - Define TypeScript interfaces in `types.ts`
3. **Create API layer** - Add API calls in `api.ts`
4. **Create hooks** - Add business logic in `hooks.ts`
5. **Create components** - Build UI in `components/`
6. **Add tests** - Write tests for each layer
7. **Update routes** - Add routing in `App.tsx`

## Common Patterns

### Loading States

```typescript
function UserProfile() {
  const { data, isLoading, isError } = useUser(id);

  return (
    <div>
      {isLoading && <Spinner />}
      {isError && <ErrorAlert />}
      {data && <UserDetail user={data} />}
    </div>
  );
}
```

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: (newData) => {
    queryClient.setQueryData(['user', id], newData);
  },
  onError: (error, variables, context) => {
    queryClient.setQueryData(['user', id], context?.previous);
  },
});
```

### Dependent Queries

```typescript
const { data: userId } = useCurrentUser();

const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => getUser(userId!),
  enabled: !!userId, // Only run when userId exists
});
```

## References

- [Feature-First Architecture](https://www.xmind.net/blog/feature-first-architecture-the-ultimate-guide/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/posts/recipe-part2/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Patterns](https://react.dev)
