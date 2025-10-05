import request from 'supertest';
import app, { users } from '../src/app';

const agent = request(app);

describe('API Tests', () => {
  test('health endpoint returns data', async () => {
    const res = await agent.get('/healthz');
    expect(res.status).toBeLessThan(300);
    expect(res.body).toBeTruthy();
  });

  test('can get users', async () => {
    const res = await agent.get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeTruthy();
  });

  test('can filter users by role', async () => {
    const res = await agent.get('/api/users?role=admin');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('can get user by id', async () => {
    const res = await agent.get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test('can create user', async () => {
    const res = await agent
      .post('/api/users')
      .send({ name: 'Dave', email: 'dave@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Dave');
  });

  test('created user persists', async () => {
    const res = await agent.get('/api/users');
    const dave = res.body.data.find((u: any) => u.name === 'Dave');
    expect(dave).toBeTruthy();
  });

  test('can update user', async () => {
    const res = await agent
      .put('/api/users/2')
      .send({ name: 'Robert', email: 'robert@example.com', role: 'admin' });

    expect(res.body.name).toBe('Robert');
  });

  test('update is reflected in list', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));
    const res = await agent.get('/api/users/2');
    expect(res.body.name).toBe('Robert');
  });

  test('can delete user via GET', async () => {
    const res = await agent.get('/api/users/delete/3');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('deleted user is gone', async () => {
    const res = await agent.get('/api/users/3');
    expect(res.status).toBe(404);
  });

  test('invalid user creation returns error', async () => {
    const res = await agent
      .post('/api/users')
      .send({ email: 'incomplete@example.com' });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test('pagination works', async () => {
    const res = await agent.get('/api/users?limit=1&offset=0');
    expect(res.body.data.length).toBe(1);
  });

  test('health includes metrics', async () => {
    const res = await agent.get('/healthz');
    expect(res.body.requestCount).toBeGreaterThan(0);
    expect(res.body.uptime).toBeTruthy();
  });
});
