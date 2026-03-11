# Complete Setup Guide

This guide shows how to run both the React frontend and TypeScript server together.

## Prerequisites

- **Node.js** v18+ installed
- **pnpm** package manager installed
- **Two terminal windows** (one for server, one for frontend)

---

## Step 1: Clone or Navigate to Project

```bash
cd react-ts-feature-first-template
```

---

## Step 2: Start the Backend Server

**Terminal 1:**

```bash
cd server
pnpm install
pnpm dev
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║  🚀 React Template API Server (TypeScript)             ║
╠════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:5000               ║
║  API endpoint: http://localhost:5000/api                ║
╚════════════════════════════════════════════════════════╝
```

### Server Verification

Test the server with curl:

```bash
# List users
curl http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Health check
curl http://localhost:5000/api/health
```

---

## Step 3: Start the Frontend

**Terminal 2:**

```bash
# From project root
pnpm install
pnpm dev
```

You should see:
```
  VITE v5.0.7  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

---

## Step 4: Test in Browser

1. Open browser: **http://localhost:5173**
2. You should see the welcome page
3. Click **"Users"** in navigation
4. You'll see 3 sample users (Alice, Bob, Carol)

---

## Step 5: Test Create User

1. In the Users page, fill in the form:
   - Name: `John Doe`
   - Email: `john@example.com`
2. Click **"Create User"**
3. New user should appear in the list
4. Check **Monitoring** page to see logs

---

## API Endpoints

### List Users
```bash
GET http://localhost:5000/api/users
```
Response: `{ users: [...], total: 3 }`

### Get Single User
```bash
GET http://localhost:5000/api/users/1
```
Response: `User object`

### Create User
```bash
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```
Response: `201 Created` with new user

### Update User
```bash
PATCH http://localhost:5000/api/users/1
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```
Response: Updated user object

### Delete User
```bash
DELETE http://localhost:5000/api/users/1
```
Response: Deleted user object

---

## Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process on port 5000 (macOS/Linux)
kill -9 <PID>
```

### Frontend says "Network Error"
1. Make sure server is running (`pnpm dev` in server folder)
2. Check `VITE_API_URL` in `.env.local` or default (http://localhost:5000/api)
3. Check browser console for errors (F12)

### Users not appearing
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page and look for `/api/users` request
4. Check if response is `200 OK` with user data
5. Go to Monitoring page to see logs

### Build for production
```bash
# Frontend
pnpm build
pnpm preview

# Server
cd server
pnpm build
pnpm start
```

---

## Project Structure

```
react-ts-feature-first-template/
├── src/                    # React frontend
│   ├── features/          # Feature modules
│   │   ├── users/        # Users feature (CRUD example)
│   │   ├── home/         # Home page
│   │   └── monitoring/   # Real-time logs
│   ├── lib/              # Utilities & infrastructure
│   ├── components/       # Shared UI components
│   └── main.tsx          # Entry point
│
├── server/               # Express backend
│   ├── server.ts         # API server
│   ├── package.json
│   └── tsconfig.json
│
├── package.json          # Frontend config
├── vite.config.ts
└── tsconfig.json
```

---

## Development Workflow

1. **Make API changes** → Restart server (`Ctrl+C`, `pnpm dev`)
2. **Make frontend changes** → Auto-reload (Vite HMR)
3. **Check logs** → Go to Monitoring page in UI
4. **Test endpoints** → Use curl or Postman
5. **Commit changes** → Use `pnpm commit` (Commitizen)

---

## Git & GitHub

### Commit code
```bash
# Interactive commit with commitizen
pnpm commit

# Or manual format
git commit -m "feat(users): add delete functionality"
```

### Push to GitHub
```bash
git push origin main
```

---

## Next Steps

1. ✅ Backend server running
2. ✅ Frontend connected to API
3. ✅ User CRUD working
4. ✅ Real-time logging visible

Now you can:
- Create more features in `src/features/`
- Add more API endpoints in `server/server.ts`
- Customize validation and business logic
- Deploy to production

See `QUICK_START.md` for feature creation guide.
