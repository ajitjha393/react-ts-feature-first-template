import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// ============ Types ============

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// ============ Middleware ============

app.use(cors());
app.use(express.json());

// ============ Data Storage ============

let users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    createdAt: new Date('2024-03-10').toISOString(),
  },
];

// Helper to generate IDs
function generateId(): string {
  const maxId = Math.max(...users.map(u => parseInt(u.id, 10)), 0);
  return String(maxId + 1);
}

// ============ API Routes ============

/**
 * GET /api/users - List all users
 */
app.get('/api/users', (req: Request, res: Response<ApiResponse<User[]>>): void => {
  console.log('[API] GET /api/users');
  res.json({
    success: true,
    data: users,
    count: users.length,
  });
});

/**
 * GET /api/users/:id - Get single user
 */
app.get('/api/users/:id', (req: Request, res: Response<ApiResponse<User>>): void => {
  console.log(`[API] GET /api/users/${req.params.id}`);
  const user = users.find(u => u.id === req.params.id);

  if (!user) {
    res.status(404).json({
      success: false,
      error: `User with ID ${req.params.id} not found`,
    });
    return;
  }

  res.json({
    success: true,
    data: user,
  });
});

/**
 * POST /api/users - Create new user
 */
interface CreateUserRequest {
  name?: string;
  email?: string;
}

app.post('/api/users', (req: Request<unknown, unknown, CreateUserRequest>, res: Response<ApiResponse<User>>): void => {
  console.log('[API] POST /api/users', req.body);
  const { name, email } = req.body;

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'Name is required and must be a non-empty string',
    });
    return;
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({
      success: false,
      error: 'Valid email is required',
    });
    return;
  }

  // Check if email already exists
  if (users.some(u => u.email === email)) {
    res.status(400).json({
      success: false,
      error: `User with email ${email} already exists`,
    });
    return;
  }

  const newUser: User = {
    id: generateId(),
    name: name.trim(),
    email: email.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  console.log(`[API] User created with ID ${newUser.id}`);

  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully',
  });
});

/**
 * PUT /api/users/:id - Update user
 */
interface UpdateUserRequest {
  name?: string;
  email?: string;
}

app.put(
  '/api/users/:id',
  (req: Request<{ id: string }, unknown, UpdateUserRequest>, res: Response<ApiResponse<User>>): void => {
    console.log(`[API] PUT /api/users/${req.params.id}`, req.body);
    const { name, email } = req.body;
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: `User with ID ${req.params.id} not found`,
      });
      return;
    }

    // Validation
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Name must be a non-empty string',
        });
        return;
      }
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({
          success: false,
          error: 'Valid email is required',
        });
        return;
      }

      // Check if email is taken by another user
      if (users.some(u => u.email === email && u.id !== req.params.id)) {
        res.status(400).json({
          success: false,
          error: `User with email ${email} already exists`,
        });
        return;
      }

      user.email = email.trim();
    }

    console.log(`[API] User ${req.params.id} updated`);

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  },
);

/**
 * DELETE /api/users/:id - Delete user
 */
app.delete(
  '/api/users/:id',
  (req: Request<{ id: string }>, res: Response<ApiResponse<User>>): void => {
    console.log(`[API] DELETE /api/users/${req.params.id}`);
    const index = users.findIndex(u => u.id === req.params.id);

    if (index === -1) {
      res.status(404).json({
        success: false,
        error: `User with ID ${req.params.id} not found`,
      });
      return;
    }

    const deletedUser = users.splice(index, 1)[0];
    console.log(`[API] User ${req.params.id} deleted`);

    res.json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully',
    });
  },
);

// ============ Health Check ============

interface HealthResponse {
  status: string;
  timestamp: string;
}

app.get('/api/health', (req: Request, res: Response<HealthResponse>): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ============ Error Handling ============

app.use((req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// ============ Start Server ============

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🚀 React Template API Server (TypeScript)             ║
╠════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}           ║
║  API endpoint: http://localhost:${PORT}/api            ║
╠════════════════════════════════════════════════════════╣
║  Available endpoints:                                   ║
║  - GET    /api/users                                   ║
║  - GET    /api/users/:id                               ║
║  - POST   /api/users                                   ║
║  - PUT    /api/users/:id                               ║
║  - DELETE /api/users/:id                               ║
║  - GET    /api/health                                  ║
╚════════════════════════════════════════════════════════╝
  `);
});
