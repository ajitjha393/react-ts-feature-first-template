# Complete Project Structure

## Folder Layout

```
react-template/
├── 📁 src/
│   ├── 📁 features/
│   │   ├── 📁 home/
│   │   │   ├── HomePage.tsx          ← Welcome page with demo links
│   │   │   ├── index.ts              ← Public exports
│   │   │   └── __tests__/            ← Tests (optional)
│   │   │
│   │   ├── 📁 users/                 ← Complete CRUD example
│   │   │   ├── types.ts              ← User, CreateUserRequest
│   │   │   ├── api.ts                ← API calls (returns Result<T>)
│   │   │   ├── hooks.ts              ← useUser, useUsers, useCreateUser
│   │   │   ├── components/
│   │   │   │   ├── UserCard.tsx      ← Display user card
│   │   │   │   ├── CreateUserForm.tsx ← Form with validation
│   │   │   │   └── index.ts
│   │   │   ├── UsersPage.tsx         ← Feature page
│   │   │   ├── index.ts              ← Public exports
│   │   │   └── __tests__/            ← Tests
│   │   │
│   │   └── 📁 monitoring/            ← Real-time log viewer
│   │       ├── types.ts              ← LogLevel, LogFilter
│   │       ├── MonitoringPage.tsx    ← Log viewer UI
│   │       ├── index.ts
│   │       └── __tests__/
│   │
│   ├── 📁 components/                ← Shared components
│   │   ├── ErrorBoundary.tsx         ← Catches React errors
│   │   ├── Layout.tsx                ← Main layout + navigation
│   │   └── index.ts
│   │
│   ├── 📁 lib/                       ← Core utilities
│   │   ├── 📁 api/
│   │   │   └── client.ts             ← Axios client with Result pattern
│   │   │
│   │   ├── 📁 logging/
│   │   │   ├── faro.ts               ← Grafana Faro setup
│   │   │   ├── logger.ts             ← Logger utility
│   │   │   ├── store.ts              ← In-memory log storage
│   │   │   └── __tests__/
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── useAsync.ts           ← Generic async hook
│   │   │   ├── useLogs.ts            ← Subscribe to logs
│   │   │   └── useAsync.test.ts
│   │   │
│   │   ├── 📁 validation/
│   │   │   └── index.ts              ← Zod schemas + validation
│   │   │
│   │   ├── result.ts                 ← Result/ErrorOr type
│   │   ├── result.test.ts            ← Tests for Result
│   │   ├── query-client.ts           ← TanStack Query setup
│   │   └── __tests__/
│   │
│   ├── 📁 test/
│   │   └── setup.ts                  ← Vitest configuration
│   │
│   ├── App.tsx                       ← Main app component + routes
│   ├── main.tsx                      ← Entry point
│   └── index.css                     ← Tailwind + custom styles
│
├── 📁 public/                        ← Static assets
│
├── 📄 Configuration Files
│   ├── package.json                  ← Dependencies & scripts
│   ├── tsconfig.json                 ← TypeScript config
│   ├── tsconfig.app.json             ← App TypeScript config
│   ├── vite.config.ts                ← Vite configuration
│   ├── vitest.config.ts              ← Testing configuration
│   ├── .eslintrc.cjs                 ← ESLint rules
│   ├── .prettierrc.json              ← Prettier formatting
│   ├── postcss.config.cjs            ← PostCSS config
│   ├── tailwind.config.js            ← Tailwind configuration
│   └── .env.example                  ← Environment template
│
├── 📄 Documentation
│   ├── README.md                     ← Complete reference
│   ├── ARCHITECTURE.md               ← Design patterns
│   ├── BEST_PRACTICES.md             ← Do's and don'ts
│   ├── QUICK_START.md                ← Feature creation guide
│   ├── CLAUDE.md                     ← AI code generation guide
│   ├── IMPLEMENTATION_SUMMARY.md     ← What was built (this file)
│   └── PROJECT_STRUCTURE.md          ← Folder layout (this file)
│
├── 📄 Other Files
│   ├── index.html                    ← HTML entry point
│   ├── .gitignore                    ← Git ignore rules
│   └── vite.svg                      ← Logo
```

---

## Data Flow Architecture

### Request Flow

```
User Action
    ↓
Component (UI)
    ↓
Hook (useQuery/useMutation)
    ↓
API Layer (apiClient.get/post)
    ↓
Result<T> (Success or Failure)
    ↓
Logger (automatic logging)
    ↓
Grafana Faro (if configured)
    ↓
Display in Monitoring Page (/monitoring)
```

---

## Feature Module Structure (Reusable Pattern)

Each feature follows this pattern:

```
features/{featureName}/
├── types.ts              # Domain types & interfaces
│   └── User, CreateUserRequest, UpdateUserRequest
│
├── api.ts                # API layer (returns Result<T>)
│   └── usersApi = { getUser, createUser, updateUser, deleteUser }
│
├── hooks.ts              # React hooks (TanStack Query)
│   └── useUser, useUsers, useCreateUser, useUpdateUser, useDeleteUser
│
├── components/           # Feature components
│   ├── UserCard.tsx      # Dumb component (just displays)
│   ├── CreateUserForm.tsx # Form component (validates & submits)
│   └── index.ts          # Public exports
│
├── {Feature}Page.tsx     # Feature page (orchestration)
│   └── Uses hooks & components
│
├── index.ts              # Public API (what other features can import)
│   └── export { User } from './types'
│   └── export { usersApi } from './api'
│   └── export { useUser } from './hooks'
│   └── export { UserCard } from './components'
│
└── __tests__/            # Tests
    ├── hooks.test.ts
    ├── components.test.tsx
    └── api.test.ts
```

---

## How to Navigate the Code

### To Find Something...

**"I want to add a new field to User"**
1. Edit `src/features/users/types.ts` → add field
2. Update API endpoint (backend)
3. Update form in `src/features/users/components/CreateUserForm.tsx`
4. Update validation schema in same file

**"I want to add logging to a feature"**
1. Import: `import { logger } from '@/lib/logging/logger'`
2. Log: `logger.info('Message', { data })`
3. View on: `/monitoring` page

**"I want to create a new feature"**
1. Create folder: `src/features/posts/`
2. Follow pattern: types.ts → api.ts → hooks.ts → components/
3. Create PostsPage.tsx
4. Add route to `src/App.tsx`
5. Add navigation link to `src/components/Layout.tsx`

**"I want to see what's being logged"**
1. Go to: http://localhost:3000/monitoring
2. View real-time logs
3. Filter by level or search

---

## Layer Responsibilities

### UI Layer (`components/`, `features/*/components/`)
- ✅ Render JSX
- ✅ Handle user interactions
- ✅ Local component state (isOpen, isExpanded)
- ❌ No API calls
- ❌ No business logic

### Business Logic Layer (`hooks/`)
- ✅ Fetch data with TanStack Query
- ✅ Mutations
- ✅ Validation
- ✅ Orchestrate operations
- ❌ No rendering
- ❌ No direct DOM access

### Infrastructure Layer (`lib/api/`, `lib/logging/`)
- ✅ HTTP requests
- ✅ Error logging
- ✅ External service calls
- ❌ No business logic
- ❌ No UI rendering

### Core Layer (`lib/`, `types`)
- ✅ Result/ErrorOr type
- ✅ Type definitions
- ✅ Constants
- ✅ Utilities (validation, formatting)
- ❌ No dependencies on other layers

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app, routes, initialization |
| `src/components/Layout.tsx` | Navigation, header, footer |
| `src/lib/result.ts` | Error handling (Result type) |
| `src/lib/logging/logger.ts` | Logging utility |
| `src/lib/logging/store.ts` | In-memory log storage |
| `src/lib/api/client.ts` | HTTP client with Result |
| `src/lib/validation/index.ts` | Zod validation |
| `src/lib/query-client.ts` | TanStack Query setup |
| `src/features/users/` | Complete example feature |
| `src/features/monitoring/` | Log viewer |
| `.eslintrc.cjs` | Code quality rules |
| `QUICK_START.md` | Feature creation guide |
| `ARCHITECTURE.md` | Design patterns |

---

## Import Paths (Using Aliases)

```typescript
// ✅ Use these
import { logger } from '@/lib/logging/logger';
import { useUser } from '@/features/users';
import { Result } from '@/lib/result';

// ❌ Don't do this
import { logger } from '../../../../lib/logging/logger';
import { useUser } from '../../../features/users/hooks';
```

Aliases defined in `tsconfig.json`:
- `@/` → `src/`
- `@/lib/` → `src/lib/`
- `@/features/` → `src/features/`
- `@/components/` → `src/components/`

---

## Test File Location Pattern

Tests live alongside the code they test:

```
src/
├── lib/
│   ├── result.ts
│   └── result.test.ts        ← Test next to implementation
│
└── features/users/
    ├── hooks.ts
    ├── hooks.test.ts         ← Test next to implementation
    └── components/
        ├── UserCard.tsx
        └── UserCard.test.tsx  ← Test next to implementation
```

---

## Running Commands

```bash
# Development
npm run dev                 # Start server on port 3000

# Quality
npm run type-check        # TypeScript check
npm run lint              # ESLint (fails on warnings!)
npm run lint:fix          # Auto-fix linting issues
npm run format            # Auto-format with Prettier

# Testing
npm run test              # Run tests
npm run test:ui           # Interactive test UI
npm run test:coverage     # Coverage report

# Production
npm run build             # Build for production
npm run preview           # Preview production build
```

---

## Git Workflow

```bash
# Make changes
git add .

# Check quality before committing
npm run lint
npm run type-check
npm run test

# Commit (follow conventional commits)
git commit -m "feat(users): add delete button"

# Push
git push origin feature-branch
```

---

## Environment Setup

### .env.local (create this)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=my-app
VITE_APP_VERSION=0.1.0

# Optional - only if you have Grafana Faro
VITE_FARO_URL=https://your-faro-url
```

### Available in code via:
```typescript
import.meta.env.VITE_API_URL
import.meta.env.VITE_APP_NAME
import.meta.env.MODE              // 'development' or 'production'
import.meta.env.PROD              // true if production
```

---

## Architecture Checklist

Before creating a feature, ensure:

- [ ] Types defined in `types.ts`
- [ ] API calls return `Result<T>`
- [ ] All errors logged with `logger`
- [ ] Hooks use TanStack Query
- [ ] Components receive props via interfaces
- [ ] All functions have explicit return types
- [ ] No implicit `any` types
- [ ] Form validation with Zod
- [ ] Error handling in mutations
- [ ] Proper cleanup in useEffect
- [ ] Tests included
- [ ] ESLint passes (`npm run lint`)

---

## Related Documentation

- **README.md** - Complete API reference
- **ARCHITECTURE.md** - Design patterns explained
- **BEST_PRACTICES.md** - Do's and don'ts
- **QUICK_START.md** - Step-by-step feature guide
- **CLAUDE.md** - AI code generation instructions
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

**Start building! 🚀**
