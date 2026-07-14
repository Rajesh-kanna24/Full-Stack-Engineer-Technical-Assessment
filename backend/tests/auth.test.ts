import request from 'supertest';
import app from '../src/app';
import prisma from '../src/database/prisma';

describe('Auth API', () => {
  beforeAll(async () => {
    // Clear user table for tests
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.tokens).toHaveProperty('accessToken');
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.tokens).toHaveProperty('accessToken');
  });

  it('should fail with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });
});
