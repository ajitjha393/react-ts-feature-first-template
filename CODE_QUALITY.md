# Code Quality & AI Safety Measures

This project implements multiple layers of code quality checks to prevent bad code from being generated or shipped by AI systems. All checks run automatically before commits.

## Overview of Safeguards

### 🛡️ Layer 1: Type Safety (ESLint + TypeScript)
**Before any commit is allowed, all code must pass:**

- ✅ **TypeScript strict mode** - No `any` types allowed
- ✅ **ESLint rules** enforcing:
  - Explicit function return types
  - No floating promises
  - Optional chaining where appropriate
  - Nullish coalescing
  - No console logs (warning-level)
  - React hooks dependencies
  - No implicit type any
  - Unsafe conditions

**Run manually:**
```bash
pnpm type-check    # TypeScript errors
pnpm lint          # ESLint violations
```

### 🎨 Layer 2: Code Style (Prettier + ESLint)
**Formatting and style checks:**

- ✅ **Prettier** - Enforces consistent formatting
- ✅ **ESLint prettier plugin** - Treats formatting violations as errors

**Auto-fix code style:**
```bash
pnpm lint:fix      # Fix ESLint violations
pnpm format        # Format with Prettier
```

### 🪝 Layer 3: Pre-Commit Hooks (Husky + Lint-Staged)
**Automatically run before each git commit:**

```
git add src/features/users/UserCard.tsx
git commit -m "feat: add user card component"
        ↓
.husky/pre-commit executes:
  ├─ eslint --fix --max-warnings=0 (staged files only)
  └─ prettier --write (staged files only)
        ↓
If checks fail → Commit is BLOCKED ❌
If checks pass → Commit is ALLOWED ✅
```

**Configuration:** `lint-staged` in `package.json`

---

## 📋 Layer 4: Conventional Commits (Commitizen)

**All commits must follow a standard format:**

```
type(scope): subject

body (optional)

footer (optional)
```

### Valid commit types:
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting (no logic change)
- `refactor:` - Code restructuring
- `perf:` - Performance improvements
- `test:` - Test additions/changes
- `chore:` - Build/dependency updates
- `ci:` - CI/CD configuration changes

### Examples:

✅ **Good commits:**
```
feat(auth): add login form validation
fix(api): handle 401 responses correctly
refactor(hooks): extract useUser logic
docs: update README with setup instructions
test(components): add UserCard unit tests
```

❌ **Bad commits (rejected):**
```
Update stuff
Added feature
Fixed bug
WIP
Made changes
```

### How to use Commitizen:

```bash
# Option 1: Interactive CLI (recommended)
pnpm commit

# Option 2: Manual - write message in editor
git commit -m "feat(scope): description"
# Will validate format automatically

# Option 3: Git CLI (requires manual format)
git commit -m "feat(scope): description"
```

**Configuration:** `commitlint.config.js`

---

## 🚫 Layer 5: AI-Generated Commit Size Limit (300KB)

**To prevent massive code dumps by AI systems:**

```
Commit message size checked in .husky/commit-msg

Maximum allowed: 300KB (~300 lines of code)
```

### Why this limit?

- ✅ Enforces small, focused commits
- ✅ Prevents single mega-commits from AI
- ✅ Makes code review easier
- ✅ Easier to revert problematic changes
- ✅ Better git history and blame tracking

### When you hit the limit:

```
❌ COMMIT REJECTED: Commit message with diff is too large
   (450KB > 300KB)

🤖 AI commits must be under 300KB (approx 300 lines)

💡 Tips to fix:
   - Break changes into multiple smaller commits
   - Use 'git add <file>' to stage specific files
   - Avoid committing auto-generated files
```

### How to fix:

```bash
# Stage files individually
git add src/features/users/types.ts
git commit -m "feat(users): add user types"

git add src/features/users/api.ts
git commit -m "feat(users): add user API calls"

git add src/features/users/hooks.ts
git commit -m "feat(users): add useUser hook"

# Instead of: git add . && git commit
```

---

## 📊 Layer 6: CLAUDE.md Project Instructions

**Strict rules for AI-generated code:**

The `CLAUDE.md` file specifies:
- ✅ Always use Result pattern for error handling (no exceptions)
- ✅ Feature-based folder structure
- ✅ Explicit types everywhere (no `any`)
- ✅ TanStack Query for data fetching
- ✅ Logger utility for all logging
- ✅ Zod validation at boundaries
- ✅ Tailwind for styling
- ✅ Conventional error handling

If AI violates CLAUDE.md, the linting will catch it.

---

## ⚙️ Full Quality Check Flow

```
User wants to commit:
    ↓
git commit -m "feat: new feature"
    ↓
.husky/pre-commit
├─ Run eslint on staged files ──→ Fails? BLOCKED ❌
├─ Run prettier on staged files ──→ Fails? BLOCKED ❌
    ↓
.husky/commit-msg
├─ Validate commit format ──→ Fails? BLOCKED ❌
├─ Check commit size < 300KB ──→ Fails? BLOCKED ❌
    ↓
All checks pass ✅
    ↓
Commit is created
    ↓
Code is safe!
```

---

## 🧪 Testing Code Quality

Before making commits, manually run all checks:

```bash
# Type safety
pnpm type-check

# Linting
pnpm lint

# Format check
pnpm format:check

# Tests
pnpm test

# If anything fails, auto-fix:
pnpm lint:fix
pnpm format
```

---

## 📝 Scripts Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm test` | Run test suite |
| `pnpm lint` | Check code quality (ESLint) |
| `pnpm lint:fix` | Auto-fix linting issues |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check if formatting is correct |
| `pnpm type-check` | Check TypeScript types |
| `pnpm commit` | Commitizen interactive commit |

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.eslintrc.cjs` | ESLint rules (strict TypeScript) |
| `.prettierrc.json` | Prettier formatting rules |
| `commitlint.config.js` | Conventional commit validation |
| `.husky/pre-commit` | Pre-commit hook (lint + format) |
| `.husky/commit-msg` | Commit message hook (format + size) |
| `package.json` | lint-staged config + scripts |
| `CLAUDE.md` | AI-specific code standards |

---

## 🚀 Workflow for AI-Generated Code

When Claude (or other AI) generates code:

1. **AI writes code** → Follows CLAUDE.md guidelines
2. **User stages files** → `git add src/features/...`
3. **User commits** → `git commit -m "feat: ..."`
4. **Pre-commit hooks run** → Auto-fix formatting, check types
5. **Commit-msg hook validates** → Format + size check
6. **Commit succeeds** ✅ or fails ❌ with clear feedback
7. **If fails** → AI can see the error and fix it

---

## ⚡ Quick Start

```bash
# Install dependencies
pnpm install

# All hooks are ready to use!

# Try making a commit
git add .
git commit -m "feat: test commit"  # Will fail - bad format
git commit -m "feat(test): try this format"  # Better!
pnpm commit  # Use interactive mode (recommended)
```

---

## 📚 Further Reading

- **CLAUDE.md** - Complete code standards for AI
- **ARCHITECTURE.md** - System design and patterns
- **BEST_PRACTICES.md** - Additional guidelines
- **QUICK_START.md** - Feature creation guide

---

**Last Updated:** 2026-03-11
**Git Hooks Status:** ✅ Active
**Commit Validation:** ✅ Enabled
**Size Limit:** 300KB
