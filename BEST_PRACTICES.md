# Best Practices Guide

Guidelines for maintaining high code quality in this React template.

## Code Style

### TypeScript

**✅ DO:**
```typescript
// Explicit types everywhere
function getUserById(id: string): Promise<Result<User>> {
  return apiClient.get<User>(`/users/${id}`);
}

// Clear return types
const userName: string = user.name;

// Proper error handling
if (result.isFailure) {
  logger.error('Operation failed', result.error);
}
```

**❌ DON'T:**
```typescript
// Implicit any
function getUser(id) { }

// No return type
const getName = () => user.name;

// Ignore errors
try {
  await api.call();
} catch (e) {
  // Silently fail
}
```

### Component Naming

**✅ DO:**
```typescript
// Descriptive names
function UserProfileCard() { }
function EditUserModal() { }
function useCurrentUser() { }

// Index for file structure clarity
// features/users/components/index.ts
export { UserCard } from './UserCard';
export { UserForm } from './UserForm';
```

**❌ DON'T:**
```typescript
// Generic/unclear names
function Card() { }
function Modal() { }
function useData() { }
```

## React Patterns

### Hooks Usage

**✅ DO:**
```typescript
// Proper dependency array
useEffect(() => {
  const unsubscribe = subscribe();
  return () => unsubscribe();
}, [dependency]);

// Conditional hooks based on conditions outside
const data = useUser(userId); // userId always available
```

**❌ DON'T:**
```typescript
// Empty or wrong dependency array
useEffect(() => {
  setInterval(() => refetch(), 1000);
}, []); // Runs once, creates infinite interval

// Conditional hooks
if (condition) {
  const data = useUser(id); // ❌ Breaks rules of hooks
}
```

### Component Props

**✅ DO:**
```typescript
interface UserCardProps {
  user: User;
  onUpdate?: (user: User) => Promise<void>;
  isLoading?: boolean;
}

export function UserCard({ user, onUpdate, isLoading }: UserCardProps) {
  // Use typed props
}
```

**❌ DON'T:**
```typescript
export function UserCard(props: any) {
  // No type safety
}

export function UserCard({ user, ...rest }: UserCardProps) {
  // Rest props can hide requirements
}
```

### State Management

**✅ DO:**
```typescript
// Use TanStack Query for server state
const { data: user } = useUser(id);

// Use useState for UI state
const [isOpen, setIsOpen] = useState(false);

// Use Context only for auth/theme
const { user } = useAuth();
```

**❌ DON'T:**
```typescript
// Global state for API data
const [users, setUsers] = useState([]);
useEffect(() => {
  api.getUsers().then(setUsers);
}, []);

// Local state for everything
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
// ❌ Use a form library instead
```

## Error Handling

### API Errors

**✅ DO:**
```typescript
const result = await apiClient.get<User>('/users/1');

if (result.isSuccess) {
  processUser(result.value);
} else {
  logger.error('Failed to fetch user', result.error);
  showErrorNotification(result.error.message);
}
```

**❌ DON'T:**
```typescript
// Unhandled promise rejection
await apiClient.get('/users/1');

// Generic error handling
catch (error: any) {
  console.log(error); // ❌ Not typed
}

// Silent failures
const result = await api.call();
// ❌ No error handling
```

### Component Error Boundaries

**✅ DO:**
```typescript
<ErrorBoundary>
  <UserSection />
  <PostSection />
</ErrorBoundary>

// Component level error handling
function UserProfile() {
  const { data, error } = useUser(id);
  if (error) return <ErrorAlert error={error} />;
  return <div>{data.name}</div>;
}
```

**❌ DON'T:**
```typescript
// No error boundaries at all

// Throwing in render
function Component() {
  if (!data) throw new Error('No data'); // ❌ Will crash
}
```

## Performance

### Avoid Unnecessary Re-renders

**✅ DO:**
```typescript
// Stable callback with useCallback when passed as dependency
const handleClick = useCallback(() => {
  onSelect(user.id);
}, [user.id, onSelect]);

// Memoize only heavy components
const UserCard = memo(({ user }: Props) => (
  <div>{renderExpensiveData(user)}</div>
));
```

**❌ DON'T:**
```typescript
// Inline callbacks in render
<button onClick={() => onSelect(user.id)}>
  // Re-creates function on every render

// Memoize everything
const Component = memo(({ data }: Props) => <div>{data}</div>);
// ❌ Premature optimization
```

### Bundle Size

**✅ DO:**
```typescript
// Lazy load routes
const UserPage = lazy(() => import('@/features/users/UserPage'));

// Tree-shake unused exports
export { userApi } from './api';
export { useUser } from './hooks';
```

**❌ DON'T:**
```typescript
// Import everything
import * as _ from 'lodash';

// Default exports for barrel files
export default { userApi, useUser };
```

## Testing

### Test User Behavior

**✅ DO:**
```typescript
describe('UserCard', () => {
  it('should show delete confirmation when delete clicked', async () => {
    const { getByRole } = render(<UserCard user={user} />);
    const deleteBtn = getByRole('button', { name: /delete/i });

    await userEvent.click(deleteBtn);

    expect(getByText(/are you sure/i)).toBeInTheDocument();
  });
});
```

**❌ DON'T:**
```typescript
describe('UserCard', () => {
  it('should render', () => {
    const { container } = render(<UserCard user={user} />);
    expect(container.querySelector('.user-card')).toBeInTheDocument();
    // ❌ Tests implementation, not behavior
  });
});
```

### Mock External Dependencies

**✅ DO:**
```typescript
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(() => Result.ok(mockData)),
  },
}));
```

**❌ DON'T:**
```typescript
// Make real API calls in tests
const result = await apiClient.get('/users');

// Mock too deeply
vi.mock('react-router-dom', () => ({
  // ❌ Mocking library internals
}));
```

## Logging

### Always Log at Boundaries

**✅ DO:**
```typescript
// Log API requests/responses
apiClient.interceptors.response.use(
  (response) => {
    logger.info('API Success', { url: response.config.url });
    return response;
  },
);

// Log errors in hooks
const mutation = useMutation({
  mutationFn: updateUser,
  onError: (error) => {
    logger.error('Update failed', error);
  },
});

// Log in components on mount/unmount
useEffect(() => {
  logger.info('UserProfile mounted');
  return () => logger.info('UserProfile unmounted');
}, []);
```

**❌ DON'T:**
```typescript
// Forget to log errors
try {
  await api.call();
} catch (e) {
  // Silently fail
}

// Excessive logging
logger.debug('Render called');
logger.debug('State updated');
// ❌ Noise in logs
```

## File Organization

### Feature Structure

**✅ DO:**
```
features/users/
├── types.ts           # User domain types
├── api.ts             # API calls
├── hooks.ts           # React hooks
├── components/
│   ├── UserCard.tsx
│   └── UserForm.tsx
├── __tests__/
│   ├── hooks.test.ts
│   └── components.test.tsx
└── index.ts           # Public exports
```

**❌ DON'T:**
```
features/users/
├── User.tsx
├── user.ts
├── userHook.ts
├── userApi.ts
├── UserCard.tsx
# ❌ No clear organization
```

### Public API

**✅ DO:**
```typescript
// features/users/index.ts
export type { User, CreateUserRequest } from './types';
export { usersApi } from './api';
export { useUser, useUsers } from './hooks';
export { UserCard, UserForm } from './components';
```

**❌ DON'T:**
```typescript
// Import from deep paths
import { useUser } from '@/features/users/hooks';
import { User } from '@/features/users/types';

// Instead of
import { useUser, User } from '@/features/users';
```

## Documentation

### Code Comments

**✅ DO:**
```typescript
/**
 * Fetches a user by ID with caching
 * @param id - User ID
 * @returns Cached user data with auto-refresh every 5 minutes
 */
export function useUser(id: string) {
  // ...
}

// Complex algorithm explanation
// We use exponential backoff to avoid overwhelming the server
const calculateDelay = (attempt: number) => 100 * Math.pow(2, attempt);
```

**❌ DON'T:**
```typescript
// Obvious comments
const name = 'John'; // Set name to John
user.id = id; // Set the id

// Outdated comments
// This is a hack for IE8
// (We don't support IE8 anymore)
```

### README Updates

**✅ DO:**
```markdown
# When you add a feature
Update README.md with:
- Feature description
- Usage example
- Link to relevant code

# When you change architecture
Update ARCHITECTURE.md to reflect the change
```

**❌ DON'T:**
```
Leave documentation outdated
Expect people to find patterns in the code
```

## Common Mistakes to Avoid

1. **Forgetting `await`** - Promises that don't execute
   ```typescript
   // ❌ Wrong
   apiClient.get('/users');

   // ✅ Right
   await apiClient.get('/users');
   ```

2. **Wrong dependency arrays** - Causes infinite loops or stale data
   ```typescript
   // ❌ Wrong
   useEffect(() => fetchData(dependency), []);

   // ✅ Right
   useEffect(() => fetchData(dependency), [dependency]);
   ```

3. **No error handling** - Crashes go unnoticed
   ```typescript
   // ❌ Wrong
   const data = await api.call();
   setData(data);

   // ✅ Right
   const result = await api.call();
   if (result.isSuccess) setData(result.value);
   ```

4. **Silent failures** - Bugs are hard to find
   ```typescript
   // ❌ Wrong
   try { await api.call(); } catch (e) {}

   // ✅ Right
   try {
     await api.call();
   } catch (e) {
     logger.error('Failed', e);
     showNotification('Operation failed');
   }
   ```

5. **No types** - Type safety is the main benefit of TypeScript
   ```typescript
   // ❌ Wrong
   function process(data: any) {
     return data.name.toUpperCase(); // Crashes if name missing
   }

   // ✅ Right
   function process(data: User) {
     return data.name.toUpperCase();
   }
   ```

## Code Review Checklist

Before submitting code:

- [ ] All TypeScript types are correct (`npm run type-check`)
- [ ] Code passes linting (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Tests pass (`npm run test`)
- [ ] No `console.log` (use `logger`)
- [ ] No unhandled promise rejections
- [ ] Error messages are user-friendly
- [ ] API calls return `Result<T>`
- [ ] Components are properly typed
- [ ] Dependencies are correct in hooks
- [ ] No hardcoded values (use constants)
- [ ] Documentation is updated if needed

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Refactoring](https://refactoring.guru)
