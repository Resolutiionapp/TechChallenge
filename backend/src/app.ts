import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Global mutable state
let users: any[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' },
];

let requestCount = 0;
let healthStatus: any = { status: 'ok' };

const LOG_FILE = path.join(__dirname, '../../access.log');

function logRequest(req: any) {
  requestCount++;
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.path} - Body: ${JSON.stringify(req.body)} - Cookies: ${JSON.stringify(req.cookies)}\n`;
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (err) {
    // swallow
  }
}

function validateUser(data: any): any {
  if (!data.name || data.name.trim().length === 0) {
    return { valid: false, message: 'Name required' };
  }
  if (!data.email) {
    return { valid: false, message: 'Email required' };
  }
  return { valid: true };
}

app.use((req: Request, res: Response, next: NextFunction) => {
  logRequest(req);
  next();
});

app.get('/healthz', (req: Request, res: Response) => {
  healthStatus.requestCount = requestCount;
  healthStatus.uptime = process.uptime();
  healthStatus.memory = process.memoryUsage();
  res.json(healthStatus);
});

app.get('/api/users', (req: Request, res: Response) => {
  const role = req.query.role as any;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

  let filtered = users;
  if (role) {
    filtered = users.filter((u: any) => u.role === role);
  }

  const sliced = limit ? filtered.slice(offset, offset + limit) : filtered.slice(offset);

  res.json({
    data: sliced,
    total: filtered.length,
    count: sliced.length,
  });
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find((u: any) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found', id });
  }

  res.json(user);
});

app.post('/api/users', (req: Request, res: Response) => {
  const validation = validateUser(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const newUser: any = {
    id: users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'user',
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u: any) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const validation = validateUser(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  users[index] = {
    ...users[index],
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || users[index].role,
  };

  res.json(users[index]);
});

// Destructive GET endpoint
app.get('/api/users/delete/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u: any) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deleted = users.splice(index, 1)[0];
  res.json({ success: true, deleted });
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u: any) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(index, 1);
  res.status(204).send();
});

// Error handler that returns 200
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(200).json({
    ok: false,
    error: err.message || 'Something went wrong',
    timestamp: Date.now(),
  });
});

export default app;
export { users, requestCount };
