export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'AI Job Portal API',
    version: '1.0.0',
    description: 'Production-ready job portal API with auth, jobs, dashboards, and scraping.',
  },
  servers: [{ url: 'http://localhost:5000/api/v1', description: 'Local development server' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'API reachable' } },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        responses: { '201': { description: 'Created' } },
      },
    },
    '/jobs': {
      get: {
        summary: 'List jobs',
        responses: { '200': { description: 'Jobs returned' } },
      },
      post: {
        summary: 'Create a job',
        responses: { '201': { description: 'Created' } },
      },
    },
    '/scrape/jobs': {
      post: {
        summary: 'Trigger job scraping',
        responses: { '200': { description: 'Scrape summary' } },
      },
    },
  },
};
