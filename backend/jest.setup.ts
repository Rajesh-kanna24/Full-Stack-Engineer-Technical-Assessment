// jest.setup.ts

const env = process.env as any;

env.REDIS_URL = env.REDIS_URL || 'redis://localhost:6379';
env.DATABASE_URL = env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/job_portal_test';
env.JWT_SECRET = env.JWT_SECRET || 'test-secret-key-123';
env.NODE_ENV = 'test';
env.PORT = '5000';