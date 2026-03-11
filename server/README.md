# React Template Server

A simple TypeScript/Express API server for the React Template.

## Setup

### Install Dependencies

```bash
cd server
pnpm install
```

### Run Server

**Development mode** (with auto-reload):
```bash
pnpm dev
```

**Production mode** (compiled):
```bash
pnpm build
pnpm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Users

#### List all users
```bash
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

#### Get user by ID
```bash
GET /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

#### Create user
```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "4",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-03-11T12:34:56.000Z"
  },
  "message": "User created successfully"
}
```

#### Update user
```bash
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "User updated successfully"
}
```

#### Delete user
```bash
DELETE /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "User deleted successfully"
}
```

### Health Check

```bash
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-03-11T12:34:56.000Z"
}
```

---

## Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Storage

Currently uses **in-memory storage** (data resets on server restart).

To add database:
1. Replace `users` array with database queries
2. Update type definitions as needed
3. Add error handling for database operations

---

## Development

### Type Checking
```bash
npx tsc --noEmit
```

### Tech Stack
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests
- **tsx** - TypeScript execution
