import request from 'supertest';
import app from '../src/app';
import prisma from '../src/database/prisma';

describe('Jobs API', () => {
  beforeAll(async () => {
    await prisma.application.deleteMany();
    await prisma.savedJob.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow an employer to create and list jobs', async () => {
    const employerPayload = {
      name: 'Employer One',
      email: 'employer@example.com',
      password: 'password123',
      role: 'EMPLOYER',
    };

    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send(employerPayload);

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: employerPayload.email, password: employerPayload.password });

    expect(loginRes.status).toBe(200);

    const token = loginRes.body.data.tokens.accessToken;

    const createJobRes = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Senior Frontend Engineer',
        companyName: 'Innov2Grow',
        location: 'Remote',
        employmentType: 'FULL_TIME',
        workMode: 'REMOTE',
        salary: '$140k - $180k',
        experience: '3+ years',
        skills: ['React', 'Next.js', 'TypeScript'],
        benefits: ['Remote first', 'Health insurance'],
        description: 'Build modern AI-powered product experiences.',
        deadline: new Date(Date.now() + 86400000).toISOString(),
      });

    expect(createJobRes.status).toBe(201);
    expect(createJobRes.body.data.title).toBe('Senior Frontend Engineer');

    const listRes = await request(app).get('/api/v1/jobs?page=1&limit=5');
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.jobs.length).toBeGreaterThan(0);
  });
});
